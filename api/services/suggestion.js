const getFrequentTags = (array) => {
  const countOccurrences = (arr, val) =>
    arr.reduce((acc, cur) => (cur === val ? acc + 1 : acc), 0);
  const bookmarkTags = [];
  const tagMap = new Map();

  array.forEach((anime) => {
    anime.tags.forEach((tag) => {
      bookmarkTags.push(tag.label);
    });
  });

  const distinctTags = [...new Set(bookmarkTags)];

  distinctTags.forEach((tag) => {
    const nb = countOccurrences(bookmarkTags, tag);
    tagMap.set(tag, nb);
  });

  const sortedTagMap = new Map(
    [...tagMap.entries()].sort((a, b) => b[1] - a[1])
  );
  const FrequentTags = [...sortedTagMap];

  return {
    tag1: FrequentTags[0][0],
    tag2: FrequentTags[1] ? FrequentTags[1][0] : "",
    tag3: FrequentTags[2] ? FrequentTags[2][0] : "",
    tag4: FrequentTags[3] ? FrequentTags[3][0] : "",
    tag5: FrequentTags[4] ? FrequentTags[4][0] : "",
  };
};

module.exports = getFrequentTags;
