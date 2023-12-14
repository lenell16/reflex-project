import { Test, TestingModule } from '@nestjs/testing';
import { GoogleLanguageService } from './google-language.service';

jest.mock('@google-cloud/language', () => {
  return {
    LanguageServiceClient: jest.fn().mockImplementation(() => {
      return {
        analyzeSentiment: jest.fn().mockResolvedValue([
          {
            documentSentiment: {
              score: 0.8,
              magnitude: 0.9,
            },
          },
        ]),
      };
    }),
  };
});

describe('GoogleLanguageService', () => {
  let service: GoogleLanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleLanguageService],
    }).compile();

    service = module.get<GoogleLanguageService>(GoogleLanguageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('analyzeSentiment', () => {
    it('should analyze sentiment of the given text', async () => {
      const text = 'This is a test text.';
      const expectedResult = {
        documentSentiment: {
          magnitude: 0.9,
          score: 0.8,
        },
      };

      const result = await service.analyzeSentiment(text);

      expect(result).toEqual(expectedResult);
    });
  });
});
