import {
  Attributes,
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

export class Integration extends Model<
  InferAttributes<Integration>,
  InferCreationAttributes<Integration>
> {
  declare Todos: CreationOptional<Api.Config.Todos.type>;
  declare Agenda: CreationOptional<{
    schema: 1;
    google?: {
      clientId: string;
      clientSecret: string;
      refreshToken: string;
    };
  }>;
  declare Projects: CreationOptional<Api.Config.Projects.type>;
  declare Radios: CreationOptional<Api.Config.Radio.type>;
  declare Owner: NonAttribute<User>;
  declare ownerId: ForeignKey<User["id"]>;
}

Integration.init(
  {
    Todos: {
      type: DataTypes.JSON,
      defaultValue: { schema: 1 } satisfies Attributes<Integration>["Todos"],
    },
    Agenda: {
      type: DataTypes.JSON,
      defaultValue: { schema: 1 } satisfies Attributes<Integration>["Agenda"],
    },
    Projects: {
      type: DataTypes.JSON,
      defaultValue: { schema: 1 } satisfies Attributes<Integration>["Projects"],
    },
    Radios: {
      type: DataTypes.JSON,
      defaultValue: {
        schema: 1,
        stations: [],
      } satisfies Attributes<Integration>["Radios"],
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
