import { StructuredOutputParser } from 'langchain/output_parsers';
import type { ZodSchema } from 'zod';

export const createLlmParser = <T>(schema: ZodSchema<T>) => {
  const outputParser = StructuredOutputParser.fromZodSchema(schema);

  return {
    getFormatInstruction: (): string => {
      return outputParser.getFormatInstructions();
    },
    async parse(input: string): Promise<T> {
      return await outputParser.parse(input);
    },
  };
};
