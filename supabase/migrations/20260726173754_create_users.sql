create table fe_v4.users
(
    id                uuid primary key references auth.users (id) on delete cascade,

    email             text             not null,
    display_name      text,
    role              fe_v4.user_roles not null default 'member',
    app_id            text             not null,
    app_version       text,
    region            text,
    machine_name      text,
    machine_user_name text,
    last_ping         timestamptz      not null default now(),
    created_at        timestamptz      not null default now()
);

-- Admin Function

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
               from fe_v4.users
               where id = auth.uid()
                 and role = 'admin');

$$;

-- RLS

alter table fe_v4.users
    enable row level security;

create policy "Authenticated Users Select"
    on fe_v4.users
    for select
    using (fe_v4.is_authenticated());

create policy "Owner Insert"
    on fe_v4.users
    for insert
    with check (fe_v4.is_owner(id));

create policy "Owner Update"
    on fe_v4.users
    for update
    using (fe_v4.is_owner(id))
    with check (fe_v4.is_owner(id));

-- Function

create or replace function fe_v4.handle_new_user()
    returns trigger
    language plpgsql
    security definer
as
$$
begin
    if new.is_anonymous then
        return new;
    end if;

    insert into fe_v4.users
    (id,
     email,
     role,
     display_name,
     app_id,
     app_version,
     region,
     machine_name,
     machine_user_name)
    values (new.id,
            new.email,
            (new.raw_user_meta_data ->> 'role')::fe_v4.user_roles,
            new.raw_user_meta_data ->> 'display_name',
            new.raw_user_meta_data ->> 'app_id',
            new.raw_user_meta_data ->> 'app_version',
            new.raw_user_meta_data ->> 'region',
            new.raw_user_meta_data ->> 'machine_name',
            new.raw_user_meta_data ->> 'machine_user_name');

    return new;

end;
$$;

create trigger fe_v4_on_auth_user_created
    after insert
    on auth.users
    for each row
execute function fe_v4.handle_new_user();