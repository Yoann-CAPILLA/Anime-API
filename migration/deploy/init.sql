-- Deploy anime:init to pg

BEGIN;

CREATE TABLE "anime" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "mal_id" int UNIQUE,
  "title" text NOT NULL,
  "type" text NOT NULL,
  "status" text NOT NULL,
  "episodes" int NOT NULL,
  "year" int DEFAULT NULL,
  "season" text NOT NULL,
  "color" text DEFAULT '#0A0A0A' NOT NULL,
  "picture" text NOT NULL,
  "thumbnail" text NOT NULL,
  "synonyms" text[]
);

CREATE TABLE "tag" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "label" text UNIQUE NOT NULL,
  "main" boolean DEFAULT false
);

CREATE TABLE "user" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "username" text NOT NULL,
  "password" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "avatar_url" text,
  "gender" int NOT NULL DEFAULT 0
);

CREATE TABLE "broadcaster" (
  "id" int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" text UNIQUE
);

CREATE TABLE "anime_has_relation" (
    "anime_id" int NOT NULL REFERENCES "anime" ("id"),
    "anime_rel_id" int NOT NULL REFERENCES "anime" ("id"),
    PRIMARY KEY ("anime_id", "anime_rel_id")
);

CREATE TABLE "anime_has_tag" (
  "anime_id" int NOT NULL REFERENCES "anime" ("id"),
  "tag_id" int NOT NULL REFERENCES "tag" ("id"),
  PRIMARY KEY ("anime_id", "tag_id")
);

CREATE TABLE "user_has_anime" (
  "user_id" int NOT NULL REFERENCES "user" ("id"),
  "anime_id" int NOT NULL REFERENCES "anime" ("id"),
  "progression" int NOT NULL DEFAULT 0,
  "updated_at" timestamptz NOT NULL DEFAULT now(),
  "bc_id" int NOT NULL DEFAULT 1 REFERENCES "broadcaster" ("id"),
  PRIMARY KEY ("user_id", "anime_id")
);

INSERT INTO broadcaster (name) VALUES
    ('Other'),
    ('Wakanim'),
    ('CrunchyRoll'),
    ('ADN'),
    ('Netflix'),
    ('Prime');

COMMIT;
