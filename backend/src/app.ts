import express from "express";

import journal from "./controllers/journal";

const app = express();
app.listen(8080, () => {
  console.log("Backend listening!");
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

journal(app);
