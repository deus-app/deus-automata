import { OPENAI_KEY } from '$/service/envValues';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import type { BaseLanguageModelInput } from 'langchain/dist/base_language';
import { z, type ZodSchema } from 'zod';
import { createLlmParser } from './parser';

const llm = new ChatOpenAI({
  modelName: 'gpt-4-vision-preview',
  openAIApiKey: OPENAI_KEY,
  // Max tokens for demo purposes
  maxTokens: 256,
});

export const invokeOrThrow = async <T extends ZodSchema>(
  prompt: BaseLanguageModelInput,
  parser: T,
  count = 3
): Promise<z.infer<T>> => {
  return await llm
    .invoke(prompt)
    .then(async (content) => {
      const contentParser = createLlmParser(parser);
      const contentString = z
        .object({
          content: z.string(),
        })
        .parse(content).content;
      return await contentParser.parse(contentString);
    })
    .catch((e) => {
      console.error('Failed to parse bad output:', e);
      if (count === 0) {
        throw e;
      }
      return invokeOrThrow(prompt, parser, count - 1);
    });
};
