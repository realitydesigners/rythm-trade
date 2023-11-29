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

export default router;
