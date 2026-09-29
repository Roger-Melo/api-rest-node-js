// eslint-disable-next-line
import { Knex } from "knex";

declare module "knex/types/tables.js" {
	interface Transaction {
		id: string;
		title: string;
		amount: number;
		created_at: string;
		session_id?: string;
	}

	interface Tables {
		transactions: Transaction;
	}
}
