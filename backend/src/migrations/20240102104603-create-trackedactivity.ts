import { DataTypes, QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable("TrackedActivities", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    ownerId: { type: DataTypes.INTEGER },
    HabitId: { type: DataTypes.INTEGER, allowNull: false },
    ActivityId: { type: DataTypes.INTEGER, allowNull: false },
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
  await queryInterface.dropTable("TrackedActivities");
}
