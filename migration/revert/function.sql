-- Revert anime:function from pg

BEGIN;

DROP FUNCTION new_user(json), update_user(json), new_bookmark(json), update_bookmark(json), suggestion(json, int);

COMMIT;
