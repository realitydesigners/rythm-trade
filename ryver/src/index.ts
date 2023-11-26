import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import oandaRoutes from './api/routes/oandaRoutes';
const app = new Elysia()
  .use(swagger())
  .use(oandaRoutes)
  .listen(8080, () => console.log(`Server is running at http://localhost:8080`));
export type App = typeof app;
