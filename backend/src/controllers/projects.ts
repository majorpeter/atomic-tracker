import { Express } from "express";

import { Api } from "../lib/api";
import { isLoggedInMiddleware } from "./auth";

import { Integration } from "../models/integration";
import { RedmineJournalCache, State } from "../models/redminejournalcache";

import * as redmine from "../lib/redmine";

import { DUMMY_PROJECTS } from "../misc/dummy_data";

export default function (app: Express, useDummyData: boolean) {
  app.get<{}, Api.Projects.InProgress.type>(
    Api.Projects.InProgress.path,
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
              url: integrations.Projects.redmine.url + "/projects",
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

  app.get<{}, Api.Projects.Recent.type>(
    Api.Projects.Recent.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const integrations = await Integration.findOne({
        where: { ownerId: req.session.userId },
      });

      if (integrations && integrations.Projects.redmine) {
        // redmine project ID -> habit ID
        const PROJECT_HABIT_MAPPING = {};

        let cachedItem = await RedmineJournalCache.findOne({
          where: {
            state: State.New,
            ownerId: req.session.userId,
          },
          order: [
            [RedmineJournalCache.getAttributes().createdAt.field!, "ASC"],
          ],
        });

        if (cachedItem == null) {
          const cachedLastItem = await RedmineJournalCache.findOne({
            where: { ownerId: req.session.userId },
            order: [
              [RedmineJournalCache.getAttributes().createdAt.field!, "DESC"],
            ],
          });

          const data = await redmine.fetchUpdatedSince({
            since: cachedLastItem
              ? new Date(cachedLastItem.createdAt.getTime() + 1000)
              : new Date(new Date().getTime() - 7 * 24 * 3600e3),
            maxIssues: 10,
            url: integrations.Projects.redmine.url,
            api_key: integrations.Projects.redmine.api_key,
          });

          for (let i of data) {
            const cached = await RedmineJournalCache.findOne({
              where: {
                ownerId: req.session.userId,
                journalId: i.journal.id,
              },
            });

            if (!cached) {
              await RedmineJournalCache.create({
                data: i.journal,
                journalId: i.journal.id,
                projectId: i.issue.project.id,
                issueId: i.issue.id,
                state: State.New,
                createdAt: new Date(i.journal.created_on),
                ownerId: req.session.userId,
              });
            }
          }
        }

        cachedItem = await RedmineJournalCache.findOne({
          where: {
            state: State.New,
            ownerId: req.session.userId,
          },
          order: [
            [RedmineJournalCache.getAttributes().createdAt.field!, "ASC"],
          ],
        });

        if (cachedItem) {
          res.send({
            event: {
              issueSubject: "TODO",
              url:
                integrations.Projects.redmine.url +
                "/issues/" +
                cachedItem.issueId.toString(),
            },
          });
        } else {
          res.send({});
        }
      } else {
        res.send({});
      }
    }
  );
}
