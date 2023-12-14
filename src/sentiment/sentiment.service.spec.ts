import { Test, TestingModule } from '@nestjs/testing';
import { SentimentService } from './sentiment.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sentiment } from './schemas/sentiment.schema';
import { GoogleLanguageService } from '../google-language/google-language.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SentimentService', () => {
  let sentimentService: SentimentService;
  let sentimentModel: Model<Sentiment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SentimentService,
        GoogleLanguageService,
        {
          provide: getModelToken('Sentiment'),
          useValue: {
            create: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    sentimentService = module.get<SentimentService>(SentimentService);
    sentimentModel = module.get<Model<Sentiment>>(getModelToken('Sentiment'));
  });

  describe('findAll', () => {
    it('should return all sentiment objects', async () => {
      const sentimentObjects = [
        {
          text: 'This is a test',
          magnitude: 0.5,
          score: 0.8,
        },
        {
          text: 'Another test',
          magnitude: 0.6,
          score: 0.9,
        },
      ];

      sentimentModel.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(sentimentObjects),
      });

      const result = await sentimentService.findAll();

      expect(sentimentModel.find).toHaveBeenCalled();
      expect(result).toEqual(sentimentObjects);
    });
  });

  describe('findOne', () => {
    it('should return a sentiment object if valid id is provided', async () => {
      const sentimentObject = {
        text: 'This is a test',
        magnitude: 0.5,
        score: 0.8,
      };

      const validId = '605c5432fe33920708c581ce';

      sentimentModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(sentimentObject),
      });

      const result = await sentimentService.findOne(validId);

      expect(sentimentModel.findById).toHaveBeenCalledWith(validId);
      expect(result).toEqual(sentimentObject);
    });

    it('should throw BadRequestException if invalid id is provided', async () => {
      const invalidId = 'invalidId';

      sentimentModel.findById = jest.fn();

      await expect(sentimentService.findOne(invalidId)).rejects.toThrow(
        BadRequestException,
      );
      expect(sentimentModel.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if no sentiment object is found', async () => {
      const validId = '605c5432fe33920708c581ce';

      sentimentModel.findById = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      });

      await expect(sentimentService.findOne(validId)).rejects.toThrow(
        NotFoundException,
      );
      expect(sentimentModel.findById).toHaveBeenCalledWith(validId);
    });
  });
});
