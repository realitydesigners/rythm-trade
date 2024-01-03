import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
// Main server file adjustments
import { Context, Elysia, t } from "elysia";
import forexPreferenceRoutes from "./api/routes/forexPreferenceRoutes";
import oandaRoutes from "./api/routes/oandaRoutes";
import userRoutes from "./api/routes/userRoutes";
import { WebSocketServer } from "./services/websocketServer";

const createServer = () => {
	const app = new Elysia()
		.use(swagger())
		.use(cors())
		.use(oandaRoutes)
		.use(userRoutes)
		.use(forexPreferenceRoutes);

	return app;
};

const startServer = async () => {
	const app = createServer();

	// Define the port based on the environment (process.env.PORT for Vercel)
	const port = process.env.PORT || 8080;

	await app.listen(port);
	console.log(`HTTP Server is running on port ${port}`);
};

const app = createServer();
startServer();

const websocketServer = new WebSocketServer();
websocketServer.start();

export type App = typeof app;
