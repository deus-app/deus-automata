import { OPENAI_API_KEY } from '$/service/envValues';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage } from 'langchain/schema';
import { z } from 'zod';

const llm = new ChatOpenAI({
  modelName: 'gpt-4-vision-preview',
  openAIApiKey: OPENAI_API_KEY,
  maxTokens: 1024,
});

export const llmRepo = {
  vision: async (screenshot?: Buffer) => {
    const message = new HumanMessage({
      content: [
        {
          type: 'text',
          text: "What's in this image?",
        },
        {
          type: 'image_url',
          // image_url: {
          //   url: `data:image/jpeg;base64,${screenshot.toString('base64')}`,
          // },
          image_url: {
            url: 'https://blog.langchain.dev/content/images/size/w1248/format/webp/2023/10/Screenshot-2023-10-03-at-4.55.29-PM.png',
            detail: 'low',
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
