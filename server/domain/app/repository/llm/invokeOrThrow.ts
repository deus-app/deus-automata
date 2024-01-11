import type { ConversationChain } from 'langchain/chains';
import type { HumanMessage } from 'langchain/schema';
import { z, type ZodSchema } from 'zod';
import { createLlmParser } from './parser';

export const invokeOrThrow = async <T extends ZodSchema>(
  humanMessage: HumanMessage,
  parser: T,
  chain: ConversationChain,
  count = 3
): Promise<z.infer<T>> => {
  return await chain
    .invoke({ input: [humanMessage] })
    .then(async (response) => {
      const outputParser = createLlmParser(parser);
      const responseString = z
        .object({
          response: z.string(),
        })
        .parse(response).response;
      const result = await outputParser.parse(responseString);
      console.log('result', result);
      return result;
    })
    .catch((e) => {
      console.error('Failed to parse bad output:', e);
      if (count === 0) {
        throw e;
      }
      return invokeOrThrow(humanMessage, parser, chain, count - 1);
    });
};
