import { describe, expect, it, beforeAll, afterAll, beforeEach } from "vitest";
import { execSync } from "node:child_process";
import supertest from "supertest";
import { app } from "../src/app.js";

describe("Transaction routes", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(() => {
		execSync("pnpm knex migrate:rollback --all");
		execSync("pnpm knex migrate:latest");
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

		const createdTransactionResponse = await supertest(app.server).post("/transactions").send(transaction);
		const cookies = createdTransactionResponse.get("Set-Cookie");

		if (!cookies) throw new Error("Expected Set-Cookie header after creating a transaction");

		const transactionsListResponse = await supertest(app.server).get("/transactions").set("Cookie", cookies);

		expect(transactionsListResponse.statusCode).toEqual(200);
		expect(transactionsListResponse.body.transactions).toEqual([
			expect.objectContaining({ title: transaction.title, amount: transaction.amount }),
		]);
	});

	it("should be able to get a specific transaction", async () => {
		const transaction = {
			title: "New transaction",
			amount: 5_000,
			type: "credit",
		};

		const createdTransactionResponse = await supertest(app.server).post("/transactions").send(transaction);
		const cookies = createdTransactionResponse.get("Set-Cookie");

		if (!cookies) throw new Error("Expected Set-Cookie header after creating a transaction");

		const transactionsListResponse = await supertest(app.server).get("/transactions").set("Cookie", cookies);
		const transactionId = transactionsListResponse.body.transactions[0].id;

		const specificTransactionResponse = await supertest(app.server)
			.get(`/transactions/${transactionId}`)
			.set("Cookie", cookies);

		expect(specificTransactionResponse.statusCode).toEqual(200);
		expect(specificTransactionResponse.body.transaction).toEqual(
			expect.objectContaining({ title: transaction.title, amount: transaction.amount }),
		);
	});

	it("should be able to get a summary", async () => {
		const transaction1 = { title: "New transaction", amount: 5_000, type: "credit" };
		const createdTransaction1Response = await supertest(app.server).post("/transactions").send(transaction1);
		const cookies = createdTransaction1Response.get("Set-Cookie");

		if (!cookies) throw new Error("Expected Set-Cookie header after creating a transaction");

		const transaction2 = { title: "Debit transaction", amount: 2_000, type: "debit" };
		const createdTransaction2Response = await supertest(app.server)
			.post("/transactions")
			.set("Cookie", cookies)
			.send(transaction2);

		expect(createdTransaction1Response.statusCode).toEqual(201);
		expect(createdTransaction2Response.statusCode).toEqual(201);

		const summaryResponse = await supertest(app.server).get("/transactions/summary").set("Cookie", cookies);

		expect(summaryResponse.statusCode).toEqual(200);
		expect(summaryResponse.body.summary).toEqual({ amount: 3_000 });
	});
});
