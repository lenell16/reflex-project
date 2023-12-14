import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSentimentDto } from './dto/create-sentiment.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sentiment } from './schemas/sentiment.schema';
import { Sentiment as SentimentEntity } from './entities/sentiment.entity';
import { GoogleLanguageService } from '../google-language/google-language.service';

@Injectable()
export class SentimentService {
  constructor(
    @InjectModel('Sentiment') private sentimentModel: Model<Sentiment>,
    private googleLanguageService: GoogleLanguageService,
  ) {}

  async create(createSentimentDto: CreateSentimentDto): Promise<Sentiment> {
    const result = await this.googleLanguageService.analyzeSentiment(
      createSentimentDto.text,
    );

    // Transform result into sentiment entity
    const sentimentObj: SentimentEntity = {
      text: createSentimentDto.text,
      magnitude: result.documentSentiment.magnitude,
      score: result.documentSentiment.score,
    };

    // Create sentiment object in MongoDB
    const createdSentiment = new this.sentimentModel(sentimentObj);

    // Return sentiment object
    return createdSentiment.save();
  }

  findAll(): Promise<Sentiment[]> {
    return this.sentimentModel.find().exec();
  }

  async findOne(id: string): Promise<Sentiment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const sentiment = await this.sentimentModel.findById(id).exec();
    if (!sentiment) {
      throw new NotFoundException('Item not found');
    }
    return sentiment;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID');
    }

    const sentiment = await this.sentimentModel.findByIdAndDelete(id).exec();
    if (!sentiment) {
      throw new NotFoundException('Item not found');
    }
    return sentiment;
  }
}
