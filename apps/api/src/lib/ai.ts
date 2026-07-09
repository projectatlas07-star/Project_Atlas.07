// apps/api/src/lib/ai.ts
import OpenAI from 'openai';

// Initialize OpenAI client – requires OPENAI_API_KEY env variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a response using the default model (gpt-4o-mini).
 * @param prompt The user prompt or system instruction.
 * @param temperature Temperature for sampling (default 0.7).
 * @returns The generated text response.
 */
export async function generateAIResponse(prompt: string, temperature = 0.7): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature,
    max_tokens: 1024,
  });
  return completion.choices[0].message.content ?? '';
}

/**
 * Convenience helper to generate interview answer based on question and optional context documents.
 * @param question The interview question.
 * @param contextText Optional concatenated text from uploaded documents.
 */
export async function generateInterviewAnswer(question: string, contextText?: string): Promise<string> {
  const prompt = contextText
    ? `You are an expert interview evaluator. Using the following context, answer the question concisely and provide a brief assessment.\n\nContext:\n${contextText}\n\nQuestion: ${question}`
    : `You are an expert interview evaluator. Answer the following interview question concisely and provide a brief assessment.\n\nQuestion: ${question}`;
  return generateAIResponse(prompt);
}
