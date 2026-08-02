create table fe_v4.codes
(
    id         bigint generated always as identity primary key,

    code       text        not null,
    action     text        not null,
    value      text        not null,
    is_active  boolean     not null default false,
    used_count bigint      not null default 0,
    max_use    bigint      not null default 1,
    expires_at timestamptz,
    created_at timestamptz not null default now()
);

alter table fe_v4.codes
    enable row level security;

create
    policy "Authenticated Users Select"
    on fe_v4.codes
    for select
    using (fe_v4.is_authenticated());

create policy "Admin All"
    on fe_v4.codes
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());