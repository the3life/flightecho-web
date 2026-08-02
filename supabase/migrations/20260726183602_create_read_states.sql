create table if not exists fe_v4.read_states
(
    id         bigint generated always as identity primary key,

    user_id    uuid        not null default auth.uid() references fe_v4.users (id) on delete cascade,
    record_id  bigint      not null,
    table_name text        not null,
    created_at timestamptz not null default now(),

    constraint unique_read_states_table unique (user_id, record_id, table_name)
);

-- RLS

alter table fe_v4.read_states
    enable row level security;

create policy "Owner Select"
    on fe_v4.read_states
    for select
    using (fe_v4.is_owner(user_id));

create policy "Owner Insert"
    on fe_v4.read_states
    for insert
    with check (fe_v4.is_owner(user_id));

create policy "Admin All"
    on fe_v4.read_states
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());

-- Realtime

alter publication supabase_realtime add table fe_v4.read_states;