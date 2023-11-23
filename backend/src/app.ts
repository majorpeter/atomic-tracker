import express from "express";

import { Test } from "@atomic-tracker/common";

const app = express();
app.listen(8080, () => {
  console.log("Backend listening!");
});

app.disable("x-powered-by");

app.get<{}, Test>("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.send({
    id: 100,
    name: "From backend",
  });
});
