import { Router } from 'express';

export function createApiRouter(loginRouter: Router, queryRouter: Router, updateRouter: Router) {
  const apiRouter = Router();

  apiRouter.use('/login', loginRouter);
  apiRouter.use('/query', queryRouter);
  apiRouter.use('/update', updateRouter);

  return apiRouter;
}
