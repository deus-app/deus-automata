export const returnSuccess = <T>(val: T) => ({ status: 200 as const, body: val });

const logErr = (e: unknown) => {
  if (!(e instanceof Error)) return;

  console.error(e.stack);
};

export const returnPostError = (e: unknown) => {
  logErr(e);

  return { status: 403 as const };
};
