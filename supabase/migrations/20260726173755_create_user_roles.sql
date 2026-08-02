/*create table fe_v4.user_roles
(
    id         bigint generated always as identity primary key,

    user_id    uuid        not null references fe_v4.users (id) on delete cascade,
    role       text        not null,
    created_at timestamptz not null default now()
);

create
    or replace function fe_v4.is_admin()
    returns boolean
    language sql
    stable
    security definer
    set search_path = fe_v4, auth
as
$$
select exists (select 1
               from fe_v4.user_roles
               where user_id = auth.uid()
                 and role = 'admin');
$$;

alter table fe_v4.user_roles
    enable row level security;

create policy "Authenticated Users Select"
    on fe_v4.user_roles
    for select
    using (fe_v4.is_authenticated());

create policy "Admin All"
    on fe_v4.user_roles
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());*/