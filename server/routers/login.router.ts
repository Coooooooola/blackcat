import { Router } from 'express';
import { body } from 'express-validator';
import { ServerManager } from '@server/model/server-manager';
import { validateMiddleware } from '@server/middlewares';

export function createLoginRouter(serverManager: ServerManager) {
  const loginRouter = Router();

  loginRouter.post(
    '/',
    body('email').isString(),
    body('password').isString(),
    validateMiddleware,
    (req, res) => {
      const { email, password } = req.body;
      const result = serverManager.login(email, password);
      if (!result) {
        res.cookie('session', '', { httpOnly: true, maxAge: 0 });
        res.cookie('id', '', { maxAge: 0 });
        res.json({ status: 'fail' });
        return;
      }

      const { user, session } = result;
      res.cookie('session', session, { httpOnly: true });
      res.cookie('id', user.id);
      res.json({ status: 'success' });
    },
  );

  return loginRouter;
}
