import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { CreateSentimentDto } from './dto/create-sentiment.dto';

@Controller('sentiment')
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) {}

  @Post()
  create(@Body() createSentimentDto: CreateSentimentDto) {
    return this.sentimentService.create(createSentimentDto);
  }

  @Get()
  findAll() {
    return this.sentimentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sentimentService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sentimentService.remove(id);
  }
}
