import express from "express";
import playerRouter from "./routes/player.route.js";
import roundRouter from "./routes/round.route.js";
import dotenv from "dotenv";

dotenv.config();

function errorHandler(err, req, res, next) {
  res.status(err.status).json(err.message);
}

const app = express();

app.use(express.json());

app.use("/", (req, res, next) => {
  console.log(`${req.url} | ${req.method}`);
  next();
});

app.use("/start-game", playerRouter);
app.use("/start-round", roundRouter);
app.use("/", roundRouter);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
