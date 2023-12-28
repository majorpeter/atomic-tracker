import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";

import db from "../lib/db";
import { User } from "./user";
import { Journal } from "../lib/redmine";

export enum State {
  New = 0,
  Processed = 1,
  Ignored = 2,
}

export class RedmineJournalCache extends Model<
  InferAttributes<RedmineJournalCache>,
  InferCreationAttributes<RedmineJournalCache>
> {
  declare id: CreationOptional<number>;
  declare journalId: number;
  declare projectId: number;
  declare issueId: number;
  declare data: Journal;
  declare state: State;
  declare Owner: NonAttribute<User>;
  declare ownerId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RedmineJournalCache.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    journalId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    issueId: DataTypes.INTEGER,
    data: DataTypes.JSON,
    state: {
      type: DataTypes.TINYINT,
      get() {
        return State[this.getDataValue("state") as number];
      },
      /*set(value: State) {
        this.setDataValue("state", State[value] as unknown as State);
      },*/
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: db }
);
