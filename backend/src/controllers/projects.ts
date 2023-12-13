import { Express } from "express";

import { Api } from "../lib/api";
import { isLoggedInMiddleware } from "./auth";
import { Integration } from "../models/integration";

import * as redmine from "../lib/redmine";

import { DUMMY_PROJECTS } from "../misc/dummy_data";

export default function (app: Express, useDummyData: boolean) {
  app.get<{}, Api.Projects.type>(
    Api.Projects.path,
    isLoggedInMiddleware,
    async (req, res) => {
      if (!useDummyData) {
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
