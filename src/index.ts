import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { init as initDB, Counter } from "./db";
import { Request, Response } from "express";

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);



app.get("/", async (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/count", async (req: Request, res: Response) => {
  const { action } = req.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await Counter.count(),
  });
});

app.get("/api/count", async (req: Request, res: Response) => {
  const result = await Counter.count();
  res.send({
    code: 0,
    data: result,
  });
});

app.get("/api/wx_openid", async (req: Request, res: Response) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("Server started on port", port);
  });
}

bootstrap();