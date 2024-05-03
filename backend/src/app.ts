import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import cookies from "cookie-parser";
import path from "path";
import { configDotenv } from "dotenv";

import { init as initDb } from "./lib/db";

import auth, { sessionStore } from "./controllers/auth";
import install from "./controllers/install";
import habits from "./controllers/habits";
import todos from "./controllers/todos";
import calendar from "./controllers/calendar";
import journal from "./controllers/journal";
import projects from "./controllers/projects";
import weather from "./controllers/weather";
import radio from "./controllers/radio";
import config from "./controllers/config";

configDotenv();

const LISTENING_PORT = process.env.LISTENING_PORT || 8080;
const USE_DUMMY_DATA =
  process.env.USE_DUMMY_DATA != undefined &&
  parseInt(process.env.USE_DUMMY_DATA) > 0;

const FRONTEND_RELATIVE_PATH = "../../frontend/dist";

const app = express();

app.use(
  session({
    secret: Math.random().toString(),
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 3600 * 1e3 },
    store: sessionStore,
  })
);
app.use(cookies());
app.use(express.json());

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use((req, _, next) => {
  console.log(req.method, req.path, "from", req.ip);
  next();
});

app.use(express.static(path.resolve(__dirname, FRONTEND_RELATIVE_PATH)));

auth(app);
install(app);
habits(app);
todos(app, USE_DUMMY_DATA);
calendar(app, USE_DUMMY_DATA);
journal(app);
projects(app, USE_DUMMY_DATA);
weather(app);
radio(app);
config(app);

app.get("/api/*", (_, res) => {
  res.sendStatus(404);
});

/**
 * default route gets frontend's index.html
 * @note this is required to allow page reloads on routes that react-router generates
 */
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, FRONTEND_RELATIVE_PATH, "index.html"));
});

/**
 * error handler is the last handler registered before `app.listen()`
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Exception at url: %s", req.url);
  console.error(err);
  res.sendStatus(500);
});

initDb();

app.listen(LISTENING_PORT, () => {
  console.log(`Backend listening on localhost:${LISTENING_PORT}!`);
});
