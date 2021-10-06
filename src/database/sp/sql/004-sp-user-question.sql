DROP FUNCTION IF EXISTS sp_get_user_question(uuid, orderBy character varying);
CREATE OR REPLACE FUNCTION public.sp_get_user_question(IN paramuserid uuid, orderBy character varying)
  RETURNS TABLE(
	  id integer,
	  "uuid" uuid,
	  "category" character varying,
	  "subject" character varying,
	  "tags" json,
	  "author" json,
	  "userId" uuid,
	  "status" character varying, 
	  "createdAt" timestamp,
	  "updatedAt" timestamp,
	  "parentTitle" character varying,
    "parentQuestionUuid" uuid,
    "relatedMediaCount" integer,
    "commentCount" integer,
    "postedBy" character varying,
    "userColor" character varying
) AS
$BODY$
  select
    a."id",
    a."uuid",
    a."category",
    a."subject",
    a."tags",
    a."author",
    a."userId",
    a."status",
    a."createdAt",
    a."updatedAt",
    (SELECT "subject" FROM "mmContribution" WHERE "id" = b."contribParentId") AS "parentTitle",
    b."parentQuestionUuid",
    (SELECT COUNT(id) FROM "mmRelatedMedia" WHERE "contributionId" = b."contribChildId") AS "relatedMediaCount",
    (SELECT COUNT(id) FROM "mmComment" WHERE "contributionId" = b."contribChildId") AS "commentCount",
    CONCAT(c."firstName", ' ', c."lastName") AS "postedBy",
    c."userColor"
  from "mmContribution" a
  LEFT JOIN "mmContributionRelation" b ON b."contribChildId" = a."id"
    LEFT JOIN "mmUser" c ON a."userId" = c."id"
    where a."userId" = paramUserId
	ORDER BY CASE
      WHEN orderBy = 'ASC' THEN a."updatedAt"
    END ASC,
    CASE
      WHEN orderBy = 'DESC' THEN a."updatedAt"
    END DESC 
$BODY$
  LANGUAGE sql VOLATILE;