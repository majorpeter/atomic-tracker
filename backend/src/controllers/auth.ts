import { Express, NextFunction, Request, Response } from "express";
import { Api } from "../lib/api";
import { User } from "../lib/db";

import crypto from "node:crypto";

export function hashAndSaltPassword(password: string): string {
  const salt = crypto.randomBytes(64);
  const hash = crypto.createHash("sha256");
  hash.update(password);
  hash.update(salt);
  return salt.toString("base64") + ":" + hash.digest("base64");
}

function verifyHashedAndSaltedPassword(
  password: string,
  saltedAndHash: string
): boolean {
  const salt = Buffer.from(saltedAndHash.split(":")[0], "base64");
  const hash = crypto.createHash("sha256");
  hash.update(password);
  hash.update(salt);
  return hash.digest("base64") == saltedAndHash.split(":")[1];
}

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
  app.get<{}, Api.Auth.Login.get_resp>(Api.Auth.Login.path, async (_, res) => {
    const hasUser = (await User.findOne()) !== null;
    res.send({
      installed: hasUser,
    });
  });

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
          // allow empty password if empty in db also
          if (user.passwordHash != "") {
            if (
              !verifyHashedAndSaltedPassword(
                req.body.password,
                user.passwordHash
              )
            ) {
              res.sendStatus(400);
              return;
            }
          }

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

  app.get(Api.Auth.Logout.path, (req, res) => {
    req.session.destroy((err) => {
      res.sendStatus(err ? 500 : 200);
    });
  });

  app.get<{}, Api.Auth.Me.type>(Api.Auth.Me.path, (req, res) => {
    res.send({
      name: req.session.userName!,
      language: req.session.interfaceLanguage!,
    });
  });
}
