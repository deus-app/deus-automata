import { appUseCase } from '$/domain/app/useCase/appUseCase';
import { z } from 'zod';
import { defineController } from './$relay';

export default defineController(() => ({
  post: {
    validators: {
      body: z.object({
        url: z.string(),
        requirements: z.string(),
      }),
    },
    handler: async ({ body }) => {
      const content = await appUseCase.automata(body.url, body.requirements);

      if (content === null) {
        return {
          status: 400,
          body: 'GPT-4-Vision failed to generate content',
        };
      }

      return {
        status: 200,
        body: content.content,
      };
    },
  },
}));
