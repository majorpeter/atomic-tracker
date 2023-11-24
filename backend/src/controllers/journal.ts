import { Express } from "express";
import { Api } from "../lib/api";

let data = {
  items: [
    "I saw a cute dog today",
    "had lunch with a friend",
    "watched the latest episode of my show",
    "walk in the park",
  ],
};

export default function (app: Express) {
  app.get<{}, Api.Journal.type>(Api.Journal.path, (_, res) => {
    res.send(data);
  });

  app.post<{}, Api.Journal.type>(Api.Journal.path, (req, res) => {
    data = req.body;
    res.sendStatus(200);
  });
}
