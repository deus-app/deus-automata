import type { DefineMethods } from 'aspida';
import type { UserRequirementsModel, VisionModel } from 'commonTypesWithClient/models';
export type Methods = DefineMethods<{
  // TODO: Change body type
  post: {
    reqBody: UserRequirementsModel;
    resBody: VisionModel;
  };
}>;
