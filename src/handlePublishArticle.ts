import { publishToWeChat } from "./publishToWechat";
import { downloadImage } from "./downloadImage";
import { uploadThumbnailImage } from "./uploadThumbnailImage";

export async function handlePublishArticle(
  headerImgUrl: string, contentHTML: string): Promise<any> {
  const imageUrl = headerImgUrl;
  const imagePath = "temp_image.jpg";

  var uploadResponse;
  await downloadImage(imageUrl, imagePath);
  uploadResponse = await uploadThumbnailImage(imagePath);

  if (!uploadResponse) return new Error("Upload response not found");


  // Publish the article to WeChat
  await publishToWeChat(contentHTML, uploadResponse);
}
