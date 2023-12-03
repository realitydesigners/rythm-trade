// Main server file adjustments
import { Context, Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import oandaRoutes from './api/routes/oandaRoutes';
import userRoutes from './api/routes/userRoutes';
import forexPreferenceRoutes from './api/routes/forexPreferenceRoutes';
import { cors } from '@elysiajs/cors';
import { WebSocketServer } from './services/websocketServer';


const app = new Elysia()
  .use(swagger())
  .use(cors())
  .use(oandaRoutes)
  .use(userRoutes)
  .use(forexPreferenceRoutes)
  .listen(8080, () => console.log(`HTTP Server is running at http://localhost:8080`));

const websocketServer = new WebSocketServer();
websocketServer.start();

export type App = typeof app;