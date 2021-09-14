-- DROP FUNCTION public.get_faq();
DROP FUNCTION IF EXISTS get_faq();
CREATE OR REPLACE FUNCTION public.get_faq()
  RETURNS TABLE("topic" character varying, "shortDetails" character varying, "questions" JSONB[]) AS
$BODY$
  select
    topic,
    "shortDetails",
    array_agg(json_build_object('question', question,
                                'fullDetails', "fullDetails")) AS questions
  from "mmFaq"
    GROUP BY topic, "shortDetails"
    ORDER BY topic
$BODY$
  LANGUAGE sql VOLATILE;