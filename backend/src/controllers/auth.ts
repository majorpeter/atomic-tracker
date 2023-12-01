import { Express } from "express";
import { Api } from "../lib/api";
import { User } from "../lib/db";

export default function (app: Express) {
  app.post<{}, {}, Api.Auth.Login.post_type>(
    Api.Auth.Login.path,
    async (req, res) => {
      const user = await User.findOne({
        where: {
          name: req.body.userName,
        },
      });

      if (user) {
        // TODO passwd check: else 400

        req.session.userName = user.name;
        req.session.interfaceLanguage = "en"; //TODO

        req.session.regenerate(() => {
          res.sendStatus(200);
        });
      } else {
        res.send(400);
      }
    }
  );

  app.get<{}, Api.Auth.Me.type>(Api.Auth.Me.path, (req, res) => {
    res.send({
      name: req.session.userName!,
      language: req.session.interfaceLanguage!,
    });
  });
}
