import type { DefineMethods } from 'aspida';
import type { VisionModel } from 'commonTypesWithClient/models';
export type Methods = DefineMethods<{
  // TODO: Change body type
  post: {
    reqBody: {
      url: string;
      requirements: string;
    };
    resBody: VisionModel;
  };
}>;
