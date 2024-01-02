import { DataTypes, QueryInterface } from "sequelize";

const typeValueSet = ["good", "bad"] as const;

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("Habits", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: typeValueSet,
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
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable("Habits");
}
