import { ReasonPhrases, StatusCodes } from "http-status-codes";

export function middlewareStack(...midlewares) {
  return (next) => {
    for (let i = midlewares.length - 1; i >= 0; i--) {
      next = midlewares[i](next);
    }
    return next;
  };
}

export function middlewareLogging(handler) {
  return (req, res) => {
    console.info(`INFO: ${req.method} - ${req.url} - ${JSON.stringify(req.query)}`);
    return handler(req, res);
  };
}

export function middlewareEnsureSecretKey(secretKey) {
  return (handler) => {
    return (req, res) => {
      if (secretKey !== req.headers['secret-key']) {
        console.info(`INFO: Secret key invalid or not provided`);
        res.writeHead(StatusCodes.FORBIDDEN);
        res.end(ReasonPhrases.FORBIDDEN);
        return;
      }

      return handler(req, res);
    };
  };
}