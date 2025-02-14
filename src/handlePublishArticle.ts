import { downloadImage } from "./downloadImage";
import { uploadThumbnailImage } from "./uploadThumbnailImage";
import axios from "axios";

export interface WxArticle {
  title: string,
  author: string,
  digest: string,
  show_cover_pic: number,
  content: string,
}

export async function handlePublishArticle(mediaId: string): Promise<any> {
  // Step 1: Upload the article
  const response = await axios.post(
    `https://api.weixin.qq.com/cgi-bin/freepublish/submit`,
    {
      media_id: mediaId,
    },
    {
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    }
  );

  
  if (response.data.errmsg !== "ok") {
    throw new Error("Failed to submit article to WeChat");
  }

  return response.data;
}