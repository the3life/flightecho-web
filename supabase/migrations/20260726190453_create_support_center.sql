create table fe_v4.support_center
(
    id         bigint generated always as identity primary key,

    user_id    uuid        not null default auth.uid() references fe_v4.users (id) on delete cascade,
    text       text,
    created_at timestamptz not null default now()
);

alter table fe_v4.support_center
    enable row level security;

create policy "Authenticated Users Select"
    on fe_v4.support_center
    for select
    using (fe_v4.is_authenticated());

create policy "Owner Insert"
    on fe_v4.support_center
    for insert
    with check (fe_v4.is_owner(user_id));

create policy "Owner Update"
    on fe_v4.support_center
    for update
    using (fe_v4.is_owner(user_id))
    with check (fe_v4.is_owner(user_id));

create policy "Admin All"
    on fe_v4.support_center
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());

alter publication supabase_realtime add table fe_v4.support_center;