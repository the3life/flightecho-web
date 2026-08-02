create or replace function fe_v4.update_translation_record(
    p_translation_record_id bigint,
    p_translations jsonb
)
    returns void
    language plpgsql
as
$$
declare
    v_entity_id bigint;
    v_field record;
    v_language record;
    v_translation_field_id bigint;
begin

    -- Translation Record'un entity'sini bul
    select entity_id
    into v_entity_id
    from fe_v4.translation_records
    where id = p_translation_record_id;

    if not found then
        raise exception 'Translation record "%" not found.',
            p_translation_record_id;
    end if;

    -- title,text,description...
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
                raise exception
                    'Translation field "%" not found.',
                    v_field.key;
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
                               p_translation_record_id,
                               v_translation_field_id,
                               v_language.key::fe_v4.languages,
                               v_language.value
                           )

                    on conflict (
                        translation_record_id,
                        translation_field_id,
                        language
                        )

                        do update
                        set value = excluded.value;

                end loop;

        end loop;

end;
$$;