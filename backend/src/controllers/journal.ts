import { Express } from "express";
import { Api } from "../lib/api";
import { Journal } from "../lib/db";

//TODO multiuser support
const USER_ID = 0;

export default function (app: Express) {
  app.get<Api.Journal.params, Api.Journal.type>(
    Api.Journal.pathWithDate,
    async (req, res) => {
      const journal = await Journal.findOne({
        where: {
          date: req.params.date,
        },
      });

      if (journal) {
        res.send({ text: journal?.content });
      } else {
        res.send({ text: "" });
      }
    }
  );

  app.post<Api.Journal.params, {}, Api.Journal.type>(
    Api.Journal.pathWithDate,
    async (req, res) => {
      const journal = await Journal.findOne({
        where: {
          ownerId: USER_ID,
          date: req.params.date,
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
