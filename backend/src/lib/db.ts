import { Sequelize } from "sequelize";
import path from "path";

const CONFIG_DIR = process.env.CONFIG_DIR || path.resolve(__dirname, "..");

const db = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(CONFIG_DIR, "db.sqlite3"),
});

export async function init() {
  await db.sync({ force: false });
}

export default db;
