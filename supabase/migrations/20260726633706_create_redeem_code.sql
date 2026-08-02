create or replace function fe_v4.redeem_code(p_code text)
    returns jsonb
    language plpgsql
    security definer
as
$$
declare
    v_code       fe_v4.codes%rowtype;
    v_used_count integer;
begin

    select *
    into v_code
    from fe_v4.codes
    where upper(code) = upper(trim(p_code))
        for update;

    if
        not found then
        return fe_v4.rpc_response(
                p_success := false,
                p_message := '',
                p_code := 'CODE_NOT_FOUND'
               );
    end if;

    if
        not v_code.is_active then
        return fe_v4.rpc_response(
                p_success := false,
                p_message := '',
                p_code := 'CODE_DISABLED'
               );
    end if;

    if
        v_code.expires_at is not null
            and v_code.expires_at < now() then

        return fe_v4.rpc_response(
                p_success := false,
                p_message := '',
                p_code := 'CODE_EXPIRED'
               );
    end if;

    /*
    -- Aynı kullanıcı daha önce kullandı mı?
    if exists (
        select 1
        from fe_v4_code_redemptions
        where code_id = v_code.id
          and user_id = auth.uid()
    ) then
        return fe_v4_rpc_response(
            p_success := false,
            p_message := '',
            p_code := 'CODE_ALREADY_USED'
        );
    end if;
    */

    select count(*)
    into v_used_count
    from fe_v4.code_redemptions
    where code_id = v_code.id;

    if
        v_code.max_use > 0
            and v_used_count >= v_code.max_use then

        return fe_v4.rpc_response(
                p_success := false,
                p_message := '',
                p_code := 'CODE_LIMIT_REACHED'
               );
    end if;

    insert into fe_v4.code_redemptions (code_id,
                                        code)
    values (v_code.id,
            v_code.code);

    return fe_v4.rpc_response(
            p_success := true,
            p_message := '',
            p_code := 'SUCCESS',
            p_data := to_jsonb(v_code)
           );

end;
$$;