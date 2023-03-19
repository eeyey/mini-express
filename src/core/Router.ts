import { RequestHandler, RequestMethod } from '../types';

type Endpoints = Partial<Record<RequestMethod, RequestHandler>>;

export default class Router {
  endpoints: Record<string, Endpoints> = {};

  paramsReg = /\/{0,1}:(.+?)(\/|$)/g;

  request<Params = {}>(
    method: RequestMethod,
    route: string,
    handler: RequestHandler<Params>,
  ) {
    const regString = route.replaceAll(this.paramsReg, '/(?<$1>.+)');
    const path = Router.removeSlashes(regString);

    if (!this.endpoints[path]) {
      this.endpoints[path] = {
        [method]: handler,
      };
    } else {
      if (this.endpoints[path][method])
        throw new Error(`По адресу ${path} уже существует метод ${method}`);

      this.endpoints[path][method] = handler;
    }
  }

  get<Params = {}, ReqBody = {}>(
    path: string,
    handler: RequestHandler<Params, ReqBody>,
  ) {
    this.request('GET', path, handler);
  }

  post<Params = {}, ReqBody = {}>(
    path: string,
    handler: RequestHandler<Params, ReqBody>,
  ) {
    this.request('POST', path, handler);
  }

  delete<Params = {}, ReqBody = {}>(
    path: string,
    handler: RequestHandler<Params, ReqBody>,
  ) {
    this.request('DELETE', path, handler);
  }

  put<Params = {}, ReqBody = {}>(
    path: string,
    handler: RequestHandler<Params, ReqBody>,
  ) {
    this.request('PUT', path, handler);
  }

  static removeSlashes(path: string) {
    return path.replace(/^\//, '').replace(/\/$/, '');
  }
}
