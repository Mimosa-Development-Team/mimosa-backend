-- DROP FUNCTION public.get_faq();
DROP FUNCTION IF EXISTS get_comments();
CREATE OR REPLACE FUNCTION public.get_comments()
  RETURNS TABLE(
	  id integer,
	  "comment" character varying,
	  "userId" uuid,
	  "userFullName" character varying,
      "contributionId" integer,
	  "createdAt" timestamp,
	  "updatedAt" timestamp) AS
$BODY$
  select
    a."id",
	a."comment",
	a."userId",
	CONCAT(b."firstName", ' ', b."lastName") AS "userFullName",
	a."contributionId",
	a."createdAt",
	a."updatedAt"
  from "mmComment" AS a
  INNER JOIN "mmUser" AS b ON a."userId" = b."id"
$BODY$
  LANGUAGE sql VOLATILE;