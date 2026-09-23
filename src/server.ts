import fastify from "fastify";

const app = fastify({ logger: true });

app.get("/hello", () => {
	return "Hello World!!!";
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
