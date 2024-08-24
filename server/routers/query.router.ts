import { Router } from 'express';
import { query, body, param } from 'express-validator';
import { ServerManager } from '@server/model/server-manager';
import { makeSessionMiddleware, validateMiddleware } from '@server/middlewares';
import { assert } from '@server/utils';

export function createQueryRouter(serverManager: ServerManager) {
  const sessionMiddleware = makeSessionMiddleware(serverManager);
  const queryRouter = Router();

  queryRouter.get('/profile', sessionMiddleware, (req, res) => {
    res.json(serverManager.queryProfile(res.locals.user));
  });

  queryRouter.get('/channel-names', (_req, res) => {
    res.json({ channelNames: serverManager.queryChannelNames() });
  });

  queryRouter.post(
    '/events',
    sessionMiddleware,
    body('startDate').isInt(),
    body('endDate').isInt(),
    body('channels').custom(
      value =>
        value === true || (Array.isArray(value) && value.every(val => typeof val === 'string')),
    ),
    validateMiddleware,
    (req, res) => {
      const user = res.locals.user;
      const { startDate, endDate, channels } = req.body;
      const events = serverManager.queryEvents(user, startDate, endDate, channels);
      res.json({ events });
    },
  );

  queryRouter.get(
    '/event/:id',
    sessionMiddleware,
    param('id').isInt(),
    validateMiddleware,
    (req, res) => {
      const id = +req.params.id;
      const event = serverManager.queryEvent(id);
      res.json({ event });
    },
  );

  return queryRouter;
}
