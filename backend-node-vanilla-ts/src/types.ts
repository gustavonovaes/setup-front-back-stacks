export type Handler = (req: Request, res: Response) => void | Promise<void>;

export type Middleware = (handler: Handler) => Handler;

export interface Request {
  urlObj: URL;
  method: string;
  headers?: Record<string, string | string[]>;
  params: Record<string, string>;
  query: Record<string, string | string[]>;
}

export interface Response {
  statusCode: number;
  status: (code: number) => this;
  send: (body?: unknown) => this;
}
