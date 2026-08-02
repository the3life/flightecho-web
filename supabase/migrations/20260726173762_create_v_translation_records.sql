create view fe_v4.v_translation_records as

select tr.id,
       jsonb_object_agg(
               tf.name,
               (select jsonb_object_agg(t.language::text, t.value)

                from fe_v4.translations t
                where t.translation_record_id = tr.id
                  and t.translation_field_id = tf.id)
       ) as translations

from fe_v4.translation_records tr

         join fe_v4.translation_fields tf
              on tf.entity_id = tr.entity_id

group by tr.id;

/*create or replace view fe_v4.v_translation_records as
select
    x.record_id as id,
    jsonb_object_agg(
            x.field,
            x.languages
    ) as translations
from (
         select
             record_id,
             field::text as field,
             jsonb_object_agg(
                     language::text,
                     value
             ) as languages
         from fe_v4.translations
         group by
             record_id,
             field
     ) x
group by x.record_id;*/