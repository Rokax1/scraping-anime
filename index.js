const { chromium } = require("@playwright/test");
// import { chromium, devices } from '@playwright/test';

(async () => {
  const selector = "ul.ListAnimes li article.Anime a";
  const selectorAnimePage = "ul.ListCaps > li";
  const url = "https://www3.animeflv.net";

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  // Set custom headers
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  });
  await page.goto(`${url}/browse`);
  const links = await page.$$eval(selector, (links) =>
    links.map((link) => link.href)
  );

  let uniqueLinks = new Set(links);
  let linksAnimeArray = [...uniqueLinks];

  //TODO: borrar esta linea para obtenerlos todos
  //linksAnimeArray = linksAnimeArray.slice(7, 9);

  linksAnimeArray = linksAnimeArray.map((link) => {
    return getShowCapAnimeUrl(link, url);
  });

  //console.log(linksAnimeArray, linksAnimeArray.length);
  // await page.goto(linksAnimeArray[15]);

  //TODO: falta hacer un foreach por cada anime

  let linksShowAnime = [];
  for (const url of linksAnimeArray) {
    await page.goto(url);

    const isAnimeElement = await page.$("div.Container span.Type");
    let isAnimeText = await isAnimeElement.evaluate((span) => span.innerText);
    const isAnimeValue = isAnimeText == "ANIME" ? true : false;

    const isFinishedElement = await page.$("p.AnmStts span.fa-tv");
    let isFinishedText = await isFinishedElement.evaluate(
      (span) => span.innerText
    );
    const isFinishedValue = isFinishedText == "FINALIZADO" ? true : false;

    let cantidadDeLi = await page.$$eval(
      selectorAnimePage,
      (lis) => lis.length
    );

    if (isAnimeValue && !isFinishedValue) {
      cantidadDeLi = cantidadDeLi - 1;
    }

    let linksView = [];
    for (let index = 1; index <= cantidadDeLi; index++) {
      linksView.push(`${url.replace("/anime/", "/ver/")}-${index}`);
    }

    linksShowAnime.push({
      name: getAnimeName(url),
      urls: linksView,
      isAnime: isAnimeValue,
      isFinished: isFinishedValue,
    });
  }

  console.log(linksShowAnime);

  let i=0;
  for (let anime of linksShowAnime) {

    for (let url_view_anime of anime.urls) {
      await page.goto(url_view_anime);

      await page.waitForLoadState("networkidle");
      const aElement = await page.$('li[data-id="1"] a');
      await aElement.click();
      if(i==0){
        await page.waitForTimeout(1000);
        const popupPromise = page.waitForEvent("popup");
        const popup = await popupPromise;
        popup.close();
      }

 
      // Esperar unos segundos
      await page.waitForLoadState("networkidle");

      await aElement.click();

      const iframeElement = await page.$("div#video_box iframe");
      const iframeSrc = await iframeElement.evaluate((iframe) => iframe.src);

      console.log(iframeSrc, url_view_anime);
      i++;
    }
  }
  await browser.close();
})();

async function newPage(browser) {
  let context = await browser.newContext();
  let page = await context.newPage();
  // Set custom headers
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  });

  return page;
}

function getShowCapAnimeUrl(str, url) {
  const partes = str.split("/");
  return `${url}/anime/${partes[partes.length - 1]}`;
}
function getAnimeName(str) {
  const partes = str.split("/");
  return partes[partes.length - 1];
}