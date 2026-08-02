create
    or replace function fe_v4.is_authenticated()
    returns boolean
    language sql
    stable
    security invoker
as
$$

select auth.uid() is not null;

$$;

create
    or replace function fe_v4.is_owner(p_user_id uuid)
    returns boolean
    language sql
    stable
as
$$

select p_user_id = auth.uid();

$$;