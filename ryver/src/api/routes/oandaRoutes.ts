import Router from 'elysia';
import { OandaController } from '../controllers/OandaController';
const router = new Router();
const oandaController = new OandaController();
router.get('/account/summary', async (ctx) => {
  await oandaController.getAccountSummary(ctx);
  return ctx;
});
export default router;
