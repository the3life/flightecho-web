create type fe_v4.languages as enum (
    'en',
    'tr',
    'th'
    );

/*create type fe_v4.translation_entity as enum (
    'news'
    );

create type fe_v4.translation_fields as enum (
    'news_title',
    'news_text'
    );*/

create type fe_v4.news_status as enum (
    'draft',
    'published',
    'archived'
    );

create type fe_v4.user_roles as enum (
    'member',
    'moderator',
    'admin'
    );