create or replace function fe_v4.create_translation_record(
    p_entity_name text,
    p_translations jsonb
)
    returns bigint
    language plpgsql
as
$$
declare
    v_entity_id integer;
    v_record_id bigint;
    v_field record;
    v_language record;
    v_translation_field_id bigint;
begin

    -- entity
    select id
    into v_entity_id
    from fe_v4.translation_entities
    where name = p_entity_name;

    if not found then
        raise exception 'Translation entity "%" not found.', p_entity_name;
    end if;

    -- record
    insert into fe_v4.translation_records(entity_id)
    values (v_entity_id)
    returning id into v_record_id;

    -- title, text, description...
    for v_field in
        select *
        from jsonb_each(p_translations)
        loop

            select id
            into v_translation_field_id
            from fe_v4.translation_fields
            where entity_id = v_entity_id
              and name = v_field.key;

            if not found then
                raise exception 'Translation field "%" not found for entity "%".',
                    v_field.key,
                    p_entity_name;
            end if;

            -- tr,en,th...
            for v_language in
                select *
                from jsonb_each_text(v_field.value)
                loop

                    insert into fe_v4.translations(
                        translation_record_id,
                        translation_field_id,
                        language,
                        value
                    )
                    values (
                               v_record_id,
                               v_translation_field_id,
                               v_language.key::fe_v4.languages,
                               v_language.value
                           );

                end loop;

        end loop;

    return v_record_id;

end;
$$;