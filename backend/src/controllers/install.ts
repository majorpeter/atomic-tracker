import { Express } from "express";
import { Api } from "../lib/api";
import { User } from "../models/user";
import { hashAndSaltPassword } from "./auth";

export default function (app: Express) {
  app.post<{}, {}, Api.Install.post_type>(
    Api.Install.path,
    async (req, res) => {
      const hasUser = (await User.findOne()) !== null;
      if (hasUser) {
        res.sendStatus(403);
        return;
      }

      await User.create({
        name: req.body.userName,
        passwordHash: hashAndSaltPassword(req.body.password),
        language: "en",
      });

      res.sendStatus(200);
    }
  );
}
