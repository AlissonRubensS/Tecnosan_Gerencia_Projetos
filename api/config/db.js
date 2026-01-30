import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

// Verifica se estamos em produção
const isProduction = process.env.NODE_ENV === "production";

// Define a configuração do banco dinamicamente
const dbConfig = process.env.DATABASE_URL
  ? {
      // CENÁRIO 1: Produção (Render/Vercel) ou se tiver a URL no .env
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false 
      }
    }
  : {
      // CENÁRIO 2: Localhost (Desenvolvimento)
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: false, // Localmente geralmente não usamos SSL
    };

export const pool = new Pool(dbConfig);

// Opcional: Log para você saber qual está usando (ajuda no debug)
pool.on("connect", () => {
  if (!process.env.DATABASE_URL) {
    console.log("Conectado ao Banco Local (Localhost)");
  }
});