import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");

    app.listen(env.port, () => {
      console.log(`Agrivo backend running on http://localhost:${env.port}`);
      console.log(`Health check: http://localhost:${env.port}/api/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
