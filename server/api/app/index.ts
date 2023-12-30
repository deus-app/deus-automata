import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  // TODO: Change body type
  post: {
    reqBody: {
      url: string;
      requirements: string;
    };
    resBody: string;
  };
}>;
