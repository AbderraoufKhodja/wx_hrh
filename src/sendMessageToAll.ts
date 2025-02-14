import axios from "axios";

export interface WxArticle {
  title: string,
  author: string,
  digest: string,
  show_cover_pic: number,
  content: string,
}

export async function handleSendMessageToAll(mediaId: string): Promise<any> {
  // // Notify all users Publish the article
  // // await axios.post(`https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token=${accessToken}`, {
  // //   filter: {
  // //     is_to_all: true,
  // //   },
  // //   mpnews: {
  // //     media_id: mediaId,
  // //   },
  // //   msgtype: 'mpnews',
  // //   send_ignore_reprint: 0,
  // // });

  
  // if (response.data.errmsg !== "ok") {
  //   throw new Error("Failed to submit article to WeChat");
  // }

  // return response.data;
}