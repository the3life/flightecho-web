create table fe_v4.news
(
    id                    bigint generated always as identity primary key,

    translation_record_id bigint            not null unique references fe_v4.translation_records (id) on delete cascade,

    status                fe_v4.news_status not null default 'draft',
    created_at            timestamptz       not null default now()
);

-- RLS

alter table fe_v4.news
    enable row level security;

/*create policy "Authenticated Users Select"
    on fe_v4.news
    for select
    using (fe_v4.is_authenticated());*/

create policy "Admin All"
    on fe_v4.news
    for all
    using (fe_v4.is_admin())
    with check (fe_v4.is_admin());

-- Realtime

alter publication supabase_realtime add table fe_v4.news;

-- View

create or replace view fe_v4.v_news as

select t.*,
       tr.translations

from fe_v4.news t
         join fe_v4.v_translation_records tr
              on tr.id = t.translation_record_id
where fe_v4.is_admin() or status = 'published'
order by t.id desc;