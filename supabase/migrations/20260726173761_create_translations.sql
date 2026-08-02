create table fe_v4.translations
(
    id                 bigint generated always as identity primary key,

    translation_record_id bigint          not null references fe_v4.translation_records (id) on delete cascade,
    translation_field_id  bigint          not null references fe_v4.translation_fields (id) on delete cascade,

    /*record_id bigint          not null references fe_v4.translation_records (id) on delete cascade,

    entity fe_v4.translation_entity not null,
    field  fe_v4.translation_field  not null,*/
    language           fe_v4.languages          not null,
    value              text                     not null,
    created_at         timestamptz              not null default now(),

    unique (translation_record_id, translation_field_id, language)
);

-- RLS

alter table fe_v4.translations
    enable row level security;

create policy "Authenticated Users Select"
    on fe_v4.translations
    for select
    using (fe_v4.is_authenticated());

create policy "Admin All"
    on fe_v4.translations
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());

-- Realtime

alter publication supabase_realtime add table fe_v4.translations;