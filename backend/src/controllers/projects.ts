import { Express } from "express";

import { Api } from "../lib/api";
import { isLoggedInMiddleware } from "./auth";
import { Integration } from "../models/integration";

import * as redmine from "../lib/redmine";

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
        const integrations = await Integration.findOne({
          where: { ownerId: req.session.userId! },
        });

        if (
          integrations &&
          integrations.Projects.schema == 1 &&
          integrations.Projects.redmine
        ) {
          const data = await redmine.fetchInProgress({
            url: integrations.Projects.redmine.url,
            api_key: integrations.Projects.redmine.api_key,
            inprogress_status_id:
              integrations.Projects.redmine.inprogress_status_id,
          });

          if (data != null) {
            res.send({
              ...data,
              board_url: integrations.Projects.redmine.board_url,
            });
          } else {
            res.sendStatus(500);
          }
        } else {
          res.send({ inprogress: [] });
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
