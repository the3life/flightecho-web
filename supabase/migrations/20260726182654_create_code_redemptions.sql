create table fe_v4.code_redemptions
(
    id         bigint generated always as identity primary key,

    user_id    uuid        not null default auth.uid() references fe_v4.users (id) on delete cascade,
    code_id    bigint      not null references fe_v4.codes (id),
    code       text        not null,
    created_at timestamptz not null default now()
);

alter table fe_v4.code_redemptions
    enable row level security;

create policy "Authenticated Users Select"
    on fe_v4.code_redemptions
    for select
    using (fe_v4.is_authenticated());

create policy "Owner Insert"
    on fe_v4.code_redemptions
    for insert
    with check (fe_v4.is_owner(user_id));

create policy "Admin All"
    on fe_v4.code_redemptions
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());