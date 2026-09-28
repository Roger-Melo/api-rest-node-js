import type { FastifyInstance } from "fastify";
import { knex } from "../database.js";

export async function transactionsRoutes(app: FastifyInstance) {
	app.get("/hello", async () => {
		const transaction = await knex("transactions").where("amount", 1_000).select("*");
		return transaction;
	});
}
