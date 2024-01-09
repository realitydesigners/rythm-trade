import Router from "elysia";
import { OandaController } from "../controllers/OandaController";

const router = new Router();
const oandaController = new OandaController();

// Get account summary for a given user
router.get("/account/summary/:userId", async (context) => {
  const { userId } = context.params;
  return await oandaController.getAccountSummary(userId);
});
// Get account instruments for a given user
router.get("/instruments/:userId", async (context) => {
  const { userId } = context.params;
  return await oandaController.getInstruments(userId);
});

// Get all positions for a given user
router.get("/positions/:userId", async (context) => {
  const { userId } = context.params;
  return await oandaController.getAllPositions(userId);
});

// Get pair position summary for a given user and pair
router.get("/pair-position-summary/:userId/:pair", async (context) => {
  const { userId, pair } = context.params;
  return await oandaController.getPairPositionSummary(userId, pair);
});

router.get("/candles/:userId/:pair", async (context) => {
  const { userId, pair } = context.params;

  if (typeof userId !== "string" || typeof pair !== "string") {
    return { error: "Invalid userId or pair" };
  }

  const count = parseInt(context.query.count as string) || 300;
  const granularity = (context.query.granularity as string) || "M1";

  return await oandaController.fetchCandles(userId, pair, count, granularity);
});

export default router;
