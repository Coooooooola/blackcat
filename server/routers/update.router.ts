import { Router } from 'express';
import { body } from 'express-validator';
import { ServerManager } from '@server/model/server-manager';
import { makeSessionMiddleware, validateMiddleware } from '@server/middlewares';
import { User } from '@server/model/user';

export function createUpdateRouter(serverManager: ServerManager) {
  const sessionMiddleware = makeSessionMiddleware(serverManager);

  const updateRouter = Router();

  updateRouter.post(
    '/action',
    sessionMiddleware,
    body('eventId').isInt(),
    body('like').optional().isBoolean(),
    body('going').optional().isBoolean(),
    validateMiddleware,
    (req, res) => {
      const user: User = res.locals.user;
      const { eventId, like, going } = req.body;
      if (!serverManager.updateAction(user, eventId, like, going)) {
        res.status(400).json({ error: 'event not found.' });
        return;
      }
      res.json({ success: true });
    },
  );

  updateRouter.post(
    '/comment',
    sessionMiddleware,
    body('id').isInt(),
    body('comment').isString(),
    validateMiddleware,
    (req, res) => {
      const user: User = res.locals.user;
      const { id, comment: text } = req.body;
      const comment = serverManager.updateComment(user, id, text);
      if (!comment) {
        res.status(400).json({ error: 'event not found.' });
        return;
      }
      res.json({ comment });
    },
  );

  return updateRouter;
}
