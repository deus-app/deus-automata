import { visionParser, type VisionModel } from '$/commonTypesWithClient/models';
import { OPENAI_KEY } from '$/service/envValues';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { z } from 'zod';
import { createLlmParser } from './parser';
import { llmPrompt } from './prompt';

const llm = new ChatOpenAI({
  modelName: 'gpt-4-vision-preview',
  openAIApiKey: OPENAI_KEY,
  // Max tokens for demo purposes
  maxTokens: 256,
});

export const llmRepo = {
  vision: async (screenshot: Buffer, requirements: string): Promise<VisionModel | null> => {
    const systemMessage = llmPrompt.initSystemMessage();
    const humanMessage = llmPrompt.initHumanMessage(screenshot, requirements);

    const res: VisionModel | null = await llm
      .invoke([systemMessage, humanMessage])
      .then(async (content) => {
        const contentString = z
          .object({
            content: z.string(),
          })
          .parse(content).content;
        const outputParser = createLlmParser(visionParser);
        return await outputParser.parse(contentString);
      })
      .catch((e) => {
        console.error(e);
        return null;
      });

    return res;
  },
};
