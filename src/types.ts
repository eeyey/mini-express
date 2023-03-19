import http from 'http';

export type RequestMethod = 'POST' | 'GET' | 'UPDATE' | 'DELETE' | 'PUT';

export interface Request<Params = {}, ReqBody = {}>
  extends http.IncomingMessage {
  body: ReqBody;
  params: Params;
  path: string;
  host: string;
  hostname: string;
  pathname: string;
  port: string;
  search: string;
  searchParams: URLSearchParams;
}
export interface Response extends http.ServerResponse {
  req: Request;

  status: (code: number) => Response;
  json: (body: any) => void;
}
export type RequestHandler<Params = {}, ReqBody = {}> = (
  req: Request<Params, ReqBody>,
  res: Response,
) => void;

export type MiddlewareHandler<Params = {}, ReqBody = {}> = RequestHandler<
  Params,
  ReqBody
>;
