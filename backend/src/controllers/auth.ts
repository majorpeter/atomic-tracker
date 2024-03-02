import { Express, NextFunction, Request, Response } from "express";
import crypto from "node:crypto";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import { Api } from "../lib/api";
import { User } from "../models/user";
import { LimitedMemoryStore } from "../lib/session";

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
  if (process.env.BYPASS_LOGIN && parseInt(process.env.BYPASS_LOGIN)) {
    req.session.userId = 1;
  }

  // temporary hack for passport integration to old session management
  if (req.session.passport) {
    req.session.userId = req.session.passport.user.id;
    req.session.interfaceLanguage = req.session.passport.user.lang;
  }

  if ((req as Request).session.userId) {
    next();
  } else {
    (res as Response).sendStatus(401);
  }
};

export const sessionStore = new LimitedMemoryStore(15);

export default function (app: Express) {
  const googleLoginAvailable =
    (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) !=
    undefined;

  app.get<{}, Api.Auth.Login.get_resp>(Api.Auth.Login.path, async (_, res) => {
    const hasUser = (await User.findOne()) !== null;
    res.send({
      installed: hasUser,
      social: {
        google: googleLoginAvailable,
      },
    });
  });

  app.post<{}, Api.Auth.Me.type, Api.Auth.Login.post_type>(
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

          // regenerate to protect against session fixation
          req.session.regenerate(() => {
            req.session.userId = user.id;
            req.session.userName = user.name;
            req.session.interfaceLanguage = user.language;
            req.session.userAgent = req.headers["user-agent"];

            req.session.pendingConfig = {};

            res.send({
              name: user.name,
              language: user.language,
            });
          });
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

  app.get<{}, Api.Auth.Me.type>(
    Api.Auth.Me.path,
    isLoggedInMiddleware,
    (req, res) => {
      res.send({
        name: req.session.userName!,
        language: req.session.interfaceLanguage!,
      });
    }
  );

  app.post<{}, Required<Api.Auth.Me.type>, Api.Auth.Me.type>(
    Api.Auth.Me.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const user = await User.findOne({ where: { id: req.session.userId! } });
      if (user) {
        if (req.body.language) {
          user.language = req.body.language;
          req.session.interfaceLanguage = req.body.language;
          await user.save();
        }
        res.send({
          name: req.session.userName!,
          language: req.session.interfaceLanguage!,
        });
      } else {
        res.sendStatus(500);
      }
    }
  );

  app.get<{}, Api.Auth.Sessions.type>(
    Api.Auth.Sessions.path,
    isLoggedInMiddleware,
    (req, res) => {
      const mySessions = sessionStore.getSessionsOfUser(req.session.userId!);
      res.send({
        sessions: mySessions.map((session) => ({
          userAgent: session.userAgent,
          expiresIsoDate: session.cookie.expires as unknown as string, // JSON parsing keeps it as string
        })),
      });
    }
  );

  // enable API paths for Google OAuth2 login if environment variables are set
  if (googleLoginAvailable) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: "/oauth2/redirect/google",
          scope: ["email", "openid", "profile"],
        },
        async (_accessToken, _refreshToken, profile, done) => {
          let user = await User.findOne({
            where: {
              googleUid: profile.id,
            },
          });

          if (!user) {
            user = await User.create({
              name: profile._json.email!,
              passwordHash: "google",
              language: profile._json.locale!, //TODO transform locale to lang
              email: profile._json.email!,
              googleUid: profile.id,
            });
          }

          done(null, {
            id: user.id,
            lang: profile._json.locale,
          });
        }
      )
    );

    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user, done) {
      done(null, user as User);
    });

    app.get(Api.Auth.Login.Google.path, passport.authenticate("google"));

    app.get(
      "/oauth2/redirect/google",
      passport.authenticate("google", {
        failureRedirect: "/login",
        failureMessage: true,
      }),
      function (_, res) {
        console.log("redirecting");
        res.redirect("/");
      }
    );
  }
}
