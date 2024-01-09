import { visionParser, type VisionModel } from '$/commonTypesWithClient/models';
import { OPENAI_KEY } from '$/service/envValues';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { z } from 'zod';
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
      .then((content) =>
        parseVisionJsonOutput(
          z
            .object({
              content: z.string(),
            })
            .parse(content).content
        )
      )
      .catch((e) => {
        console.error(e);
        return null;
      });

    return res;
  },
};

const parseVisionJsonOutput = (content: string): VisionModel | null => {
  // Result is return in ```json { "content": "..." }``` format
  const parsedContent = JSON.parse(content.trim().replace('```json\n', '').replace('```', ''));
  const validationResult = visionParser.safeParse(parsedContent);

  if (validationResult.success === false) {
    console.error(validationResult.error);
    return null;
  }

  return validationResult.data;
};
