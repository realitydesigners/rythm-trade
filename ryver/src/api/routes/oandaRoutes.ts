import Router from 'elysia';
import { OandaController } from '../controllers/OandaController';

const router = new Router();
const oandaController = new OandaController();

router.get('/account/summary/:userId', async context => {
  const { userId } = context.params;
  return await oandaController.getAccountSummary(userId);
});

export default router;
