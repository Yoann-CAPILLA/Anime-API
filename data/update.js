const fs = require("fs");
const oldJson = require("./animes-archive.json");
const newJson = require("./anime-offline-database.json");

const equals = (a, b) =>
  a.length === b.length && a.every((elem) => b.includes(elem));
const newAnimes = [];
const modifiedAnimes = [];

console.time("update");

for (const anime of newJson.data) {
  let isNew = true;
  let isModified = false;

  const sourcesUrl = anime.sources.find((url) =>
    url.includes("myanimelist.net")
  );

  if (!sourcesUrl) {
    continue;
  }

  for (const oldAnime of oldJson.data) {
    if (
      sourcesUrl ===
      oldAnime.sources.find((url) => url.includes("myanimelist.net"))
    ) {
      isNew = false;

      if (anime.title !== oldAnime.title) {
        isModified = true;
      } else if (anime.episodes !== oldAnime.episodes) {
        isModified = true;
      } else if (anime.status !== oldAnime.status) {
        isModified = true;
      } else if (anime.animeSeason.season !== oldAnime.animeSeason.season) {
        isModified = true;
      } else if (anime.animeSeason.year !== oldAnime.animeSeason.year) {
        isModified = true;
      } else if (anime.picture !== oldAnime.picture) {
        isModified = true;
      } else if (anime.thumbnail !== oldAnime.thumbnail) {
        isModified = true;
      }

      const relationsAnime = anime.relations.filter((url) =>
        url.includes("myanimelist.net")
      );
      const relationsOldAnime = oldAnime.relations.filter((url) =>
        url.includes("myanimelist.net")
      );

      const relationsIdAnime = relationsAnime.map((elem) => elem.substring(30));
      const relationsIdOldAnime = relationsOldAnime.map((elem) =>
        elem.substring(30)
      );

      if (!equals(relationsIdAnime, relationsIdOldAnime)) {
        isModified = true;
      }

      if (!equals(anime.tags, oldAnime.tags)) {
        isModified = true;
      }

      if (!equals(anime.synonyms, oldAnime.synonyms)) {
        isModified = true;
      }
    }
  }

  if (isNew) {
    anime.new = true;
    newAnimes.push(anime);
  } else if (isModified) {
    anime.new = false;
    modifiedAnimes.push(anime);
  }
}

const news = JSON.stringify(newAnimes);

fs.writeFile("./data/new-animes.json", news, "utf8", (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("New animes saved!");
});

const modifications = JSON.stringify(modifiedAnimes);

fs.writeFile("./data/modified-animes.json", modifications, "utf8", (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Modified animes saved!");
});

const archive = JSON.stringify(newJson);

fs.writeFile("./data/animes-archive.json", archive, "utf8", (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Animes archive saved!");
});

console.timeEnd("update");
