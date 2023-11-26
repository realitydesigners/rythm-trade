import Router from 'elysia';
import { OandaController } from '../controllers/OandaController';

const router = new Router();
const oandaController = new OandaController();

router.get('/account/summary', async () => {
  return await oandaController.getAccountSummary();
});

export default router;
