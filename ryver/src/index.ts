import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import oandaRoutes from './api/routes/oandaRoutes';
import userRoutes from './api/routes/userRoutes';

import { StreamingService } from './services/streamingService';
const app = new Elysia()
  .use(swagger())
  .use(oandaRoutes)
  .use(userRoutes)
  .listen(8080, () => console.log(`Server is running at http://localhost:8080`));

const streamingService = new StreamingService();

// Start streaming
streamingService.startStreaming(['EUR_USD', 'USD_JPY']);
export type App = typeof app;
