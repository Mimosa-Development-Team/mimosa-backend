DROP FUNCTION IF EXISTS get_user_contribution_ctr(uuid);
CREATE OR REPLACE FUNCTION public.get_user_contribution_ctr(IN paramuserid uuid)
  RETURNS TABLE(
    id uuid,
    "fullName" character varying,
    "questionCtr" integer,
    "hypothesisCtr" integer,
    "experimentCtr" integer,
    "dataCtr" integer,
    "analysisCtr" integer,
	  "totalContributions" integer
) AS
$BODY$
  select
    a."id",
    CONCAT(a."firstName", ' ', a."lastName") AS "fullName",
    (SELECT COUNT(id) FROM "mmContribution" WHERE "userId"=paramUserId AND "category"='question') AS questionCtr,
    (SELECT COUNT(id) FROM "mmContribution" WHERE "userId"=paramUserId AND "category"='hypothesis') AS hypothesisCtr,
    (SELECT COUNT(id) FROM "mmContribution" WHERE "userId"=paramUserId AND "category"='experiment') AS experimentCtr,
    (SELECT COUNT(id) FROM "mmContribution" WHERE "userId"=paramUserId AND "category"='data') AS dataCtr,
    (SELECT COUNT(id) FROM "mmContribution" WHERE "userId"=paramUserId AND "category"='analysis') AS analysisCtr,
    (SELECT COUNT(id) FROM "mmContribution" WHERE "userId"=paramUserId) AS totalContributions
  from "mmUser" a
  INNER JOIN "mmContribution" b ON a."id" = b."userId"
    where a."id" = paramUserId
  GROUP BY a."id"
$BODY$
  LANGUAGE sql VOLATILE;