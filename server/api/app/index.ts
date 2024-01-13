import type { DefineMethods } from 'aspida';
import type { AutomataModel, UserRequirementsModel } from 'commonTypesWithClient/automataModels';

export type Methods = DefineMethods<{
  // TODO: Change body type
  post: {
    reqBody: UserRequirementsModel;
    resBody: AutomataModel;
  };
}>;
