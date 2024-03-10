import { Express, NextFunction, Request, Response } from "express";
import crypto from "node:crypto";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";

import { Api } from "../lib/api";
import { User } from "../models/user";
import { LimitedMemoryStore } from "../lib/session";
import { SessionData } from "express-session";
import { findLocaleForBcp47LangTag } from "../misc/locale";

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
    (req as Request).session.passport = {
      user: {
        id: 1,
        lang: "en",
        name: "nobody",
        userName: "nobody",
      },
    };
  }

  if ((req as Request).session.passport?.user.id) {
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
    passport.authenticate("local", { failureMessage: true }),
    (req, res) => {
      req.session.userAgent = req.headers["user-agent"];
      req.session.loginMethod = "local";

      res.send({
        name: "user.name",
        language: req.session.passport!.user.lang,
      });
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
        name: req.session.passport!.user.name,
        language: req.session.passport!.user.lang,
      });
    }
  );

  app.post<{}, Required<Api.Auth.Me.type>, Api.Auth.Me.type>(
    Api.Auth.Me.path,
    isLoggedInMiddleware,
    async (req, res) => {
      const user = await User.findOne({
        where: { id: req.session.passport!.user.id },
      });
      if (user) {
        if (req.body.language) {
          user.language = req.body.language;
          req.session.passport!.user.lang = req.body.language;
          await user.save();
        }
        res.send({
          name: req.session.passport!.user.name,
          language: req.session.passport!.user.lang,
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
      const mySessions = sessionStore.getSessionsOfUser(
        req.session.passport!.user.id
      );
      res.send({
        sessions: mySessions.map((session) => ({
          loginMethod: session.loginMethod,
          userAgent: session.userAgent,
          expiresIsoDate: session.cookie.expires as unknown as string, // JSON parsing keeps it as string
        })),
      });
    }
  );

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await User.findOne({
        where: {
          name: username,
        },
      });

      if (!user) {
        done("user");
        return;
      }

      // allow any password if empty in db also
      if (user.passwordHash != "") {
        if (!verifyHashedAndSaltedPassword(password, user.passwordHash)) {
          done("password");
        }
      }

      done(null, {
        id: user.id,
        lang: user.language,
        name: user.name, // same for this type
        userName: user.name,
      } satisfies SessionData["passport"]["user"]);
    })
  );

  // enable API paths for Google OAuth2 login if environment variables are set
  if (googleLoginAvailable) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL:
            process.env.GOOGLE_OAUTH_CALLBACK_URL || "/oauth2/redirect/google",
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
              language: findLocaleForBcp47LangTag(profile._json.locale!),
              email: profile._json.email!,
              googleUid: profile.id,
            });
          }

          done(null, {
            id: user.id,
            lang: profile._json.locale!,
            name: profile._json.name!,
            userName: profile._json.email!,
          } satisfies SessionData["passport"]["user"]);
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
      Api.Auth.Login.Google.callbackPath,
      passport.authenticate("google", {
        failureRedirect: "/login",
        failureMessage: true,
      }),
      function (req, res) {
        req.session.userAgent = req.headers["user-agent"];
        req.session.loginMethod = "google";
        res.redirect("/");
      }
    );
  }
}
