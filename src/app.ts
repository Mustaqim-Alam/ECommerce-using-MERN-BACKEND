import { log } from "console";
import express from "express";
const app = express();

const port = 9900;

app.listen(port, () => {
  console.log("App is listening on http//:localhost:" + port);
});
