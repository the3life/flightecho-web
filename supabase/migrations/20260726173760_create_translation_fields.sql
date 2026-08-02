create table fe_v4.translation_fields
(
    id         bigint generated always as identity primary key,

    entity_id  bigint      not null references fe_v4.translation_entities (id) on delete cascade,
    name       text        not null,
    created_at timestamptz not null default now(),

    unique (entity_id, name)
);

-- RLS

alter table fe_v4.translation_fields
    enable row level security;

create policy "Authenticated Users Select"
    on fe_v4.translation_fields
    for select
    using (fe_v4.is_authenticated());

create policy "Admin All"
    on fe_v4.translation_fields
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());

-- Realtime

alter publication supabase_realtime add table fe_v4.translation_fields;