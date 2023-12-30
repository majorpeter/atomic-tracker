import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";

import db from "../lib/db";
import * as redmine from "../lib/redmine";

import { User } from "./user";

import { Journal } from "../lib/redmine";
import { Api } from "../lib/api";
import { Integration } from "./integration";

export enum State {
  New = 0,
  Processed = 1,
  Ignored = 2,
}

export class ProjectActivityCache extends Model<
  InferAttributes<ProjectActivityCache>,
  InferCreationAttributes<ProjectActivityCache>
> {
  declare id: CreationOptional<number>;
  declare redmineJournalId: number;
  declare projectId: number;
  declare issueId: number;
  declare data: Journal;
  declare state: State;
  declare Owner: NonAttribute<User>;
  declare ownerId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  async activity(): Promise<Api.Projects.Activity | null> {
    const integrations = await Integration.findOne({
      where: { ownerId: this.ownerId },
    });

    if (integrations && integrations.Projects.redmine) {
      const issue = await redmine.getIssue(this.issueId, {
        url: integrations.Projects.redmine.url,
        api_key: integrations.Projects.redmine.api_key,
      });

      const activity: Api.Projects.Activity = {
        projectActivityId: this.id,
        issueSubject: issue.issue.subject,
        url:
          integrations.Projects.redmine.url +
          "/issues/" +
          this.issueId.toString(),
      };

      const progress = this.data.details.find(
        (item) => item.name == "done_ratio"
      );

      if (progress) {
        activity.progressChanged = {
          from: progress.old_value ? parseInt(progress.old_value) : 0,
          to: parseInt(progress.new_value),
        };
      }

      return activity;
    }

    return null;
  }
}

ProjectActivityCache.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    redmineJournalId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    issueId: DataTypes.INTEGER,
    data: DataTypes.JSON,
    state: {
      type: DataTypes.TINYINT,
      get() {
        return State[this.getDataValue("state") as number];
      },
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize: db }
);
