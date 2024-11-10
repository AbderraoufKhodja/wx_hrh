import * as fs from "fs";

export async function downloadImage(
  imageUrl: string,
  outputPath: string
): Promise<void> {
  const response: any = await axios({
    url: imageUrl,
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
