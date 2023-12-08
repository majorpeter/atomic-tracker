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

export class Integration extends Model<
  InferAttributes<Integration>,
  InferCreationAttributes<Integration>
> {
  declare Projects: CreationOptional<Api.Config.Projects.type>;
  declare Owner: NonAttribute<User>;
  declare ownerId: ForeignKey<User["id"]>;
}

Integration.init(
  {
    Projects: {
      type: DataTypes.JSON,
      defaultValue: { schema: 1 } as Api.Config.Projects.type,
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
