-- Revert anime:init from pg

BEGIN;

DROP TABLE user_has_anime, anime_has_tag, anime_has_relation, broadcaster, "user", tag, anime;

COMMIT;
