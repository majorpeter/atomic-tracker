import { DataTypes, QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("ProjectActivityCaches", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    redmineJournalId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    issueId: DataTypes.INTEGER,
    data: DataTypes.JSON,
    state: {
      type: DataTypes.TINYINT,
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
  await queryInterface.dropTable("ProjectActivityCaches");
}
