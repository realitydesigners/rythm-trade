import Router from 'elysia';
import { UserController } from '../controllers/UserController';

interface UserRequestBody {
  userId: string;
  email: string;
  name: string;
}

const router = new Router();
const userController = new UserController();

// Create or update a user
router.post('/user', async ({ body }) => {
  const { userId, email, name } = body as UserRequestBody;
  return await userController.createUserOrUpdate(userId, email, name);
});

// Retrieve a user by their Clerk ID
router.get('/user/:userId', async ({ params }) => {
  const { userId } = params;
  return await userController.getUserByClerkId(userId);
});


// Update Oanda credentials for a user
router.post('/user/:userId/oanda-credentials', async context => {
  const { userId } = context.params;

  try {
    // Manually read and parse the JSON body from the stream
    const body = await context.request.json();
    const { apiKey, accountId } = body;
    console.log(`Received credentials update for ${userId}: apiKey=${apiKey}, accountId=${accountId}`);

    return await userController.updateOandaCredentials(userId, apiKey, accountId);
  } catch (error) {
    console.error('Error parsing request body:', error);
  }
});


// Get Oanda credentials for a user
router.get('/user/:userId/oanda-credentials', async context => {
  const { userId } = context.params;
  return await userController.getOandaCredentials(userId);
});


export default router;
