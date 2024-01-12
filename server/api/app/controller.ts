import { appUseCase } from '$/domain/app/useCase/appUseCase';
import { returnPostError, returnSuccess } from '$/service/returnStatus';
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
    handler: async ({ body }) =>
      await appUseCase.init(body).then(returnSuccess).catch(returnPostError),
  },
}));
