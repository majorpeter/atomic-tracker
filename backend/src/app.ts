import express from "express";

import calendar from "./controllers/calendar";
import journal from "./controllers/journal";

const PORT = 8080;

const app = express();
app.listen(PORT, () => {
  console.log(`Backend listening on localhost:${PORT}!`);
});

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use((req, _, next) => {
  console.log(req.method, req.path, "from", req.ip);
  next();
});

calendar(app);
journal(app);
