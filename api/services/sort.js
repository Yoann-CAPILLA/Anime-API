const sortRelations = async (array) => {
  array.forEach((element) => {
    element.relations.sort((a, b) => a.year - b.year),
      element.previous_seasons.sort((a, b) => a.year - b.year),
      element.next_seasons.sort((a, b) => a.year - b.year);
  });
};

const sortAnimes = async (array) => {
  array.forEach((element) => {
    element.animes.sort((a, b) => b.year - a.year);
  });
};

const sortRandom = async (array) => {
  array.forEach((element) => {
    element.animes.sort(() => Math.random() - 0.5);
  });
};

const sortBookmarksRelations = async (array) => {
  array.favorites.forEach((element) => {
    element.relations?.sort((a, b) => a.year - b.year),
      element.previous_seasons?.sort((a, b) => a.year - b.year),
      element.next_seasons?.sort((a, b) => a.year - b.year);
  });
};

module.exports = {
  sortRelations,
  sortAnimes,
  sortRandom,
  sortBookmarksRelations,
};
