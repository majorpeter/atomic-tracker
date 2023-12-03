import fs from "fs/promises";
import path from "path";

import { Express } from "express";
import { Api } from "../lib/api";

import { isLoggedInMiddleware } from "./auth";

async function getConfig(): Promise<Api.Radio.type> {
  try {
    return JSON.parse(
      (
        await fs.readFile(
          path.resolve(__dirname, "..", "..", "dist", "radio.json")
        )
      ).toString()
    );
  } catch {
    return { stations: [] };
  }
}

export default function (app: Express) {
  app.get<{}, Api.Radio.type>(
    Api.Radio.path,
    isLoggedInMiddleware,
    async (_, res) => {
      res.send(await getConfig());
    }
  );
}
