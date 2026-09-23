import fastify from "fastify";
import { knex } from "./database.js";

const app = fastify({ logger: true });

app.get("/hello", async () => {
	const tables = await knex("sqlite_schema").select("*");
	return tables;
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
