import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { User } from "./user";
import db from "../lib/db";
import { Api } from "../lib/api";

export type AgendaType = {
  schema: 1;
  google?: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };
};

export class Integration extends Model<
  InferAttributes<Integration>,
  InferCreationAttributes<Integration>
> {
  declare Todos: CreationOptional<Api.Config.Todos.type>;
  declare Agenda: CreationOptional<AgendaType>;
  declare Projects: CreationOptional<Api.Config.Projects.type>;
  declare Radios: CreationOptional<Api.Config.Radio.type>;
  declare Owner: NonAttribute<User>;
  declare ownerId: ForeignKey<User["id"]>;
}

Integration.init(
  {
    Todos: {
      type: DataTypes.JSON,
      defaultValue: { schema: 1 } as Api.Config.Todos.type,
    },
    Agenda: { type: DataTypes.JSON, defaultValue: { schema: 1 } as AgendaType },
    Projects: {
      type: DataTypes.JSON,
      defaultValue: { schema: 1 } as Api.Config.Projects.type,
    },
    Radios: {
      type: DataTypes.JSON,
      defaultValue: { schema: 1 } as Api.Config.Radio.type,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize: db }
);

Integration.belongsTo(User, {
  as: "Owner",
  foreignKey: Integration.getAttributes().ownerId.field!,
});
