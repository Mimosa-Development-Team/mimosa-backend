  DROP FUNCTION IF EXISTS sp_draft_contributions(uuid, orderBy character varying);
  CREATE OR REPLACE FUNCTION public.sp_draft_contributions(IN paramuserid uuid, orderBy character varying) RETURNS TABLE(
      "id" integer,
      "uuid" uuid,
      "category" character varying,
      "parentQuestionUuid" uuid,
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
      "userColor" character varying
    ) AS $BODY$
  SELECT a."id",
    a."uuid",
    a."category",
    a."parentQuestionUuid",
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
    CONCAT(b."firstName", ' ', b."lastName") AS "postedBy",
    b."userColor"
  FROM "mmContributionDraft" a
    LEFT JOIN "mmUser" b ON a."userId" = b."id"
  WHERE a."userId" = paramUserId
	ORDER BY CASE
      WHEN orderBy = 'ASC' THEN a."updatedAt"
    END ASC,
    CASE
      WHEN orderBy = 'DESC' THEN a."updatedAt"
    END DESC 
$BODY$ LANGUAGE sql VOLATILE;