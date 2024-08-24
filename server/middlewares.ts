import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ServerManager } from './model/server-manager';

export function validateMiddleware(req: Request, res: Response, next: NextFunction) {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400).json({ errors: error.array() });
    return;
  }
  next();
}

export function makeSessionMiddleware(serverManager: ServerManager) {
  return function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
    const session = +req.cookies.session;
    if (Number.isInteger(session)) {
      const user = serverManager.getUser(session);
      if (user) {
        res.locals.user = user;
        next();
        return;
      }
    }
    res.status(400).json({ error: 'invalid session.' });
  };
}
