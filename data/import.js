require("dotenv").config();
const db = require("../api/database");
const fs = require("fs");
const newAnimes = require("./new-animes.json");
const modifiedAnimes = require("./modified-animes.json");
const existingTags = require("./tags-archive.json");

const animeJson = [...newAnimes, ...modifiedAnimes];

// An array of the main tags which will be used as categories on the website
const mainTags = [
  "action",
  "adventure",
  "comedy",
  "cooking",
  "cyberpunk",
  "dark fantasy",
  "ecchi",
  "fantasy",
  "horror",
  "isekai",
  "magic",
  "martial arts",
  "mecha",
  "military",
  "musical",
  "mystery",
  "romance",
  "rpg",
  "samurai",
  "school",
  "sci-fi",
  "seinen",
  "shoujo",
  "shoujo-ai",
  "shounen",
  "shounen-ai",
  "slice of life",
  "space",
  "sport",
  "superpower",
  "survival",
  "thriller",
  "tragedy",
  "vampire",
  "video games",
  "virtual reality",
];

// The json database file contains some adult content. This array will help us to remove these animes from the postgresql database.
const forbiddenTags = [
  "anal sex",
  "bdsm",
  "bondage",
  "boobjob",
  "cunnilingus",
  "erotic torture",
  "exhibitionism",
  "facial",
  "feet",
  "fellatio",
  "hentai",
  "incest",
  "lactation",
  "tentacle",
  "tentacles",
  "smut",
  "sexual abuse -- to be split and deleted",
  "sex",
  "prostitution",
  "pov",
  "mechanical tentacle",
  "masturbation",
  "shota",
];

// There are some mispelled tags in the JSON database. This array will help us to fix it.
const tagsToModify = [
  ["comedy,", "comedy"],
  ["all girls school", "all-girls school"],
  ["androids", "android"],
  ["angels", "angel"],
  ["assassins", "assassin"],
  ["butlers", "butler"],
  ["demons", "demon"],
  ["detectives", "detective"],
  ["dragons", "dragon"],
  ["dystopian", "dystopia"],
  ["elves", "elf"],
  ["ghosts", "ghost"],
  ["idols", "idol"],
  ["kaijuu", "kaiju"],
  ["military,", "military"],
  ["millitary", "military"],
  ["sci fi", "sci-fi"],
  ["school clubs", "school club"],
  ["ships", "ship"],
  ["shoujo ai", "shoujo-ai"],
  ["shounen ai", "shounen-ai"],
  ["skeletons", "skeleton"],
  ["sports", "sport"],
  ["super power", "superpower"],
  ["superpowers", "superpower"],
  ["superheroes", "superhero"],
  ["super natural", "supernatural"],
  ["vampires", "vampire"],
  ["werewolves", "werewolf"],
  ["witches", "witch"],
  ["world war ii", "world war 2"],
  ["zombies", "zombie"],
  ["power suits", "power suit"],
  ["post apocalypse", "post-apocalyptic"],
  ["politics", "political"],
  ["pirates", "pirate"],
  ["nurses", "nurse"],
  ["monster girls", "monster girl"],
  ["mermaids", "mermaid"],
  ["maids", "maid"],
  ["mistery", "mystery"],
  ["4-koma manga", "4-koma"],
  ["4-koma manhwa", "4-koma"],
  ["aciton", "action"],
  ["aliens", "alien"],
  ["autobiographies", "autobiographical"],
  ["bakumatsu - meiji period", "bakumatsu meiji period"],
  ["anthropomorphic", "anthropomorphism"],
  ["biographies", "biographical"],
  ["bounty hunters", "bounty hunter"],
  ["card battles", "card battle"],
  ["centaurs", "centaur"],
  ["cross dressing", "crossdressing"],
  ["cyborgs", "cyborg"],
  ["delinquents", "delinquent"],
  ["lgbtq+ themes", "lgbt themes"],
  ["work life", "working life"],
  ["medicine", "medical"],
  ["western comics", "western"],
  ["western animated cartoon", "western"],
  ["middle eastern", "middle east"],
  ["video game industry", "video games"],
  ["trapped in a video game", "video games"],
  ["thieves", "thievery"],
  ["robots", "robot"],
  ["teaching", "teacher"],
  ["science fiction", "sci-fi"],
  ["stop motion animation", "stop motion"],
];

