import { LLMConfig, LLMProvider, LLMResponse } from './llm/types';
import { LLMFactory } from './llm/factory';
import fs from 'fs';

export class LLMHelper {
  private provider: LLMProvider;
  private readonly systemPrompt = `You are Wingman AI, a helpful, proactive assistant for any kind of problem or situation (not just coding). For any user input, analyze the situation, provide a clear problem statement, relevant context, and suggest several possible responses or actions the user could take next. Always explain your reasoning. Present your suggestions as a list of options or next steps.`;

  constructor(config: LLMConfig) {
    this.provider = LLMFactory.createProvider(config);
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

  public async extractProblemFromImages(imagePaths: string[]): Promise<LLMResponse> {
    try {
      const prompt = `Please analyze these images and extract the key information.`;
      return await this.provider.generateResponse(prompt, imagePaths);
    } catch (error) {
      console.error("Error extracting problem from images:", error);
      throw error;
    }
  }

  public async generateSolution(problemInfo: any): Promise<LLMResponse> {
    console.log("[LLMHelper] Calling LLM for solution...");
    try {
      const prompt = `Given this problem or situation:\n${JSON.stringify(problemInfo, null, 2)}\n\nProvide a solution with code implementation if applicable.`;
      const response = await this.provider.generateResponse(prompt);
      console.log("[LLMHelper] Parsed LLM response:", response);
      // Ensure the response matches our expected format
      if (!response.solution) {
        throw new Error("Invalid response format: missing solution object");
      }
      return response;
    } catch (error) {
      console.error("[LLMHelper] Error in generateSolution:", error);
      throw error;
    }
  }

  public async debugSolutionWithImages(problemInfo: any, currentCode: string, debugImagePaths: string[]): Promise<LLMResponse> {
    try {
      const prompt = `Given:\n1. The original problem or situation: ${JSON.stringify(problemInfo, null, 2)}\n2. The current response or approach: ${currentCode}\n3. Please analyze the debug information in the provided images`;
      return await this.provider.generateResponse(prompt, debugImagePaths);
    } catch (error) {
      console.error("Error debugging solution with images:", error);
      throw error;
    }
  }

  public async analyzeAudioFile(audioPath: string): Promise<{text: string, timestamp: number}> {
    try {
      const prompt = "Describe this audio clip in a short, concise answer and suggest several possible actions or responses.";
      const response = await this.provider.generateResponse(prompt, [audioPath]);
      return {
        text: response.solution.suggested_responses.join("\n"),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error("Error analyzing audio file:", error);
      throw error;
    }
  }

  public async analyzeAudioFromBase64(data: string, mimeType: string): Promise<{text: string, timestamp: number}> {
    try {
      // Note: This might need to be implemented differently depending on the provider's capabilities
      const prompt = "Describe this audio clip in a short, concise answer and suggest several possible actions or responses.";
      const response = await this.provider.generateResponse(prompt);
      return {
        text: response.solution.suggested_responses.join("\n"),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error("Error analyzing audio from base64:", error);
      throw error;
    }
  }

  public async analyzeImageFile(imagePath: string): Promise<{text: string, timestamp: number}> {
    try {
      const prompt = "Describe the content of this image in a short, concise answer and suggest several possible actions or responses.";
      const response = await this.provider.generateResponse(prompt, [imagePath]);
      return {
        text: response.solution.suggested_responses.join("\n"),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error("Error analyzing image file:", error);
      throw error;
    }
  }
} 