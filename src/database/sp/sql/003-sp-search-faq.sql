-- DROP FUNCTION public.get_search_faq(searchQuestion character varying);
DROP FUNCTION IF EXISTS get_search_faq(searchQuestion character varying);
CREATE OR REPLACE FUNCTION public.get_search_faq(searchQuestion character varying) RETURNS TABLE(
    "topic" character varying,
    "shortDetails" character varying,
    "question" character varying,
    "fullDetails" character varying
  ) AS $BODY$
select topic,
  "shortDetails",
  "question",
  "fullDetails"
from "mmFaq"
WHERE question iLIKE '%' || searchquestion || '%'
GROUP BY topic,
  "shortDetails",
  "question",
  "fullDetails"
ORDER BY topic $BODY$ LANGUAGE sql VOLATILE;