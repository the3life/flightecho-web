create table fe_v4.apps
(
    id                      bigint generated always as identity primary key,

    app_id                  text        not null,
    min_version             text        not null,
    max_version             text        not null,
    latest_version          text        not null,
    force_update            boolean     not null default false,
    maintenance             boolean     not null default false,
    web_url                 text        not null,
    created_at              timestamptz not null default now()
);

alter table fe_v4.apps
    enable row level security;

create policy "Public Select"
    on fe_v4.apps
    for select
    using (true);

create policy "Admin All"
    on fe_v4.apps
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());