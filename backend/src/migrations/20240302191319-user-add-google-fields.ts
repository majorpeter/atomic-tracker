import { DataTypes, QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.addColumn("Users", "email", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("Users", "googleUid", {
    type: DataTypes.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.removeColumn("Users", "email");
  await queryInterface.removeColumn("Users", "googleUid");
}
