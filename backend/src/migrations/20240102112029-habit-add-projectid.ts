import { DataTypes, QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn("Habits", "projectId", {
    type: DataTypes.INTEGER,
    allowNull: true,
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn("Habits", "projectId");
}
