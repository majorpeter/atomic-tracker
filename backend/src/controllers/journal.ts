import { Express } from "express";
import { Api } from "../lib/api";
import { Journal } from "../models/journal";
import { getIsoDate } from "../lib/formatter";
import { Op } from "sequelize";
import { isLoggedInMiddleware } from "./auth";

const HISTORY_LENGTH = 7;

export default function (app: Express) {
  app.get<{}, Api.Journal.type>(
    Api.Journal.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const today = await Journal.findOne({
        where: {
          date: Journal.dateToRawValue(getIsoDate(new Date())),
          ownerId: req.session.passport!.user.id,
        },
      });

      const historyStartDate = new Date();
      historyStartDate.setDate(historyStartDate.getDate() - HISTORY_LENGTH);

      const historyEntries = await Journal.findAll({
        where: {
          date: {
            [Op.gte]: Journal.dateToRawValue(getIsoDate(historyStartDate)),
          },
          ownerId: req.session.passport!.user.id,
        },
        attributes: [
          Journal.getAttributes().date.field!,
          Journal.getAttributes().count.field!,
        ],
        order: [[Journal.getAttributes().date.field!, "ASC"]],
      });

      res.send({
        today: today
          ? {
              text: today.content,
              count: today.count,
            }
          : { text: "", count: 0 },
        history: [...Array(HISTORY_LENGTH).keys()].map((item) => {
          const date = new Date(historyStartDate);
          date.setDate(date.getDate() + item);
          const dateRaw = Journal.dateToRawValue(getIsoDate(date));

          return {
            date: Journal.rawToIsoDateValue(dateRaw),
            count:
              historyEntries.find(
                (value) => value.dataValues.date == dateRaw.toString()
              )?.count || 0,
          };
        }),
      });
    }
  );

  app.get<Api.Journal.Date.params, Api.Journal.Date.type>(
    Api.Journal.Date.pathWithDate,
    isLoggedInMiddleware,
    async (req, res) => {
      const journal = await Journal.findOne({
        where: {
          date: Journal.dateToRawValue(req.params.date),
          ownerId: req.session.passport!.user.id,
        },
      });

      if (journal) {
        res.send({ text: journal?.content });
      } else {
        res.send({ text: "" });
      }
    }
  );

  app.post<Api.Journal.Date.params, {}, Api.Journal.Date.type>(
    Api.Journal.Date.pathWithDate,
    isLoggedInMiddleware,
    async (req, res) => {
      const journal = await Journal.findOne({
        where: {
          ownerId: req.session.passport!.user.id,
          date: Journal.dateToRawValue(req.params.date),
        },
      });

      const textLines = req.body.text
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const count = textLines.length;
      const text = textLines.join("\n");

      if (journal) {
        journal.content = text;
        journal.count = count;
        await journal.save();
      } else {
        await Journal.create({
          date: req.params.date,
          content: text,
          count,
          ownerId: req.session.passport!.user.id,
        });
      }

      res.sendStatus(200);
    }
  );
}
