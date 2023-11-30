import { Express } from "express";
import { Api } from "../lib/api";
import { Habit } from "../lib/db";

//TODO multiuser support
const USER_ID = 0;

export default function (app: Express) {
  app.get<{}, Api.Config.Habits.get_type>(
    Api.Config.Habits.path,
    async (_, res) => {
      const habits = await Habit.findAll({
        where: {
          ownerId: USER_ID,
        },
      });
      res.send(
        habits.map((item) => ({
          id: item.id,
          name: item.name,
          iconName: item.iconName,
          targetValue: item.targetValue,
          periodLength: item.periodLength,
          historyLength: item.historyLength,
        }))
      );
    }
  );

  app.post<{}, {}, Api.Config.Habits.post_type>(
    Api.Config.Habits.path,
    async (req, res) => {
      if (req.body.action == "add") {
        await Habit.create({
          ...req.body.habit,
          ownerId: USER_ID,
        });
        res.sendStatus(200);
        return;
      }
      res.sendStatus(400);
    }
  );
}
