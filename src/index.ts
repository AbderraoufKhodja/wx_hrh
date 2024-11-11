import path from "path";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { init as initDB, Counter } from "./db";
import { Request, Response } from "express";
import dotenv from "dotenv";
// import { handlePublishArticles } from "./handlePublishArticles";
import timeout from "connect-timeout";
import axios from "axios";
import { aiLanguageProcessing } from "./aiLanguageProcessing";
import { publishToWeChat } from "./publishToWechat";
import { getNewestArticles } from "./getNewestArticles";
import { downloadImage } from "./downloadImage";
import { extractArticleText } from "./extractArticleText";
import { uploadThumbnailImage } from "./uploadThumbnailImage";
dotenv.config();

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// Set a timeout of 30 seconds
app.use(timeout("30s"));

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

app.post("/api/publishArticles", async (req: Request, res: Response) => {
  const { action } = req.body;
  try {
    const urls = await getNewestArticles();
    console.log("urls", urls);

    for (const url of urls || []) {
      if (url) {
        const articleText = await extractArticleText(url);
        console.log("articleText", articleText);

        if (!articleText.article) throw new Error("Article text not found");
        

        if (!articleText.headerImgUrl) throw new Error("Image URL not found");
        

        const aiResponse = await aiLanguageProcessing(articleText.article);

        const contentHTML = aiResponse.candidates[0].content.parts[0].text;

        if (!contentHTML) throw new Error("Content text not found");
        

        const appId = process.env.APP_ID;
        const appSecret = process.env.APP_SECRET;

        // Step 1: Get access token
        const tokenResponse: any = await axios.get(
          `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) throw new Error("Access token not found");

        const imageUrl = articleText.headerImgUrl;
        const imagePath = "temp_image.jpg";

        var uploadResponse;
        if (imageUrl) {
          await downloadImage(imageUrl, imagePath);
          uploadResponse = await uploadThumbnailImage(imagePath, accessToken);
        }

        if (!uploadResponse) throw new Error("Upload response not found");

        // Publish the article to WeChat
        await publishToWeChat(contentHTML, uploadResponse, accessToken);
      }
    }

    res.send({
      code: 0,
      data: "Published",
    });
  } catch (e) {
    console.error(e);
    res.send({
      code: 1,
      data: e,
    });
  }
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
