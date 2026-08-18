import express from "express";
import router from "./routes/player.route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/", (req, res, next) => {
  console.log(`${req.url} | ${req.method}`);
  next();
});

app.use("/start-game", router);

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
