-- Deploy anime:domain to pg

BEGIN;

CREATE DOMAIN color AS text CHECK (value ~ '^#(?:[0-9a-fA-F]{3}){1,2}$');

CREATE EXTENSION citext;
CREATE DOMAIN email AS citext
  CHECK ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );

ALTER TABLE "user" 
ALTER COLUMN email TYPE email
USING email::email;

ALTER TABLE "anime" 
ALTER COLUMN color TYPE color
USING color::color;

COMMIT;
