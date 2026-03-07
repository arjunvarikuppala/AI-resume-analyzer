import app, { initializeApp } from "./app.js";

const port = Number(process.env.PORT) || 5000;

const startServer = async () => {
  await initializeApp();

  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
