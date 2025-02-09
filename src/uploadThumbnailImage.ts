import * as fs from "fs";
import * as FormData from "form-data";
import axios from "axios";

export async function uploadThumbnailImage(filePath: string): Promise<any> {
    const form = new FormData.default();
    form.append("media", fs.createReadStream(filePath));
    
    const uploadResponse: any = await axios.post(
      `https://api.weixin.qq.com/cgi-bin/material/add_material?type=image`,
      form,
      {
        headers: form.getHeaders(),
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
      }
    );
  
    const thumbMediaId = uploadResponse.data.media_id;
    return {
      thumbMediaId: thumbMediaId,
      url: uploadResponse.data.url,
    };
  }
  