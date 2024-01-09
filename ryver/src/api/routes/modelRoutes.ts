import Router from "elysia";
import { ModelController } from "../controllers/ModelController";

interface BoxArrayRequestBody {
	userId: string;
	pair: string;
	boxArrayType: string;
}

const router = new Router();
const modelsController = new ModelController();

router.post("/calculate-box-arrays", async ({ body }) => {
	const { userId, pair, boxArrayType } = body as BoxArrayRequestBody;
	console.log("calculate box arrays");
	console.log(userId, pair, boxArrayType);
	try {
		const boxArrays = await modelsController.calculateBoxArrays(
			userId,
			pair,
			boxArrayType,
		);
		return boxArrays;
	} catch (error: any) {
		console.error("Error in model route:", error);
		return { error: error.message };
	}
});

export default router;