// These arrays contain tags which will help us to define the anime color on the website.
const actionTags = [
  "action",
  "adventure",
  "martial arts",
  "superpower",
  "sport",
  "shonen",
  "samurai",
  "military",
];
const kawaiTags = [
  "comedy",
  "ecchi",
  "slice of life",
  "cooking",
  "romance",
  "musical",
  "shoujo",
  "shoujo-ai",
  "shounen-ai",
  "school",
];
const futurTags = [
  "cyberpunk",
  "sci-fi",
  "video games",
  "mecha",
  "virtual reality",
  "space",
];
const darkTags = [
  "dark fantasy",
  "horror",
  "vampire",
  "survival",
  "tragedy",
  "thriller",
];
const fantasyTags = ["fantasy", "isekai", "magic", "mystery", "rpg"];

// this object assign hexadecimal colors to the main categories of tags defined previously
const animeColors = {
  action: "#4F4B78",
  kawai: "#F0A5A0",
  futur: "#AA4949",
  dark: "#4C3C59",
  fantasy: "#49684E",
};

// Getting all unique tags sorted by name
const tagArray = [];

animeJson.forEach((anime) =>
  anime.tags.forEach((tag, index) => {
    // This loop fix the mispelled tags with the correct ones.
    for (const arr of tagsToModify) {
      if (arr[0] === tag) {
        tag = arr[1];
        anime.tags.splice(index, 1, arr[1]);
      }
    }

    if (!existingTags.includes(tag) && !forbiddenTags.includes(tag)) {
      tagArray.push(tag);
    }
  })
);

const newTags = [...new Set(tagArray)].sort();

const jsonTags = JSON.stringify(newTags);

fs.writeFile("./data/new-tags.json", jsonTags, "utf8", (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("New tags saved!");
});

const allTags = [...existingTags, ...newTags].sort();

const archiveTags = JSON.stringify(allTags);

fs.writeFile("./data/tags-archive.json", archiveTags, "utf8", (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Tags archive saved!");
});

const animes = [];

for (const anime of animeJson) {
  // Prevent insertion of animes with at least a forbidden tag
  const forbiddenTag = anime.tags.some((tag) => forbiddenTags.includes(tag));

  if (forbiddenTag) {
    continue; // skip the anime insertion due to adult content
  }

  // Getting the myanymelist Id from an array of sources URLs
  const sourcesUrl = anime.sources.find((url) =>
    url.includes("myanimelist.net")
  );
  const sourcesId = sourcesUrl.substring(30);

  // Getting all the myanymelist Ids from an array of relations URLs
  const relationsUrl = anime.relations.filter((url) =>
    url.includes("myanimelist.net")
  );
  const relationsId = relationsUrl.map((elem) => elem.substring(30));

  // Using a set to prevent from duplicate entries
  const animeTags = [...new Set(anime.tags)];

  // Formatting datas for DB insertion
  animes.push({
    title: anime.title,
    type: anime.type,
    status: anime.status,
    episodes: anime.episodes,
    year: anime.animeSeason.year,
    season: anime.animeSeason.season,
    picture: anime.picture,
    thumbnail: anime.thumbnail,
    synonyms: anime.synonyms,
    malId: sourcesId,
    tags: animeTags,
    relations: relationsId,
    new: anime.new,
  });
}

