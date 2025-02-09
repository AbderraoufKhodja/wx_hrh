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

export async function handlePublishArticle(
  article: WxArticle, headerImgUrl: string): Promise<any> {
  const imageUrl = headerImgUrl;
  const imagePath = "temp_image.jpg";


  await downloadImage(imageUrl, imagePath);
  const uploadImgResponse = await uploadThumbnailImage(imagePath);

  if (!uploadImgResponse) return new Error("Upload response not found");

  const imgUrl = uploadImgResponse.url;
  const thumbMediaId = uploadImgResponse.thumbMediaId;

  // Add an image at the top of the body content
  const imgTag = `<img src="${imgUrl}" alt="Image" />`;
  article.content = imgTag + article.content;

  // Step 1: Upload the article
  const response = await axios.post(
    `https://api.weixin.qq.com/cgi-bin/draft/add`,
    {
      articles: [
        {
          title: article.title,
          thumb_media_id: thumbMediaId,
          author: article.author,
          digest: article.digest,
          show_cover_pic: article.show_cover_pic,
          content: article.content,
        },
      ],
    },
    {
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    }
  );

  const mediaId = response.data.media_id;

  if (!mediaId) throw new Error("Media ID not found");


  console.log("Article published to WeChat successfully");

  return mediaId;

  // // Step 3: Publish the article
  // await axios.post(`https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=${accessToken}`, {
  //   filter: {
  //     is_to_all: true,
  //   },
  //   mpnews: {
  //     media_id: mediaId,
  //   },
  //   msgtype: 'mpnews',
  //   send_ignore_reprint: 0,
  // });
}