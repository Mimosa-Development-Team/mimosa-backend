DROP FUNCTION IF EXISTS sp_get_contribution_list(uuid);
CREATE OR REPLACE FUNCTION public.sp_get_contribution_list(IN contributionId uuid)
  RETURNS TABLE(
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
      "contribParentId" integer,
      "contribChildId" integer,
      "parentQuestionId" uuid,
      "postedBy" character varying,
      "userColorPoster" character varying,
      "relatedMediaCount" integer,
      "commentCount" integer) AS
$BODY$
  SELECT
   a."id",
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
   b."contribParentId", 
   b."contribChildId", 
   b."parentQuestionUuid",
   CONCAT(c."firstName", ' ', c."lastName") AS "postedBy",
   c."userColor" AS "userColorPoster",
   (SELECT COUNT(id) FROM "mmRelatedMedia" WHERE "contributionId" = b."contribChildId") AS "relatedMediaCount",
   (SELECT COUNT(id) FROM "mmComment" WHERE "contributionId" = b."contribChildId") AS "commentCount"
  FROM "mmContribution" a 
  LEFT JOIN "mmContributionRelation" b ON b."contribChildId" = a."id"
  LEFT JOIN "mmUser" c ON a."userId" = c."id"
  WHERE b."parentQuestionUuid" = contributionId
  ORDER BY b."contribParentId";
$BODY$
  LANGUAGE sql VOLATILE;