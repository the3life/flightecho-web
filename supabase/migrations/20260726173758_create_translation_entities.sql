create table fe_v4.translation_entities
(
    id         bigint generated always as identity primary key,

    name       text        not null,
    created_at timestamptz not null default now(),

    unique (name)
);

alter table fe_v4.translation_entities
    enable row level security;

create policy "Authenticated Users Select"
    on fe_v4.translation_entities
    for select
    using (fe_v4.is_authenticated());

create policy "Admin All"
    on fe_v4.translation_entities
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());

alter publication supabase_realtime add table fe_v4.translation_entities;