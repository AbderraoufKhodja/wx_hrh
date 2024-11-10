import puppeteer from "puppeteer";

export interface ArticleData {
  title: string | null | undefined;
  headerImgUrl: string | null | undefined;
  article: string | null | undefined;
}

export async function extractArticleText(url: string): Promise<ArticleData> {
  // Launch a new browser instance
  const browser = await puppeteer.launch();
  // Open a new page
  const page = await browser.newPage();
  // Navigate to the specified URL
  await page.goto(url, { waitUntil: "networkidle2" });

  // Extract innerText of the body
  const bodyInnerText = await page.evaluate(() => {
    const targetDiv = document.querySelector("div.col-lg-8")?.innerHTML;

    const articleData: ArticleData = {
      title: document.querySelector("h1")?.innerText,
      headerImgUrl: document
        .querySelector("img.entry__img.lazy.loaded")
        ?.getAttribute("src"),
      article: document.querySelector("article.entry.mb-0")?.textContent,
    };

    return articleData;
  });

  // Close the browser
  await browser.close();

  return bodyInnerText;
}
