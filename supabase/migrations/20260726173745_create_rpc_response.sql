create or replace function fe_v4.rpc_response(
    p_success boolean default true,
    p_message text default null,
    p_data jsonb default '{}'::jsonb,
    p_code text default null
)
    returns jsonb
    language sql
    immutable
as
$$
select jsonb_build_object(
               'success', p_success,
               'message', p_message,
               'code', p_code,
               'data', coalesce(p_data, '{}'::jsonb)
       );
$$;