import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SentimentDocument = HydratedDocument<Sentiment>;

@Schema()
export class Sentiment {
  @Prop()
  text: string;

  @Prop()
  magnitude: number;

  @Prop()
  score: number;
}

export const SentimentSchema = SchemaFactory.createForClass(Sentiment);
