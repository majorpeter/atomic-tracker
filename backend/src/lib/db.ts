import path from "path";

import { Sequelize } from "sequelize";
import { SequelizeStorage, Umzug } from "umzug";

const CONFIG_DIR = process.env.CONFIG_DIR || path.resolve(__dirname, "..");

const db = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(CONFIG_DIR, "db.sqlite3"),
});

const umzug = new Umzug({
  migrations: {
    glob: ["../migrations/*.js", { cwd: __dirname }],
    /// @see https://github.com/sequelize/umzug?tab=readme-ov-file#modifying-the-parameters-passed-to-your-migration-methods
    resolve: ({ name, path, context }) => {
      const migration = require(path!);
      return {
        name,
        up: async () => migration.up(context, Sequelize),
        down: async () => migration.down(context, Sequelize),
      };
    },
  },
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize: db }),
  logger: console,
});

export async function init() {
  await umzug.up();
}

export default db;
