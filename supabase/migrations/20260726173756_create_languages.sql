/*create table fe_v4.languages
(
    id         bigint generated always as identity primary key,

    code       text        not null,
    created_at timestamptz not null default now()
);

alter table fe_v4.languages
    enable row level security;

create policy "Authenticated Users Select"
    on fe_v4.languages
    for select
    using (fe_v4.is_authenticated());

create policy "Admin All"
    on fe_v4.languages
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());*/