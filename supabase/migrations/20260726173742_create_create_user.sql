create or replace function fe_v4.create_user(p_email text, p_password text, p_app_id text, p_app_version text,
                                             p_region text, p_display_name text, p_machine_name text,
                                             p_machine_user_name text, p_role fe_v4.user_roles default 'member',
                                             p_email_verified boolean default true,
                                             p_phone_verified boolean default false)
    returns void
    language plpgsql
    security definer
as
$$
declare
    new_user_id  uuid  := gen_random_uuid();
    encrypted_pw text  := extensions.crypt(p_password, extensions.gen_salt('bf', 10));
    raw_user_meta_data
                 jsonb := jsonb_build_object(
            'sub', new_user_id,
            'email', p_email,
            'role', p_role,
            'app_id', p_app_id,
            'app_version', p_app_version,
            'region', p_region,
            'display_name', p_display_name,
            'machine_name', p_machine_name,
            'machine_user_name', p_machine_user_name,
            'email_verified', p_email_verified,
            'phone_verified', p_phone_verified);
begin

    insert into auth.users (instance_id,
                            id,
                            aud,
                            role,
                            email,
                            encrypted_password,
                            email_confirmed_at,
                            last_sign_in_at,
                            raw_app_meta_data,
                            raw_user_meta_data,
                            created_at,
                            updated_at,
                            confirmation_token,
                            recovery_token,
                            email_change_token_new,
                            email_change)
    values ('00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            p_email,
            encrypted_pw,
            NOW(), -- Confirms email immediately
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            raw_user_meta_data,
            NOW(),
            NOW(),
            '',
            '',
            '',
            '');

    insert into auth.identities (provider_id,
                                 user_id,
                                 identity_data,
                                 provider,
                                 last_sign_in_at,
                                 created_at,
                                 updated_at)
    values (new_user_id,
            new_user_id,
            raw_user_meta_data,
            'email',
            NOW(),
            NOW(),
            NOW());

end;
$$;