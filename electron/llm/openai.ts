import { LLMProvider, LLMResponse } from './types';
import OpenAI from 'openai';
import fs from 'fs';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private readonly systemPrompt = `You are Wingman AI, a helpful, proactive assistant for any kind of problem or situation (not just coding). For any user input, analyze the situation, provide a clear problem statement, relevant context, and suggest several possible responses or actions the user could take next. Always explain your reasoning. Present your suggestions as a list of options or next steps.`;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  private async prepareImages(imagePaths: string[]) {
    return await Promise.all(imagePaths.map(async (path) => {
      const buffer = await fs.promises.readFile(path);
      return {
        data: buffer,
        type: 'image/png'
      };
    }));
  }

  public async generateResponse(prompt: string, images?: string[]): Promise<LLMResponse> {
    try {
      const messages: any[] = [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: [
          { type: 'text', text: prompt }
        ]}
      ];

      if (images && images.length > 0) {
        const imageFiles = await this.prepareImages(images);
        messages[1].content.push(...imageFiles);
      }

      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages,
        response_format: { type: 'json_object' }
      });

      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}
