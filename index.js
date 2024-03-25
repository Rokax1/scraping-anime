import { chromium } from "@playwright/test";
import "./associations.js";
import { createAnime } from "./services/models/animeModule.js";
import { createOrUpdateEpisodes } from "./services/models/episodeModule.js";
import { createOrUpdateEpisodeSource } from "./services/models/episodeSourceModule.js";

(async () => {
  const url = "https://www3.animeflv.net/";

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  // Set custom headers

  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  });

  const anime_links = await getAnimeLinks(url, page);
  for (let url of anime_links) {
    const anime_episodes = await getAnimeAndEpisodes(page, url);

    for (let episode of anime_episodes.episodes) {
      const sources_urls= await getSourceLinkToAnime(page, episode.content_url);
      const episodeSourceData=sources_urls.map((source)=>{
        return{
          EpisodeId:episode.id,
          source:source.provider,
          url:source.url,
        }
      });
     const episodesSource = await createOrUpdateEpisodeSource(episode.id,episodeSourceData);
     console.log(episodesSource.map(episode => episode.toJSON()));
    }


  }

  await browser.close();
})();

async function getAnimeAndEpisodes(page, url) {
  await page.goto(url);

  const isAnimeElement = await page.$("div.Container span.Type");
  let isAnimeText = await isAnimeElement.evaluate((span) => span.innerText);
  const isAnimeValue = isAnimeText == "ANIME" ? true : false;

  const isFinishedElement = await page.$("p.AnmStts span.fa-tv");
  let isFinishedText = await isFinishedElement.evaluate(
    (span) => span.innerText
  );
  const isFinishedValue = isFinishedText == "FINALIZADO" ? true : false;

  let cantidadDeLi = await page.$$eval("ul.ListCaps > li", (lis) => lis.length);

  if (isAnimeValue && !isFinishedValue) {
    cantidadDeLi = cantidadDeLi - 1;
  }

  let linksView = [];
  for (let index = 1; index <= cantidadDeLi; index++) {
    linksView.push(`${url.replace("/anime/", "/ver/")}-${index}`);
  }

  // linksShowAnime.push({
  //   name: getAnimeName(url),
  //   urls: linksView,
  //   isAnime: isAnimeValue,
  //   isFinished: isFinishedValue,
  // });
  let isFinishedTextBd = isFinishedValue == true ? "Finalizado" : "Emision";
  let animeCreated= await  createAnime(getAnimeName(url), isFinishedTextBd)
    .then((anime) => {
      return anime;
    })
    .catch((error) => {
      console.log("problemas al obtener anime y episodios");
    });

     // Array of episodes data you want to insert
     let episodes = linksView.map((link) => {
      return {
        number: getEpisodeNumber(link),
        title: getEpisodeName(link),
        AnimeId: animeCreated.id,
        content_url: link,
      };
    });

    const episodesCreated = await createOrUpdateEpisodes(animeCreated.id, episodes);

    return {
      anime: animeCreated,
      episodes: episodesCreated,
    };
}

async function getSourceLinkToAnime(page,show_url) {
  // for (let anime of linksShowAnime) {
  //   for (let url_view_anime of anime.urls) {
      await page.goto(show_url);

      // const aElement = await page.$('li[data-id="1"] a');
      // const htmlContent = await page.evaluate(element => element.innerHTML, aElement);
      // console.log(htmlContent);
      // await aElement.click();

      // const iframeElement = await page.$("div#video_box iframe");
      // const iframeSrc = await iframeElement.evaluate((iframe) => iframe.src);

      // console.log(iframeSrc, url_view_anime);

      const options = await page.$$(".CapiTnv li");

      let sources_url=[];
      for (const option of options) {
        const aElement = await option.$("a");
        const provider= await option.getAttribute('title');
        
        await aElement.click();

        const iframeElement = await page.$("div#video_box iframe");
        let iframeSrc = null;
        if (iframeElement) {
          iframeSrc = await iframeElement.evaluate((iframe) => iframe.src);
        }
        if (iframeSrc != null) {
          sources_url.push({
            url:iframeSrc,
            provider:provider
          });
        }
       
      }
      return sources_url;
    }
//   }
// }
async function getAnimeLinks(url, page) {
  await page.goto(`${url}/browse`);
  const links = await page.$$eval("ul.ListAnimes li article.Anime a", (links) =>
    links.map((link) => link.href)
  );

  let uniqueLinks = new Set(links);
  let linksAnimeArray = [...uniqueLinks];

  //TODO: borrar esta linea para obtenerlos todos
  //linksAnimeArray = linksAnimeArray.slice(0, 1);

  linksAnimeArray = linksAnimeArray.map((link) => {
    return getShowCapAnimeUrl(link, url);
  });

  return linksAnimeArray;
}

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

function getEpisodeNumber(url) {
  const match = url.match(/-(\d+)$/);

  if (match) {
    const lastNumber = match[1];
    return parseInt(lastNumber);
  } else {
    return "";
  }
}

function getEpisodeName(url) {
  const path = new URL(url).pathname;
  const parts = path.split("/");
  const episodeName = parts[parts.length - 1];
  return episodeName;
}
