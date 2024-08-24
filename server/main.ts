import path from 'path';
import express from 'express';
import { createApiRouter } from './routers/api.router';
import { createLoginRouter } from './routers/login.router';
import { createQueryRouter } from './routers/query.router';
import { createUpdateRouter } from './routers/update.router';
import cookieParser from 'cookie-parser';
import { mock } from './mock';

const { serverManager } = mock(10);

const loginRouter = createLoginRouter(serverManager);
const queryRouter = createQueryRouter(serverManager);
const updateRouter = createUpdateRouter(serverManager);
const apiRouter = createApiRouter(loginRouter, queryRouter, updateRouter);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiRouter);

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  const staticPath = path.resolve(__dirname, 'static');
  const indexHtml = path.resolve(staticPath, 'index.html');

  app.use(express.static(staticPath));
  app.get('*', (req, res) => {
    res.sendFile(indexHtml);
  });
} else {
  app.get('/', (req, res) => {
    res.send('Hello from server!');
  });
}

const PORT = process.env.NODE_ENV === 'development' ? 4000 : 80;
app.listen(PORT, () => console.log(`⚡Server is running here 👉 http://localhost:${PORT}`));
