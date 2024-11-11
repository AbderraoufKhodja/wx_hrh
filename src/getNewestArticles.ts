import puppeteer from "puppeteer";

export async function getNewestArticles(): Promise<string[]> {
  const websiteURL = "https://www.algerie360.com/tag/a-la-une/";
  // Launch a new browser instance
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath:
      process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium-browser",
  });
  // Open a new page
  const page = await browser.newPage();
  // Navigate to the specified URL
  await page.goto(websiteURL, { waitUntil: "networkidle2" });

  // Extract all hyperlinks from <article> elements on the page
  const articleHyperlinks = await page.evaluate(() => {
    // Find the div with the specified class
    const targetDiv = Array.from(
      document.querySelectorAll("div.col-lg-8.blog__content.mb-72")
    )[0];

    const links: string[] = [];
    if (targetDiv) {
      // Select all <a> elements inside the targetDiv
      const anchorElements = targetDiv.querySelectorAll("article a");
      anchorElements.forEach((anchor) => {
        const href = anchor.getAttribute("href");
        if (href) links.push(href);
      });
    }
    // Filter out duplicate links and links that include the word "category"
    return Array.from(
      new Set(links.filter((link) => !link.includes("category")))
    );
  });

  // Close the browser
  await browser.close();

  return articleHyperlinks;
}
