import fastify from "fastify";
import { env } from "./env/index.js";
import { transactionsRoutes } from "./routes/transactions.js";

const app = fastify({ logger: true });

app.register(transactionsRoutes);

const start = async () => {
	try {
		await app.listen({ port: env.PORT });
		console.log("HTTP server running!");
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
