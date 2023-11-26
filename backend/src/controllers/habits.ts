import { Express } from "express";
import { Api } from "../lib/api";

import { Habit, TrackedHabit } from "../lib/db";
import { Op } from "sequelize";

//TODO multiuser support
const USER_ID = 0;

export default function (app: Express) {
  app.get<{}, Api.Habits.type>(Api.Habits.path, async (_, res) => {
    const result: Api.Habits.type = [];
    const habits = await Habit.findAll({ where: { owner: USER_ID } });

    for (const h of habits) {
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7);
      const tracked = await TrackedHabit.findAll({
        where: {
          owner: USER_ID,
          HabitId: h.id,
          createdAt: { [Op.gt]: fromDate },
        },
      });

      result.push({
        name: h.name,
        count: tracked.length,
      });
    }

    res.send(result);
  });
}
