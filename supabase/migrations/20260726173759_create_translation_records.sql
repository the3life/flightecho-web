create table fe_v4.translation_records
(
    id         bigint generated always as identity primary key,

    entity_id  bigint      not null references fe_v4.translation_entities (id) on delete cascade,
    created_at timestamptz not null default now()
);

-- RLS

alter table fe_v4.translation_records
    enable row level security;

create policy "Authenticated Users Select"
    on fe_v4.translation_records
    for select
    using (fe_v4.is_authenticated());

create policy "Admin All"
    on fe_v4.translation_records
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());

-- Realtime

alter publication supabase_realtime add table fe_v4.translation_records;