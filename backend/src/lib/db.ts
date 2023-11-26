import {
  CreationOptional,
  DataTypes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import path from "path";

const db = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "..", "db.sqlite3"),
});

type HabitType = { id: number; name: string; owner: number };

export class Habit extends Model<HabitType, Omit<HabitType, "id">> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<string>;
  declare updatedAt: CreationOptional<string>;
}

Habit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    owner: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize: db }
);

export class TrackedHabit extends Model {
  declare Habit?: NonAttribute<Habit>;
  declare HabitId: number;
}

TrackedHabit.init(
  {
    owner: {
      type: DataTypes.INTEGER,
    },
  },
  { sequelize: db }
);

Habit.hasMany(TrackedHabit);
TrackedHabit.belongsTo(Habit);

(async () => {
  await db.sync({ force: false });
})();

export default db;
