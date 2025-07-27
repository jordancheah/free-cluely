import { LLMProvider, LLMResponse } from './types';
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import fs from "fs";

export class GeminiProvider implements LLMProvider {
  private model: GenerativeModel;
  private readonly systemPrompt = `You are Wingman AI, a helpful, proactive assistant for any kind of problem or situation (not just coding). For any user input, analyze the situation, provide a clear problem statement, relevant context, and suggest several possible responses or actions the user could take next. Always explain your reasoning. Present your suggestions as a list of options or next steps.`;

  constructor(apiKey: string, modelName: string = "gemini-2.0-flash") {
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: modelName });
  }

  private async fileToGenerativePart(imagePath: string) {
    const imageData = await fs.promises.readFile(imagePath);
    return {
      inlineData: {
        data: imageData.toString("base64"),
        mimeType: "image/png"
      }
    };
  }

  private cleanJsonResponse(text: string): string {
    text = text.replace(/^```(?:json)?\n/, '').replace(/\n```$/, '');
    return text.trim();
  }

  public async generateResponse(prompt: string, images?: string[]): Promise<LLMResponse> {
    try {
      const imageParts = images ? await Promise.all(images.map(path => this.fileToGenerativePart(path))) : [];
      
      const fullPrompt = `${this.systemPrompt}\n\n${prompt}\n\nReturn response in JSON format:\n{
  "problem_statement": "A clear statement of the problem or situation.",
  "context": "Relevant background or context.",
  "suggested_responses": ["First possible answer or action", "Second possible answer or action", "..."],
  "reasoning": "Explanation of why these suggestions are appropriate."
}\nImportant: Return ONLY the JSON object, without any markdown formatting or code blocks.`;

      const result = await this.model.generateContent([fullPrompt, ...imageParts]);
      const response = await result.response;
      const text = this.cleanJsonResponse(response.text());
      return JSON.parse(text);
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}
