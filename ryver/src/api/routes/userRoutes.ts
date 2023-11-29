import Router from 'elysia';
import { UserController } from '../controllers/UserController';

interface UserRequestBody {
  userId: string;
  email: string;
  name: string;
}

const router = new Router();
const userController = new UserController();

router.post('/user', async ({ body }) => {
  const { userId, email, name } = body as UserRequestBody;
  return await userController.createUserOrUpdate(userId, email, name);
});

export default router;
