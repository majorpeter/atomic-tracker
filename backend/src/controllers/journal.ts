import { Express } from "express";
import { Api } from "../lib/api";
import { Journal } from "../lib/db";
import { getIsoDate } from "../lib/formatter";
import { Op } from "sequelize";

//TODO multiuser support
const USER_ID = 0;
const HISTORY_LENGTH = 7;

export default function (app: Express) {
  app.get<{}, Api.Journal.type>(Api.Journal.path, async (_, res) => {
    const today = await Journal.findOne({
      where: {
        date: Journal.dateToRawValue(getIsoDate(new Date())),
      },
    });

    const historyStartDateRaw =
      Journal.dateToRawValue(getIsoDate(new Date())) - HISTORY_LENGTH;
    const historyEntries = await Journal.findAll({
      where: {
        date: { [Op.gte]: historyStartDateRaw },
      },
      attributes: [
        Journal.getAttributes().date.field!,
        Journal.getAttributes().count.field!,
      ],
      order: [[Journal.getAttributes().date.field!, "ASC"]],
    });

    res.send({
      textToday: today ? today.content : "",
      history: [...Array(HISTORY_LENGTH).keys()].map((item) => {
        const dateRaw = historyStartDateRaw + item;
        return {
          date: Journal.rawToIsoDateValue(dateRaw),
          count:
            historyEntries.find(
              (value) => value.dataValues.date == dateRaw.toString()
            )?.count || 0,
        };
      }),
    });
  });

  app.get<Api.Journal.Date.params, Api.Journal.Date.type>(
    Api.Journal.Date.pathWithDate,
    async (req, res) => {
      const journal = await Journal.findOne({
        where: {
          date: Journal.dateToRawValue(req.params.date),
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
    async (req, res) => {
      const journal = await Journal.findOne({
        where: {
          ownerId: USER_ID,
          date: Journal.dateToRawValue(req.params.date),
        },
      });

      const text = req.body.text;
      const count = text.split("\n").length;
      if (journal) {
        journal.content = text;
        journal.count = count;
        await journal.save();
      } else {
        Journal.create({
          date: req.params.date,
          content: text,
          count,
          ownerId: USER_ID,
        });
      }

      res.sendStatus(200);
    }
  );
}
