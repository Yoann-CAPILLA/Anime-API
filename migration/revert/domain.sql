-- Revert anime:domain from pg

BEGIN;

ALTER TABLE "user" 
ALTER COLUMN email TYPE text
USING email::text;

ALTER TABLE "anime" 
ALTER COLUMN color TYPE text
USING color::text;

DROP DOMAIN color;
DROP DOMAIN email;
DROP EXTENSION citext;

COMMIT;
