-- Deploy anime:view to pg

BEGIN;

-- detail of an anime with associated tags and relations
CREATE VIEW animes AS (
    SELECT anime.id, anime.mal_id, anime.title, anime.type, anime.status, anime.episodes, anime.year, anime.season, anime.color, anime.picture, anime.thumbnail, anime.synonyms,
    array_to_json(array_remove(array_agg(DISTINCT tag_details), NULL)) AS tags,
    array_to_json(array_remove(array_agg(DISTINCT relation), NULL)) AS relations,
    array_to_json(array_remove(array_agg(DISTINCT previous_seasons), NULL)) AS previous_seasons,
    array_to_json(array_remove(array_agg(DISTINCT next_seasons), NULL)) AS next_seasons
    FROM anime
    LEFT JOIN anime_has_tag ON anime_has_tag.anime_id = anime.id
    LEFT JOIN (
        SELECT id, label, main FROM tag
    ) AS tag_details ON tag_details.id = anime_has_tag.tag_id
    LEFT JOIN anime_has_relation ON anime_has_relation.anime_id = anime.id
    LEFT JOIN (
        SELECT id, title, picture, year, type FROM anime
        WHERE type <> 'TV'
    ) AS relation ON relation.id = anime_has_relation.anime_rel_id	
    LEFT JOIN (
        SELECT id, title, picture, year, type FROM anime
        WHERE type = 'TV'
    ) AS previous_seasons ON previous_seasons.id = anime_has_relation.anime_rel_id AND previous_seasons.year < anime.year
    LEFT JOIN (
        SELECT id, title, picture, year, type FROM anime
        WHERE type = 'TV'
    ) AS next_seasons ON next_seasons.id = anime_has_relation.anime_rel_id AND next_seasons.year > anime.year
    GROUP BY anime.id
);

-- main tags with the 30 most recents animes associated
CREATE VIEW tags AS (
    SELECT tag.id, tag.label, array_to_json(array_remove((array_agg(tag_animes))[1:30], NULL)) AS animes
    FROM tag
    JOIN anime_has_tag ON tag_id = tag.id
    JOIN (
        SELECT id, title, type, picture, status, year
        FROM anime
        WHERE status <> 'UPCOMING'
        AND status <> 'UNKNOWN'
        AND type = 'TV'
        OR id IN (
            SELECT id FROM anime
            WHERE status = 'UNKNOWN'
            AND type = 'TV'
            AND year < extract( year FROM CURRENT_DATE )::int
        )
        ORDER BY year DESC NULLS LAST
    ) tag_animes ON anime_id = tag_animes.id
    WHERE tag.main = true
    GROUP BY tag.id
    ORDER BY tag.label ASC
);

-- detail of a tag with all animes associated but upcoming ones
CREATE VIEW one_tag AS (
    SELECT tag.id, tag.label, array_to_json(array_remove((array_agg(tag_animes)), NULL)) AS animes
    FROM tag
    JOIN anime_has_tag ON tag_id = tag.id
    JOIN (
        SELECT id, title, type, picture, status, year
        FROM anime
        WHERE status <> 'UPCOMING'
        AND status <> 'UNKNOWN'
        OR id IN (
            SELECT id FROM anime
            WHERE status = 'UNKNOWN'
            AND year < extract( year FROM CURRENT_DATE )::int
        )
        ORDER BY year DESC NULLS LAST
    ) tag_animes ON anime_id = tag_animes.id
    GROUP BY tag.id
);

-- main tags with up to 30 upcoming animes associated
CREATE VIEW upcoming_tags AS (
    SELECT tag.id, tag.label, array_to_json(array_remove((array_agg(tag_animes))[1:30], NULL)) AS animes
    FROM tag
    JOIN anime_has_tag ON tag_id = tag.id
    JOIN (
        SELECT id, title, type, picture, status, year
        FROM anime
        WHERE status <> 'FINISHED'
        AND status <> 'CURRENTLY'
        AND status <> 'UNKNOWN'
        OR id IN (
            SELECT id FROM anime
            WHERE status = 'UNKNOWN'
            AND year >= extract( year FROM CURRENT_DATE )::int
        )
        ORDER BY year DESC NULLS LAST
    ) tag_animes ON anime_id = tag_animes.id
    WHERE tag.main = true
    GROUP BY tag.id
    ORDER BY tag.label ASC
);

-- detail of a tag with all upcoming animes associated
CREATE VIEW upcoming_tag AS (
    SELECT tag.id, tag.label, array_to_json(array_remove((array_agg(tag_animes)), NULL)) AS animes
    FROM tag
    JOIN anime_has_tag ON tag_id = tag.id
    JOIN (
        SELECT id, title, type, picture, status, year
        FROM anime
        WHERE status <> 'FINISHED'
		AND status <> 'CURRENTLY'
        AND status <> 'UNKNOWN'
        OR id IN (
            SELECT id FROM anime
            WHERE status = 'UNKNOWN'
            AND year >= extract( year FROM CURRENT_DATE )::int
        )
        ORDER BY year DESC NULLS LAST
    ) tag_animes ON anime_id = tag_animes.id
    GROUP BY tag.id
);

-- detail of all favorites animes by user
CREATE VIEW bookmarks AS (
    SELECT "user".id, "user".username, "user".gender,
    json_agg(json_build_object('id', animes.id, 'mal_id', animes.mal_id, 'title', animes.title, 'type', animes.type, 'status', animes.status, 'episodes', animes.episodes, 'year', animes.year,'season', animes.season, 'color', animes.color, 'picture', animes.picture, 'thumbnail', animes.thumbnail, 'synonyms', animes.synonyms, 'tags', animes.tags, 'relations', animes.relations, 'previous_seasons', animes.previous_seasons, 'next_seasons', animes.next_seasons, 'progression', user_has_anime.progression, 'broadcaster', broadcaster.name, 'updated_at', user_has_anime.updated_at,
    'currently_watching', (CASE
    WHEN progression > 0 AND progression < episodes THEN true
    WHEN progression = episodes AND status = 'CURRENTLY' THEN true
    WHEN progression = episodes AND status = 'UNKNOWN' THEN true
    ELSE false
    END
    ))) as favorites
    FROM "user"
    LEFT JOIN user_has_anime ON user_has_anime.user_id = "user".id
    LEFT JOIN animes ON animes.id = user_has_anime.anime_id
    LEFT JOIN broadcaster ON user_has_anime.bc_id = broadcaster.id
    GROUP BY "user".id
);

COMMIT;
