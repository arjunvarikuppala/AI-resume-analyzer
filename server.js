import { runServer } from "./Backend/server.js";

runServer().catch((error) => {
  console.error("Failed to start root server:", error.message);
  process.exit(1);
});
