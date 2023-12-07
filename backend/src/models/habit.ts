import {
  Attributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
  HasManyGetAssociationsMixin,
  HasOneGetAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  WhereOptions,
} from "sequelize";

import db from "../lib/db";
import { User } from "./user";

export class Habit extends Model<
  InferAttributes<Habit>,
  InferCreationAttributes<Habit>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare iconName: string | null;
  declare targetValue: number;
  declare periodLength: number;
  declare historyLength: number;
  declare Owner: NonAttribute<User>;
  declare ownerId: ForeignKey<User["id"]>;
  declare archived: CreationOptional<boolean>;
  declare sortIndex: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getOwner: HasOneGetAssociationMixin<User>;
  declare getActivities: HasManyGetAssociationsMixin<Activity>;
  declare Activities?: NonAttribute<Activity[]>;
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
      allowNull: false,
    },
    iconName: {
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: false,
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sortIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: db }
);

Habit.belongsTo(User, {
  as: "Owner",
  foreignKey: Habit.getAttributes().ownerId.field!,
});

export class Activity extends Model<
  InferAttributes<Activity>,
  InferCreationAttributes<Activity>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare value: number;
  declare Habit?: NonAttribute<Habit>;
  declare HabitId: ForeignKey<Habit["id"]>;
  declare ownerId: ForeignKey<User["id"]>;
  declare archived: CreationOptional<boolean>;
}

Activity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: DataTypes.NUMBER,
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    HabitId: { type: DataTypes.INTEGER, allowNull: false },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize: db }
);

Activity.belongsTo(User, {
  as: "Owner",
  foreignKey: Activity.getAttributes().ownerId.field!,
});
Habit.hasMany(Activity);
Activity.belongsTo(Habit);

export class TrackedActivity extends Model<
  InferAttributes<TrackedActivity>,
  InferCreationAttributes<TrackedActivity>
> {
  declare id: CreationOptional<number>;
  declare Habit?: NonAttribute<Habit>;
  declare HabitId: ForeignKey<Habit["id"]>;
  declare Activity?: NonAttribute<Activity>;
  declare ActivityId: ForeignKey<Activity["id"]>;
  declare ownerId: number; //TODO foreign key later
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static async getSummarized(
    where: WhereOptions<Attributes<TrackedActivity>>
  ): Promise<{ count: number; sumValue: number }> {
    // for type safety
    type Columns = {
      Count: number;
      SumValue: number;
    };
    const columnName = (k: keyof Columns) => k;

    const result = (await TrackedActivity.findOne({
      where,
      include: [Activity],
      attributes: [
        [
          db.fn(
            "COUNT",
            db.col(
              `${TrackedActivity.name}.${TrackedActivity.getAttributes().id
                .field!}`
            )
          ),
          columnName("Count"),
        ],
        [
          db.fn(
            "SUM",
            db.col(`${Activity.name}.${Activity.getAttributes().value.field!}`)
          ),
          columnName("SumValue"),
        ],
      ],
    })) as unknown as { dataValues: Columns };

    return {
      count: result.dataValues.Count,
      sumValue: result.dataValues.SumValue ?? 0,
    };
  }
}

TrackedActivity.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    ownerId: { type: DataTypes.INTEGER },
    HabitId: { type: DataTypes.INTEGER, allowNull: false },
    ActivityId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: db }
);

TrackedActivity.belongsTo(User, {
  as: "Owner",
  foreignKey: TrackedActivity.getAttributes().ownerId.field!,
});
Habit.hasMany(TrackedActivity);
TrackedActivity.belongsTo(Habit);
Activity.hasMany(TrackedActivity);
TrackedActivity.belongsTo(Activity);
