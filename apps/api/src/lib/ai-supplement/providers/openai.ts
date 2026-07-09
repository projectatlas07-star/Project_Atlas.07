// apps/api/src/lib/ai-supplement/providers/openai.ts
import { AIProvider, AICompletionRequest, AICompletionResponse } from '../types';

export class OpenAIProvider implements AIProvider {
  private apiKey: string;
  private baseUrl: string;
  private model: string;

  constructor(config: { apiKey: string; baseUrl?: string; model?: string }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    this.model = config.model || 'gpt-4-turbo-preview';
  }

  async generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: request.model || this.model,
          messages: [
            ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
            { role: 'user', content: request.prompt },
          ],
          temperature: request.temperature ?? 0.7,
          max_tokens: request.maxTokens ?? 4000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${error}`);
      }

      const data = await response.json() as {
        model: string;
        choices: Array<{ message: { content: string }; finish_reason: string }>;
        usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
      };
      const choice = data.choices[0];

      return {
        content: choice.message.content,
        model: data.model,
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        },
        metadata: {
          finishReason: choice.finish_reason,
        },
      };
    } catch (error) {
      throw new Error(`OpenAI provider error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }

  getProviderName(): string {
    return 'OpenAI';
  }
}
