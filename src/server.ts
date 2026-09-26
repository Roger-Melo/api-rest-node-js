import fastify from "fastify";
import { knex } from "./database.js";

const app = fastify({ logger: true });

app.get("/hello", async () => {
	const transaction = await knex("transactions").where("amount", 1_000).select("*");
	return transaction;
});

const start = async () => {
	try {
		await app.listen({ port: 3333 });
		console.log("HTTP server running!");
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
