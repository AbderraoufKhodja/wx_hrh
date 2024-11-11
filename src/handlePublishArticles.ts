import axios from "axios";
import { aiLanguageProcessing } from "./aiLanguageProcessing";
import { publishToWeChat } from "./publishToWechat";
import { getNewestArticles } from "./getNewestArticles";
import { downloadImage } from "./downloadImage";
import { extractArticleText } from "./extractArticleText";
import { uploadThumbnailImage } from "./uploadThumbnailImage";
import { Console } from "console";

export async function handlePublishArticles(): Promise<any> {
  const urls = await getNewestArticles();
  console.log("urls", urls);

  for (const url of urls || []) {
    if (url) {
      const articleText = await extractArticleText(url);
      console.log("articleText", articleText);
      
      if (!articleText.article) {
        return new Error("Article text not found");
      }

      if (!articleText.headerImgUrl) {
        return new Error("Image URL not found");
      }

      const aiResponse = await aiLanguageProcessing(articleText.article);

      const contentHTML = aiResponse.candidates[0].content.parts[0].text;

      if (!contentHTML) {
        return new Error("Content text not found");
      }

      const appId = process.env.APP_ID;
      const appSecret = process.env.APP_SECRET;

      // Step 1: Get access token
      const tokenResponse: any = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
      );

      const accessToken = tokenResponse.data.access_token;

      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      const imageUrl = articleText.headerImgUrl;
      const imagePath = "temp_image.jpg";

      var uploadResponse;
      if (imageUrl) {
        await downloadImage(imageUrl, imagePath);
        uploadResponse = await uploadThumbnailImage(imagePath, accessToken);
      }

      if (!uploadResponse) {
        return new Error("Upload response not found");
      }
      // Publish the article to WeChat
      await publishToWeChat(contentHTML, uploadResponse, accessToken);
    }
  }
}
