-- Deploy anime:function to pg

BEGIN;

CREATE FUNCTION new_user(json) RETURNS "user" AS $$
	INSERT INTO "user" (username, password, email, avatar_url, gender)
	VALUES (
		$1->>'username',
		$1->>'password',
		($1->>'email')::email,
		$1->>'avatar_url',
		($1->> 'gender')::int
	)
	RETURNING *;
$$ LANGUAGE sql;

CREATE FUNCTION update_user(json) RETURNS "user" AS $$
	UPDATE "user" SET 
		username = $1->>'username', 
		password = $1->>'password', 
		email = ($1->>'email')::email, 
		avatar_url = $1->>'avatar_url', 
		gender = ($1->>'gender')::int
	WHERE id = ($1->>'id')::int
	RETURNING *;
$$ LANGUAGE sql;

CREATE FUNCTION new_bookmark(json) RETURNS user_has_anime AS $$
	INSERT INTO user_has_anime (user_id, anime_id, progression, bc_id)
	VALUES (
		($1->>'user_id')::int,
		($1->>'anime_id')::int,
		($1->>'progression')::int,
		($1->>'bc_id')::int
	)
	RETURNING *;
$$ LANGUAGE sql;

CREATE FUNCTION update_bookmark(json) RETURNS user_has_anime AS $$
	UPDATE user_has_anime SET  
		progression = ($1->>'progression')::int, 
		bc_id = ($1->>'bc_id')::int
	WHERE user_id = ($1->>'user_id')::int
	AND anime_id = ($1->>'anime_id')::int
	RETURNING *;
$$ LANGUAGE sql;

CREATE FUNCTION suggestion(json, int) RETURNS TABLE (id int, mal_id int, title text, picture text, year int, type text) AS $$
	SELECT id, mal_id, title, picture, year, type
	FROM anime
	WHERE id IN (
		SELECT anime_id
		FROM anime_has_tag
		JOIN tag on tag.id = anime_has_tag.tag_id
		WHERE tag.label IN ($1->>'tag1', $1->>'tag2', $1->>'tag3', $1->>'tag4', $1->>'tag5')
		GROUP BY anime_id
		HAVING COUNT(DISTINCT tag.label) >= $2
	) AND type = 'TV'
	ORDER BY RANDOM ()
	LIMIT 30;
$$ LANGUAGE sql;

COMMIT;
