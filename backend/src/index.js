import "dotenv/config.js";
import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

try {
  await connectDB();
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
	console.error('Server error:', err.message)
  })
} catch (err) {
	console.error('Abortando start do servidor por erro de DB')
	process.exit(1)
}