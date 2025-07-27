import { LLMConfig, LLMProvider } from './types';
import { GeminiProvider } from './gemini';
import { OpenAIProvider } from './openai';

export class LLMFactory {
  static createProvider(config: LLMConfig): LLMProvider {
    switch (config.provider.toLowerCase()) {
      case 'gemini':
        return new GeminiProvider(config.apiKey, config.model);
      case 'openai':
        return new OpenAIProvider(config.apiKey);
      default:
        throw new Error(`Unsupported LLM provider: ${config.provider}`);
    }
  }
}
