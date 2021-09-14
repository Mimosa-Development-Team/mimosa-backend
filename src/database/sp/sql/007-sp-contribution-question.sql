  DROP FUNCTION IF EXISTS sp_get_contribution_questions(orderBy character varying);
  CREATE OR REPLACE FUNCTION public.sp_get_contribution_questions(orderBy character varying) RETURNS TABLE(
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
      "postedBy" character varying,
      "userColor" character varying,
      "relatedMediaCount" integer,
      "commentCount" integer
    ) AS $BODY$
  SELECT a."id",
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
    CONCAT(c."firstName", ' ', c."lastName") AS "postedBy",
    c."userColor",
    (
      SELECT COUNT(id)
      FROM "mmRelatedMedia"
      WHERE "contributionId" = a."id"
    ) AS "relatedMediaCount",
    (
      SELECT COUNT(id)
      FROM "mmComment"
      WHERE "contributionId" = a."id"
    ) AS "commentCount"
  FROM "mmContribution" a
    LEFT JOIN "mmUser" c ON a."userId" = c."id"
  WHERE a."category" = 'question'
    AND a.status = 'publish'
  ORDER BY CASE
      WHEN orderBy = 'ASC' THEN a."updatedAt"
    END ASC,
    CASE
      WHEN orderBy = 'DESC' THEN a."updatedAt"
    END DESC $BODY$ LANGUAGE sql VOLATILE;