import { Express } from "express";

import { Api } from "../lib/api";
import { isLoggedInMiddleware } from "./auth";

import { Integration } from "../models/integration";
import { ProjectActivityCache, State } from "../models/projectactivitycache";
import { Activity, Habit, TrackedActivity } from "../models/habit";
import { Op } from "sequelize";

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

  async function importJournalsFromRedmine(params: {
    userId: number;
    redmine: { url: string; api_key: string };
  }) {
    const cachedLastItem = await ProjectActivityCache.findOne({
      where: { ownerId: params.userId },
      order: [[ProjectActivityCache.getAttributes().createdAt.field!, "DESC"]],
    });

    const data = await redmine.fetchUpdatedSince({
      since: cachedLastItem
        ? new Date(cachedLastItem.createdAt.getTime() + 1000)
        : new Date(new Date().getTime() - 7 * 24 * 3600e3),
      maxIssues: 10,
      url: params.redmine.url,
      api_key: params.redmine.api_key,
    });

    for (let i of data) {
      const cached = await ProjectActivityCache.findOne({
        where: {
          ownerId: params.userId,
          redmineJournalId: i.journal.id,
        },
      });

      if (!cached) {
        await ProjectActivityCache.create({
          data: i.journal,
          redmineJournalId: i.journal.id,
          projectId: i.issue.project.id,
          issueId: i.issue.id,
          state: State.New,
          createdAt: new Date(i.journal.created_on),
          ownerId: params.userId,
        });
      }
    }
  }

  async function fetchNewProjectActivity(params: {
    userId: number;
  }): Promise<{ activity: Api.Projects.Activity; projectId: number } | null> {
    const integrations = await Integration.findOne({
      where: { ownerId: params.userId },
    });

    if (integrations && integrations.Projects.redmine) {
      const habits = await Habit.findAll({
        where: {
          ownerId: params.userId,
          projectId: { [Op.not]: null },
        },
      });

      if (habits.length > 0) {
        let cachedItem = await ProjectActivityCache.findOne({
          where: {
            projectId: habits.map((h) => h.projectId!),
            state: State.New,
            ownerId: params.userId,
          },
          order: [
            [ProjectActivityCache.getAttributes().createdAt.field!, "ASC"],
          ],
        });

        if (cachedItem == null) {
          await importJournalsFromRedmine({
            userId: params.userId!,
            redmine: integrations.Projects.redmine,
          });
        }

        cachedItem = await ProjectActivityCache.findOne({
          where: {
            projectId: habits.map((h) => h.projectId!),
            state: State.New,
            ownerId: params.userId,
          },
          order: [
            [ProjectActivityCache.getAttributes().createdAt.field!, "ASC"],
          ],
        });

        if (cachedItem) {
          const activity = await cachedItem.activity();
          if (activity) {
            return { projectId: cachedItem.projectId, activity };
          }
        }
      }
    }

    return null;
  }

  app.get<{}, Api.Projects.Recent.get_type>(
    Api.Projects.Recent.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const activity = await fetchNewProjectActivity({
        userId: req.session.userId!,
      });

      if (activity) {
        const habit = await Habit.findOne({
          where: {
            projectId: activity.projectId,
            ownerId: req.session.userId,
          },
          include: [Activity],
        });

        res.send({
          projectActivity: activity.activity,
          activities: habit?.Activities!.map((a) => ({
            id: a.id,
            name: a.name,
          })),
        });
      } else {
        res.send({});
      }
    }
  );

  app.post<{}, {}, Api.Projects.Recent.post_req>(
    Api.Projects.Recent.path,
    isLoggedInMiddleware,
    async (req, res) => {
      if (req.body.action == "track") {
        const journal = await ProjectActivityCache.findOne({
          where: {
            id: req.body.id,
            ownerId: req.session.userId,
          },
        });

        const activity = await Activity.findOne({
          where: {
            id: req.body.activityId,
            ownerId: req.session.userId,
          },
        });

        if (journal && activity) {
          await TrackedActivity.create({
            ActivityId: activity.id,
            HabitId: activity.HabitId,
            ProjectActivityCacheEntryId: journal.id,
            ownerId: req.session.userId!,
            createdAt: journal.createdAt,
          });

          journal.state = State.Processed;
          await journal.save();

          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      } else if (req.body.action == "dismiss") {
        const journal = await ProjectActivityCache.findOne({
          where: {
            id: req.body.id,
            ownerId: req.session.userId,
          },
        });

        if (journal) {
          journal.state = State.Ignored;
          await journal.save();

          res.sendStatus(200);
        } else {
          res.sendStatus(404);
        }
      } else {
        res.sendStatus(400);
      }
    }
  );
}
