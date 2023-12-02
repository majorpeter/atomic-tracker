import { Express, NextFunction, Request, Response } from "express";
import { Api } from "../lib/api";
import { User } from "../lib/db";

/**
 *can be put in express get()/post() functions before the handler to enforce a logged in user
 * @note any types are required to be compatible with generic usage in controllers (i.e. Request is Request<Api...,...>)
 */
export const isLoggedInMiddleware = (
  req: any,
  res: any,
  next: NextFunction
) => {
  if ((req as Request).session.userId) {
    next();
  } else {
    (res as Response).sendStatus(401);
  }
};

export default function (app: Express) {
  app.post<{}, {}, Api.Auth.Login.post_type>(
    Api.Auth.Login.path,
    async (req, res) => {
      try {
        const user = await User.findOne({
          where: {
            name: req.body.userName,
          },
        });

        if (user) {
          // TODO passwd check: else 400

          req.session.userId = user.id;
          req.session.userName = user.name;
          req.session.interfaceLanguage = "en"; //TODO

          //TODO req.session.regenerate(() => {
          res.sendStatus(200);
          //});
        } else {
          res.sendStatus(400);
        }
      } catch {
        res.sendStatus(500);
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
