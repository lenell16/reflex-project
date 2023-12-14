import { Test, TestingModule } from '@nestjs/testing';
import { SentimentController } from './sentiment.controller';
import { SentimentService } from './sentiment.service';
import { GoogleLanguageService } from '../google-language/google-language.service';
import { getModelToken } from '@nestjs/mongoose';
import { Sentiment } from './schemas/sentiment.schema';
import { Model } from 'mongoose';
import { CreateSentimentDto } from './dto/create-sentiment.dto';

describe('SentimentController', () => {
  let controller: SentimentController;
  let service: SentimentService;
  let sentimentModel: Model<Sentiment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentimentController],
      providers: [
        SentimentService,
        GoogleLanguageService,
        { provide: getModelToken(Sentiment.name), useValue: sentimentModel },
      ],
    }).compile();

    controller = module.get<SentimentController>(SentimentController);
    service = module.get<SentimentService>(SentimentService);
  });

  describe('create', () => {
    it('should create a new sentiment', async () => {
      const createSentimentDto: CreateSentimentDto = {
        text: 'This is a test',
      };
      const createdSentiment = {
        id: '1',
        magnitude: 0.5,
        score: 0.8,
        ...createSentimentDto,
      };
      jest.spyOn(service, 'create').mockResolvedValue(createdSentiment);

      const result = await controller.create(createSentimentDto);

      expect(result).toEqual(createdSentiment);
      expect(service.create).toHaveBeenCalledWith(createSentimentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of sentiments', async () => {
      const sentiments = [
        {
          text: 'This is a test',
          magnitude: 0.5,
          score: 0.8,
        },
        {
          text: 'This is another test',
          magnitude: 0.1,
          score: 0.2,
        },
        {
          text: 'This is a test',
          magnitude: 0.5,
          score: 0.8,
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(sentiments);

      const result = await controller.findAll();

      expect(result).toEqual(sentiments);
    });
  });

  describe('findOne', () => {
    it('should return a sentiment', async () => {
      const sentiment = {
        text: 'This is a test',
        magnitude: 0.5,
        score: 0.8,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(sentiment);

      const result = await controller.findOne('1');

      expect(result).toEqual(sentiment);
    });
  });

  describe('remove', () => {
    it('should remove a sentiment', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
