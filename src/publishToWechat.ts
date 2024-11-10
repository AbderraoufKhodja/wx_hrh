import * as cheerio from "cheerio";

export async function publishToWeChat(
    contentHTML: string,
    uploadImgResponse: any,
    accessToken: any
  ): Promise<void> {
    const $ = cheerio.load(contentHTML);
  
    // Select title element and extract text
    const title = $("title").text();
  
    // Select abstract element and extract text
    // Extract the content of the <meta> tags
    const metaTags = $("meta");
    var abstract: string | undefined;
  
    metaTags.each((index, element) => {
      const name = $(element).attr("name");
      abstract = $(element).attr("content");
    });
  
    // Select content element and extract text
    let content = $("body").html();
  
    // Add an image at the top of the body content
    const imgTag = `<img src="${uploadImgResponse.url}" alt="Image" />`;
    content = imgTag + content;
  
    // Step 1: Upload the article
    const uploadArticleResponse : any = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/draft/add?access_token=${accessToken}`,
      {
        articles: [
          {
            title: title,
            thumb_media_id: uploadImgResponse.thumbMediaId,
            author: "Roff",
            digest: abstract,
            show_cover_pic: 1,
            content: content,
          },
        ],
      }
    );
  
    const mediaId = uploadArticleResponse.data.media_id;
  
    if (!mediaId) {
      throw new Error("Media ID not found");
    }
  
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
  
    console.log("Article published to WeChat successfully");
  }