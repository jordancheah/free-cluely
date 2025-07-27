export interface LLMResponse {
  problem_statement: string;
  context: string;
  suggested_responses: string[];
  reasoning: string;
}

export interface LLMProvider {
  generateResponse(prompt: string, images?: string[]): Promise<LLMResponse>;
}

export interface LLMConfig {
  provider: string;
  apiKey: string;
  model?: string;
}
