import { z } from 'zod';
import { taskIdParser } from '../service/idParsers';
import type { UserId } from './ids';

export type UserModel = {
  id: UserId;
  email: string;
  displayName: string | undefined;
  photoURL: string | undefined;
};

export const taskParser = z.object({
  id: taskIdParser,
  label: z.string(),
  done: z.boolean(),
  created: z.number(),
});

export type TaskModel = z.infer<typeof taskParser>;

export const visionParser = z.object({
  coordinates: z.object({
    x: z.number().describe("x coordinate from the element's top left corner"),
    y: z.number().describe("y coordinate from the element's top left corner"),
  }),
  recommendations: z.array(z.string()).describe('Recommendations for adjustments'),
  description: z.string().describe('Description of the action done on the element'),
});

export type VisionModel = z.infer<typeof visionParser>;
