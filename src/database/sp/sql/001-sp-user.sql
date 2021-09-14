-- DROP FUNCTION public.sp_get_user_profile(uuid);
DROP FUNCTION IF EXISTS sp_get_user_profile(uuid);
CREATE OR REPLACE FUNCTION public.sp_get_user_profile(IN paramuserid uuid)
  RETURNS TABLE(id uuid, "firstName" character varying, "lastName" character varying, "orcidId" character varying) AS
$BODY$
  select
	  a."id",
	  a."firstName",
	  a."lastName",
	  a."orcidId"
  from "mmUser" a
    where a.id = paramUserId;
$BODY$
  LANGUAGE sql VOLATILE;