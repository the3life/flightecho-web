create schema fe_v4;

grant usage on schema fe_v4 to anon, authenticated, service_role;

grant select, insert, update, delete
    on all tables in schema fe_v4
    to anon, authenticated, service_role;

alter default privileges in schema fe_v4
    grant select, insert, update, delete
    on tables
    to anon, authenticated, service_role;