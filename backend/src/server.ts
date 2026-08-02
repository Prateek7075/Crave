import "dotenv/config";

import { createServer } from "node:http";

import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error("PORT must be a positive integer");
}

const app = createApp();
const server = createServer(app);

server.listen(port, () => {
  console.log(`Crave API running at http://localhost:${port}`);
});
