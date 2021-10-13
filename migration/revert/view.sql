-- Revert anime:view from pg

BEGIN;

DROP VIEW animes, tags, bookmarks, one_tag, upcoming_tag, upcoming_tags;

COMMIT;
