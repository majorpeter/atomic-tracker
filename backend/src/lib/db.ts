import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Sequelize,
} from "sequelize";
import path from "path";

const db = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "..", "db.sqlite3"),
});

export class Habit extends Model<
  InferAttributes<Habit>,
  InferCreationAttributes<Habit>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare iconName: string;
  declare targetValue: number;
  declare periodLength: number;
  declare historyLength: number;
  declare ownerId: number; //TODO foreign key later
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
    iconName: {
      type: DataTypes.STRING,
    },
    targetValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    periodLength: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    historyLength: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: db }
);

export class TrackedHabit extends Model<
  InferAttributes<TrackedHabit>,
  InferCreationAttributes<TrackedHabit>
> {
  declare id: CreationOptional<number>;
  declare Habit?: NonAttribute<Habit>;
  declare HabitId: ForeignKey<Habit["id"]>;
  declare ownerId: number; //TODO foreign key later
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TrackedHabit.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ownerId: { type: DataTypes.INTEGER },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: db }
);

Habit.hasMany(TrackedHabit);
TrackedHabit.belongsTo(Habit);

export class Journal extends Model<
  InferAttributes<Journal>,
  InferCreationAttributes<Journal>
> {
  declare id: CreationOptional<number>;
  declare date: string;
  declare content: string;
  declare count: number;
  declare ownerId: number; //TODO foreign key later
  declare createdAt: CreationOptional<Date>;
}

Journal.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date: { type: new DataTypes.STRING(10) },
    content: { type: DataTypes.TEXT },
    count: { type: DataTypes.INTEGER },
    ownerId: { type: DataTypes.INTEGER },
    createdAt: DataTypes.DATE,
  },
  { sequelize: db }
);

(async () => {
  await db.sync({ force: false });
})();

export default db;
