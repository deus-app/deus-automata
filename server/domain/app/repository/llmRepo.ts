import { OPENAI_KEY } from '$/service/envValues';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from 'langchain/schema';
import { z } from 'zod';

const llm = new ChatOpenAI({
  modelName: 'gpt-4-vision-preview',
  openAIApiKey: OPENAI_KEY,
  // Max tokens for demo purposes
  maxTokens: 1024,
});

export const llmRepo = {
  vision: async (screenshot: Buffer) => {
    const message = new HumanMessage({
      content: [
        {
          type: 'text',
          text: "What's in this image?",
        },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${screenshot.toString('base64')}`,
            detail: 'low',
            // Detail is low for demo purposes
          },
        },
      ],
    });

    const res = await llm
      .invoke([message])
      .then((content) => {
        console.log(content);
        return z
          .object({
            content: z.string(),
          })
          .parse(content);
      })
      .catch((e) => {
        console.error(e);
        return null;
      });

    return res;
  },
};
