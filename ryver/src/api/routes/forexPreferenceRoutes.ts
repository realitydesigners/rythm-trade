// ForexPreferenceRouter.ts
import Router from 'elysia';
import { UserController } from '../controllers/UserController';

interface ForexPreferenceRequestBody {
  userId: string; // Changed to string
  pairs: string[];
}

const router = new Router();
const userController = new UserController();

router.get('/forex-preferences/:userId', async ({ params }) => {
  const { userId } = params;
  return await userController.getForexPreferences(userId); // No need to parse as int
});

router.post('/forex-preferences', async ({ body }) => {
  const { userId, pairs } = body as ForexPreferenceRequestBody;
  return await userController.setForexPreferences(userId, pairs);
});

export default router;
