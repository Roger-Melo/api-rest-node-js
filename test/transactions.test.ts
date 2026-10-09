import { describe, expect, it, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import { app } from "../src/app.js";

describe("Transaction routes", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create a new transaction", async () => {
		const transaction = {
			title: "New transaction",
			amount: 5_000,
			type: "credit",
		};

		const response = await supertest(app.server).post("/transactions").send(transaction);
		expect(response.statusCode).toEqual(201);
	});

	it("should be able to list all transactions", async () => {
		const transaction = {
			title: "New transaction",
			amount: 5_000,
			type: "credit",
		};

		const response = await supertest(app.server).post("/transactions").send(transaction);
		const cookies = response.get("Set-Cookie");

		if (!cookies) throw new Error("Expected Set-Cookie header after creating a transaction");

		const response2 = await supertest(app.server).get("/transactions").set("Cookie", cookies);

		expect(response2.statusCode).toEqual(200);
		expect(response2.body.transactions).toEqual([
			expect.objectContaining({ title: transaction.title, amount: transaction.amount }),
		]);
	});
});
