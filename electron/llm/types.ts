export interface Solution {
  code: string;
  problem_statement: string;
  context: string;
  suggested_responses: string[];
  reasoning: string;
}

export interface LLMResponse {
  solution: Solution;
}

export interface LLMProvider {
  generateResponse(prompt: string, images?: string[]): Promise<LLMResponse>;
}

export interface LLMConfig {
  provider: string;
  apiKey: string;
  model?: string;
}
