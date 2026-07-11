import { AIProvider, AICompletionRequest, AICompletionResponse } from '../types';

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private baseURL?: string;
  private defaultModel: string;

  constructor(apiKey: string, options: { baseURL?: string; defaultModel?: string } = {}) {
    this.apiKey = apiKey;
    this.baseURL = options.baseURL;
    this.defaultModel = options.defaultModel || 'gpt-4';
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getProviderName(): string {
    return 'OpenAI';
  }

  async generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI provider is not configured. Missing API key.');
    }

    try {
      // Dynamic import to avoid build-time dependency
      const OpenAI = require('openai');
      const openai = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.baseURL,
      });

      const model = request.model || this.defaultModel;

      const response = await openai.chat.completions.create({
        model,
        messages: [
          ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
          { role: 'user', content: request.prompt },
        ],
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens ?? 4000,
      });

      const choice = response.choices[0];
      if (!choice) {
        throw new Error('No completion returned from OpenAI');
      }

      return {
        content: choice.message.content || '',
        model,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
        metadata: {
          finishReason: choice.finish_reason,
          ...request.context,
        },
      };
    } catch (error: any) {
      throw new Error(`OpenAI provider error: ${error.message}`);
    }
  }
}