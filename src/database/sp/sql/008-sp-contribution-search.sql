-- DROP FUNCTION public.get_search_contribution();
DROP FUNCTION IF EXISTS get_search_contribution(searchContribution character varying);
CREATE OR REPLACE FUNCTION public.get_search_contribution(searchContribution character varying) RETURNS TABLE(
    "id" integer,
    "uuid" uuid,
    "category" character varying,
    "subject" character varying,
    "details" character varying,
    "tags" json,
    "author" json,
    "userId" uuid,
    "version" character varying,
    "hypothesisStatus" character varying,
    "status" character varying,
    "updatedAt" timestamp,
    "createdAt" timestamp,
    "parentQuestionId" uuid,
    "postedBy" character varying,
      "userColorPoster" character varying
  ) AS $BODY$
select a."id",
  a."uuid",
  a."category",
  a."subject",
  a."details",
  a."tags",
  a."author",
  a."userId",
  a."version",
  a."hypothesisStatus",
  a."status",
  a."updatedAt",
  a."createdAt",
  b."parentQuestionUuid",
  CONCAT(c."firstName", ' ', c."lastName") AS "postedBy",
   c."userColor" AS "userColorPoster"
from "mmContribution" a 
  LEFT JOIN "mmContributionRelation" b ON b."contribChildId" = a."id"
  LEFT JOIN "mmUser" c ON a."userId" = c."id"
WHERE ("tags"::text ~* searchContribution
    OR a."author"::text ~* searchContribution
    OR a."createdAt"::text ~* searchContribution
    OR a."subject"::text ~* searchContribution
    OR a."details"::text ~* searchContribution
  ) AND
  ( a."status" = 'publish' )
ORDER BY "createdAt" ASC $BODY$ LANGUAGE sql VOLATILE;