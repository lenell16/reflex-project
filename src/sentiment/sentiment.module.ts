import { Module } from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { SentimentController } from './sentiment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SentimentSchema } from './schemas/sentiment.schema';
import { GoogleLanguageService } from '../google-language/google-language.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Sentiment', schema: SentimentSchema }]),
  ],
  controllers: [SentimentController],
  providers: [SentimentService, GoogleLanguageService],
})
export class SentimentModule {}
