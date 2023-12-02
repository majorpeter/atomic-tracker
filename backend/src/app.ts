import express from "express";
import session from "express-session";
import path from "path";

import auth from "./controllers/auth";
import habits from "./controllers/habits";
import todos from "./controllers/todos";
import calendar from "./controllers/calendar";
import journal from "./controllers/journal";
import projects from "./controllers/projects";
import config from "./controllers/config";

const PORT = 8080;
const FRONTEND_RELATIVE_PATH = "../../frontend/dist";

const app = express();

app.use(
  session({
    secret: Math.random().toString(),
    resave: false,
    saveUninitialized: false,
    //TODO limit store memory usage
  })
);

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use((req, _, next) => {
  console.log(req.method, req.path, "from", req.ip);
  next();
});

app.use(express.static(path.resolve(__dirname, FRONTEND_RELATIVE_PATH)));

auth(app);
habits(app);
todos(app);
calendar(app);
journal(app);
projects(app);
config(app);

/**
 * default route gets frontend's index.html
 * @note this is required to allow page reloads on routes that react-router generates
 */
app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, FRONTEND_RELATIVE_PATH, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Backend listening on localhost:${PORT}!`);
});
