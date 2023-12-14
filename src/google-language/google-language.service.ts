import { Injectable } from '@nestjs/common';
import { LanguageServiceClient } from '@google-cloud/language';
import { google } from '@google-cloud/language/build/protos/protos';

const client = new LanguageServiceClient();

@Injectable()
export class GoogleLanguageService {
  async analyzeSentiment(text: string) {
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    } as google.cloud.language.v1beta2.IDocument;

    const [result] = await client.analyzeSentiment({ document: document });
    return result;
  }
}
