import express from "express";
import playerRouter from "./routes/player.route.js";
import roundRouter from "./routes/round.route.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json(err.message);
}

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(process.cwd() + "/public"));

app.use("/", (req, res, next) => {
  console.log(`${req.url} | ${req.method}`);
  next();
});

app.use("/", playerRouter);
app.use("/", roundRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
