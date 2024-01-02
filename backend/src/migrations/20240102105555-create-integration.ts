import { DataTypes, QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("Integrations", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    Todos: {
      type: DataTypes.JSON,
      defaultValue: { schema: 1 },
    },
    Agenda: {
      type: DataTypes.JSON,
      defaultValue: { schema: 1 },
    },
    Projects: {
      type: DataTypes.JSON,
      defaultValue: { schema: 1 },
    },
    Radios: {
      type: DataTypes.JSON,
      defaultValue: {
        schema: 1,
        stations: [],
      },
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("Integrations");
}
