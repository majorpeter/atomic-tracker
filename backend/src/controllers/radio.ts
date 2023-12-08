import { Express } from "express";
import { Api } from "../lib/api";

import { isLoggedInMiddleware } from "./auth";
import { Integration } from "../models/integration";

export default function (app: Express) {
  app.get<{}, Api.Radio.type>(
    Api.Radio.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const int = await Integration.findOne({
        where: {
          ownerId: req.session.userId!,
        },
      });

      if (int) {
        res.send({ stations: int.Radios.stations });
      } else {
        res.send({ stations: [] });
      }
    }
  );
}
