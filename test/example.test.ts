import { expect, it, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import { app } from "../src/app.js";

beforeAll(async () => {
	await app.ready();
});

afterAll(async () => {
	await app.close();
});

it("can create a new transaction", async () => {
	const transaction = {
		title: "New transaction",
		amount: 5_000,
		type: "credit",
	};

	const response = await supertest(app.server).post("/transactions").send(transaction);
	expect(response.statusCode).toEqual(201);
});
