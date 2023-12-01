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
  Sequelize,
  WhereOptions,
} from "sequelize";
import path from "path";

const db = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "..", "db.sqlite3"),
});

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare passwordHash: string;
}

User.init(
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
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db }
);

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

export class Journal extends Model<
  InferAttributes<Journal>,
  InferCreationAttributes<Journal>
> {
  declare id: CreationOptional<number>;
  declare date: string;
  declare content: string;
  declare count: number;
  declare ownerId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;

  public static dateToRawValue(value: string) {
    if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new Error("Invalid format for date: " + value);
    }
    const s =
      value.substring(0, 4) + value.substring(5, 7) + value.substring(8, 10);
    return parseInt(s);
  }

  public static rawToIsoDateValue(value: number) {
    const s = value.toString();
    if (s.length != 8) {
      return "0000-00-00";
    }
    return (
      s.substring(0, 4) + "-" + s.substring(4, 6) + "-" + s.substring(6, 8)
    );
  }
}

Journal.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date: {
      type: DataTypes.INTEGER,
      get() {
        Journal.rawToIsoDateValue(
          this.getDataValue("date") as unknown as number
        );
      },
      set(value: string) {
        // .toString() required for TS checks
        this.setDataValue("date", Journal.dateToRawValue(value).toString());
      },
    },
    content: { type: DataTypes.TEXT },
    count: { type: DataTypes.INTEGER },
    ownerId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: DataTypes.DATE,
  },
  { sequelize: db }
);

Journal.belongsTo(User, {
  as: "Owner",
  foreignKey: Journal.getAttributes().ownerId.field!,
});

(async () => {
  await db.sync({ force: false });
})();

export default db;
