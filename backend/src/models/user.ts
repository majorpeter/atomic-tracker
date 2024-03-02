import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import db from "../lib/db";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare passwordHash: string;
  declare language: string;
  declare email: CreationOptional<string>;
  declare googleUid: CreationOptional<string>;
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
    language: { type: new DataTypes.STRING(5), allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true },
    googleUid: { type: DataTypes.STRING, allowNull: true },
  },
  { sequelize: db }
);
