import { RequestHandler, Request, Response, NextFunction } from "express";

/**
 * Dirty hack required since express does not support catching exceptions from async code
 * @param handler async express middleware function (req,res,next)
 * @returns express middleware function wrapped in a try-catch
 *
 * @note "You must catch errors that occur in asynchronous code invoked by route handlers or middleware and pass them to Express for processing"
 * @see https://expressjs.com/en/guide/error-handling.html
 * @note should be fixed in express v5 if it ever gets released
 */
function catchAsync<
  P,
  ResBody,
  ReqBody,
  ReqQuery,
  LocalsObj extends Record<string, any>
>(
  handler: (
    req: Request<P, ResBody, ReqBody, ReqQuery, LocalsObj>,
    res: Response<ResBody, LocalsObj>,
    next: NextFunction
  ) => Promise<void>
): RequestHandler<P, ResBody, ReqBody, ReqQuery, LocalsObj> {
  return (req, res, next) => {
    handler(req, res, next).catch(next);
  };
}

export default catchAsync;
