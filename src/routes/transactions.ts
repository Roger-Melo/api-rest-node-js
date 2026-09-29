import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { knex } from "../database.js";

export async function transactionsRoutes(app: FastifyInstance) {
	app.post("/", async (req, res) => {
		const transactionSchema = z.object({
			title: z.string().nonempty(),
			amount: z.number(),
			type: z.enum(["credit", "debit"]),
		});

		const { title, amount, type } = transactionSchema.parse(req.body);
		await knex("transactions").insert({
			id: randomUUID(),
			title,
			amount: type === "credit" ? amount : amount * -1,
		});

		return res.status(201).send();
	});
}
