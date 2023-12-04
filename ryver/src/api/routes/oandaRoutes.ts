import Router from 'elysia';
import { OandaController } from '../controllers/OandaController';

const router = new Router();
const oandaController = new OandaController();

// Get account summary for a given user
router.get('/account/summary/:userId', async context => {
  const { userId } = context.params;
  return await oandaController.getAccountSummary(userId);
});
// Get account instruments for a given user
router.get('/instruments/:userId', async context => {
  const { userId } = context.params;
  return await oandaController.getInstruments(userId);
});

// Get all positions for a given user
router.get('/positions/:userId', async context => {
  const { userId } = context.params;
  return await oandaController.getAllPositions(userId);
});

// Get pair position summary for a given user and pair
router.get('/pair-position-summary/:userId/:pair', async context => {
  const { userId, pair } = context.params;
  return await oandaController.getPairPositionSummary(userId, pair);
});
export default router;
