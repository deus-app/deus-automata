import { z } from 'zod';

export const llmStatus = ['clicked', 'scrolled', 'completed'] as const;

export const coordinatesParser = z
  .object({
    x: z.number().describe("x coordinate from the element's top left corner"),
    y: z.number().describe("y coordinate from the element's top left corner"),
  })
  .describe('Coordinates of the element');

export const visionParser = z.object({
  coordinates: coordinatesParser,
  results: z.string().describe('Recommendations for adjustments'),
  description: z.string().describe('Description of the action done on the element'),
  status: z
    .enum(llmStatus)
    .describe(
      'Status of the inspection, either clicked, scrolled, or completed. If completed, the inspection is done.'
    ),
});

export type CoordinatesModel = z.infer<typeof coordinatesParser>;
export type VisionModel = z.infer<typeof visionParser>;
