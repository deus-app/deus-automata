import { visionParser, type VisionModel } from '$/commonTypesWithClient/models';
import { OPENAI_KEY } from '$/service/envValues';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';
import { z } from 'zod';

const llm = new ChatOpenAI({
  modelName: 'gpt-4-vision-preview',
  openAIApiKey: OPENAI_KEY,
  // Max tokens for demo purposes
  maxTokens: 256,
});

const parseVisionJsonOutput = (content: string): VisionModel | null => {
  // Result is return in ```json { "content": "..." }``` format
  const parsedContent = JSON.parse(content.trim().replace('```json\n', '').replace('```', ''));
  const validationResult = visionParser.safeParse(parsedContent);

  if (!validationResult.success) {
    console.error(validationResult.error);
    return null;
  }

  return validationResult.data;
};

export const llmRepo = {
  vision: async (screenshot: Buffer, requirements: string): Promise<VisionModel | null> => {
    const systemMessage = new SystemMessage(
      'You are a senior web application developer. Follow the user instructions to complete the web service.'
    );
    const humanMessage = new HumanMessage({
      content: [
        {
          type: 'image_url',
          image_url: {
            url: `data:image/jpeg;base64,${screenshot.toString('base64')}`,
            detail: 'low',
            // Detail is low for demo purposes
          },
        },
        {
          type: 'text',
          text: `Analyze the screenshot. 
          Please provide one x and y pixel from top left position where you want to click to inspect and interact. 
          Provide a structured response with the identified elements and their positions, along with any recommendations for adjustments.
          Return response in JSON format based on below schema strictly without any text or comments.
          {
            "positions": {
              "x": 100,
              "y": 100,
            },
            recommendations: [
              "Change the button color to red"
            ]
          }

          If you don't want to provide any recommendations or any positions to click, please provide an empty JSON based on below schema.
          {}
          `,
        },
        {
          type: 'text',
          text: `This is a requirements: ${requirements}`,
        },
      ],
    });

    const res: VisionModel | null = await llm
      .invoke([systemMessage, humanMessage])
      .then((content) => {
        const parsedJsonContent: VisionModel | null = parseVisionJsonOutput(
          z
            .object({
              content: z.string(),
            })
            .parse(content).content
        );

        return parsedJsonContent;
      })
      .catch((e) => {
        console.error(e);
        return null;
      });

    return res;
  },
};
