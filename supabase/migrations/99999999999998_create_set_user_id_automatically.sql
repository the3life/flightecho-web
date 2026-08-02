/*create or replace function fe_v4.set_user_id_automatically()
    returns trigger
    language plpgsql
    security definer
as
$$
declare
    v_uid uuid;
begin
    if new.user_id is null then

        v_uid := auth.uid();

        if v_uid is null then
            raise exception 'auth.uid() is null';
        end if;

        new.user_id := v_uid;
    end if;

    return new;
end;
$$;

-- Triggerları otomatik oluştur
do
$$
    declare
        r record;
    begin
        for r in
            select table_name
            from information_schema.columns
            where table_schema = 'fe_v4'
              and column_name = 'user_id'
              and table_name <> 'users' -- bunu es geç
            loop
                -- Eski trigger varsa sil
                execute format(
                        'drop trigger IF EXISTS trg_auto_user_id on fe_v4.%I',
                        r.table_name
                        );

                -- Yeni trigger oluştur
                execute format(
                        'create trigger trg_auto_user_id
                         before insert on fe_v4.%I
                         for each row
                         execute function fe_v4.set_user_id_automatically()',
                        r.table_name
                        );

                raise notice 'Trigger created for table: %', r.table_name;
            end loop;
    end
$$;*/