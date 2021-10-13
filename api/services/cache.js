const redis = require("redis");

const client = redis.createClient();

const PREFIX = "anime:";
const PEREMPTION = 60 * 60 * 24 * 7;

const { promisify } = require("util");
const asyncClient = {
  get: promisify(client.get).bind(client),
  del: promisify(client.del).bind(client),
  exists: promisify(client.exists).bind(client),
  setex: promisify(client.setex).bind(client),
};

const flushUser = async (req, res, next) => {
  await asyncClient.del(PREFIX + req.url + "/" + req.body.user_id);
  next();
};

const cache =
  (duration = PEREMPTION) =>
  async (req, res, next) => {
    let urlKey = PREFIX + req.url;

    if (req.url.includes("/bookmark")) {
      urlKey = urlKey + "/" + req.body.user_id;
    }

    if (await asyncClient.exists(urlKey)) {
      const cachedValue = await asyncClient.get(urlKey);
      const value = JSON.parse(cachedValue);

      res.json(value);
    } else {
      const originalResDotJson = res.json.bind(res);

      res.json = async (responseData) => {
        const jsonData = JSON.stringify(responseData);
        await asyncClient.setex(urlKey, duration, jsonData);
        originalResDotJson(responseData);
      };

      next();
    }
  };

module.exports = {
  flushUser,
  cache,
};
