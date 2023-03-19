import EventEmmiter from 'events';
import http from 'http';

import Router from './Router';

import { MiddlewareHandler, Request, Response } from '../types';

export default class Server extends EventEmmiter {
  _server: http.Server;
  routers: Router[] = [];

  middlewares: Array<MiddlewareHandler> = [];

  constructor() {
    super();

    this._server = this._createServer();
  }

  use<Params = {}, ReqBody = {}>(
    middleware: MiddlewareHandler<Params, ReqBody>,
  ) {
    this.middlewares.push(middleware);
  }

  listen(port?: number, callback?: () => void) {
    this._server.listen(port, callback);
  }

  addRouter(router: Router) {
    this.routers.push(router);

    Object.entries(router.endpoints).forEach(([path, endpoints]) =>
      Object.entries(endpoints).forEach(([method, handler]) =>
        this.on(`${path}:${method}`, handler),
      ),
    );
  }

  getRoute(pathname: string): {
    path: string;
    params: Record<string, string>;
  } | null {
    for (const { endpoints: routes } of this.routers) {
      for (const [route, _] of Object.entries(routes)) {
        const reg = new RegExp(route, 'i');

        const match = pathname.match(reg);

        if (route === '')
          return pathname === ''
            ? {
                path: route,
                params: {},
              }
            : null;

        if (match)
          return {
            path: route,
            params: match.groups,
          };
      }
    }

    return null;
  }

  _createServer() {
    return http.createServer((req: Request, res: Response) => {
      let body = '';

      req.on('data', (chunk) => (body += chunk));

      req.on('end', () => {
        if (body) req.body = JSON.parse(body);

        this.extendResponse(res);
        this.extendRequest(req);

        this.middlewares.forEach((middleware) => middleware(req, res));

        const route = this.getRoute(Router.removeSlashes(req.pathname));

        if (route) {
          req.params = route.params;

          if (!this.emit(`${route.path}:${req.method}`, req, res)) res.end();
        } else {
          res.end();
        }
      });
    });
  }

  extendResponse(res: Response) {
    res.json = (body: any) => {
      res.end(JSON.stringify(body));
    };

    res.status = (code: number) => {
      res.writeHead(code);
      return res;
    };
  }

  extendRequest(req: Request) {
    const { host, hostname, pathname, port, search, searchParams } = new URL(
      req.url,
      this.baseUrl,
    );

    Object.assign(req, {
      host,
      hostname,
      pathname,
      port,
      search,
      searchParams,
    });
  }

  get baseUrl() {
    const params = this._server.address();
    if (!params || typeof params === 'string') return '';

    if (params.address === '::') params.address = 'localhost';

    return `http://${params.address}:${params.port}`;
  }
}

// /users/:id
