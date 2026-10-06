import { env } from "./env/index.js";
import { app } from "./app.js";

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