// IIFE (Immediately Invoked Function Expression) to populate DB
(async () => {
  console.time("import");
  console.log("Starting import.");

  // Populate tags
  console.log("Starting tag insertion");
  console.time("tag_insertion");
  for (const tag of newTags) {
    if (mainTags.includes(tag)) {
      await db.query("INSERT INTO tag (label, main) VALUES ($1, $2);", [
        tag,
        true,
      ]);
    } else {
      await db.query("INSERT INTO tag (label) VALUES ($1);", [tag]);
    }
  }
  console.timeEnd("tag_insertion");
  console.log("Starting animes insertion");
  console.time("anime_insertion");
  //Populate animes
  for (const anime of animes) {
    // Mapping of categories to find the most tags occurrences
    const tagMap = new Map();
    tagMap.set("action", 0);
    tagMap.set("kawai", 0);
    tagMap.set("futur", 0);
    tagMap.set("dark", 0);
    tagMap.set("fantasy", 0);

    // Assign color regarding the most occurency of main tags.
    for (const tag of anime.tags) {
      // Init a variable, then count the occurencies of every main tags collection in the current anime tags list.
      let tagValue;

      if (actionTags.includes(tag)) {
        tagValue = parseInt(tagMap.get("action"));
        tagValue++;
        tagMap.set("action", tagValue);
      } else if (kawaiTags.includes(tag)) {
        tagValue = parseInt(tagMap.get("kawai"));
        tagValue++;
        tagMap.set("kawai", tagValue);
      } else if (futurTags.includes(tag)) {
        tagValue = parseInt(tagMap.get("futur"));
        tagValue++;
        tagMap.set("futur", tagValue);
      } else if (darkTags.includes(tag)) {
        tagValue = parseInt(tagMap.get("dark"));
        tagValue++;
        tagMap.set("dark", tagValue);
      } else if (fantasyTags.includes(tag)) {
        tagValue = parseInt(tagMap.get("fantasy"));
        tagValue++;
        tagMap.set("fantasy", tagValue);
      }
    }

    // Sort the mapping of tags by highest value
    const sortedTagMap = new Map(
      [...tagMap.entries()].sort((a, b) => b[1] - a[1])
    );

    const mainCategories = [...sortedTagMap];

    // Define the correct color for the main category
    if (mainCategories[0][1] > 0) {
      anime.color = animeColors[mainCategories[0][0]];
    } else {
      anime.color = "#0A0A0A";
    }

    if (anime.new === true) {
      // Insertion of anime with all formatted datas
      await db.query(
        "INSERT INTO anime (mal_id, title, type, status, episodes, year, season, color, picture, thumbnail, synonyms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);",
        [
          anime.malId,
          anime.title,
          anime.type,
          anime.status,
          anime.episodes,
          anime.year,
          anime.season,
          anime.color,
          anime.picture,
          anime.thumbnail,
          anime.synonyms,
        ]
      );
    } else if (anime.new === false) {
      // DB querying to get the correct anime Id
      const { rows } = await db.query(
        "SELECT id FROM anime WHERE mal_id = $1 ;",
        [anime.malId]
      );

      const animeId = rows[0].id;

      await db.query(
        "UPDATE anime SET title = $1, status = $2, episodes = $3, color = $4, picture = $5, thumbnail = $6, season = $7, year = $8, synonyms = $9 WHERE id = $10;",
        [
          anime.title,
          anime.status,
          anime.episodes,
          anime.color,
          anime.picture,
          anime.thumbnail,
          anime.season,
          anime.year,
          anime.synonyms,
          animeId,
        ]
      );
    }
  }

  console.timeEnd("anime_insertion");

  console.log(
    "Starting association insertion of tags and relations on animes."
  );
  console.time("association_insertion");

  //Add tags and relations on animes
  for (const anime of animes) {
    // DB querying to get the correct anime Id
    const { rows } = await db.query("SELECT id FROM anime WHERE mal_id = $1;", [
      anime.malId,
    ]);

    const animeId = rows[0].id;

    // Loop on tags, querying the DB to get the correct tag ID then insert the association of anime ID and tag ID into the DB.
    for (const tag of anime.tags) {
      const { rows } = await db.query("SELECT id FROM tag WHERE label = $1;", [
        tag,
      ]);
      const tagId = rows[0].id;

      if (anime.new === true) {
        await db.query(
          "INSERT INTO anime_has_tag (anime_id, tag_id) VALUES ($1, $2);",
          [animeId, tagId]
        );
      } else if (anime.new === false) {
        await db.query(
          `INSERT INTO anime_has_tag (anime_id, tag_id)
                                    SELECT $1, $2 
                                WHERE NOT EXISTS (
                                    SELECT * FROM anime_has_tag WHERE anime_id = $1 AND tag_id = $2
                                );`,
          [animeId, tagId]
        );
      }
    }

    // Creation of relation between multiples animes in DB
    for (const malId of anime.relations) {
      const { rows } = await db.query(
        "SELECT id FROM anime WHERE mal_id = $1;",
        [malId]
      );
      const relId = rows[0]?.id;

      if (!relId) {
        continue;
      }

      if (anime.new === true) {
        await db.query(
          "INSERT INTO anime_has_relation (anime_id, anime_rel_id) VALUES ($1, $2);",
          [animeId, relId]
        );
      } else if (anime.new === false) {
        await db.query(
          `INSERT INTO anime_has_relation (anime_id, anime_rel_id)
                                    SELECT $1, $2 
                                WHERE NOT EXISTS (
                                    SELECT * FROM anime_has_relation WHERE anime_id = $1 AND anime_rel_id = $2
                                );`,
          [animeId, relId]
        );
      }
    }
  }
  console.timeEnd("association_insertion");

  console.timeEnd("import");
})();
