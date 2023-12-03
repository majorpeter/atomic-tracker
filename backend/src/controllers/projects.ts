import { Express } from "express";

import { fetchInProgress } from "../lib/redmine";
import { Api } from "../lib/api";
import { isLoggedInMiddleware } from "./auth";

const DUMMY_PROJECTS: {
  title: string;
  progressPercent: number;
  lastChangedDaysAgo: number;
}[] = [
  { title: "Read Atomic Habits", lastChangedDaysAgo: 10, progressPercent: 95 },
  { title: "Reorganize furniture", lastChangedDaysAgo: 6, progressPercent: 30 },
  {
    title: "Automate lights in living room",
    lastChangedDaysAgo: 2,
    progressPercent: 50,
  },
  {
    title: "Develop habit tracker site",
    progressPercent: 5,
    lastChangedDaysAgo: 0,
  },
];

export default function (app: Express) {
  app.get<{}, Api.Projects.type>(
    Api.Projects.path,
    isLoggedInMiddleware,
    async (req, res) => {
      if (req.query.dummy === undefined) {
        const data = await fetchInProgress();
        if (data) {
          res.send(data);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.send({
          inprogress: DUMMY_PROJECTS.map((item, index) => {
            const date = new Date();
            date.setDate(date.getDate() - item.lastChangedDaysAgo);
            return {
              id: index,
              subject: item.title,
              donePercent: item.progressPercent,
              createdAt: date.toISOString(),
              updatedAt: date.toISOString(),
            };
          }),
        });
      }
    }
  );
}
