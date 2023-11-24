import { Express } from "express";
import { Journal } from "../lib/api";

const data = [
  "I saw a cute dog today",
  "had lunch with a friend",
  "watched the latest episode of my show",
  "walk in the park",
];

export default function (app: Express) {
  app.get<{}, Journal.type>(Journal.path, (_, res) => {
    res.send(data);
  });
}
