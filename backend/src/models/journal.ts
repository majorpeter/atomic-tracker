import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import db from "../lib/db";
import { User } from "./user";

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
