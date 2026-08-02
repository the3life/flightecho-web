select fe_v4.create_user('the3life@gmail.com', '123456', 'FlightEcho-Development', '1.0.0', 'Turkey', 'Onur', 'ONUR-PC',
                         'Onur', 'admin');
select fe_v4.create_user('user1@test.com', '123456', 'FlightEcho-Development', '1.0.0', 'Turkey', 'User 1', 'TEST-PC',
                         'User 1');
select fe_v4.create_user('user2@test.com', '123456', 'FlightEcho-Development', '1.0.0', 'Turkey', 'User 2', 'TEST-PC',
                         'User 2');

-- Apps

insert into fe_v4.apps (app_id,
                        min_version,
                        max_version,
                        latest_version,
                        force_update,
                        maintenance,
                        web_url)
values ('FlightEcho',
        '1.0.0',
        '10.0.0',
        '2.0.0',
        true,
        false,
        'https://the3life.github.io/flightecho-web');

insert into fe_v4.apps (app_id,
                        min_version,
                        max_version,
                        latest_version,
                        force_update,
                        maintenance,
                        web_url)
values ('FlightEcho-Development',
        '1.0.0',
        '10.0.0',
        '2.0.0',
        true,
        false,
        'https://the3life.github.io/FlightEcho-Development');

insert into fe_v4.apps (app_id,
                        min_version,
                        max_version,
                        latest_version,
                        force_update,
                        maintenance,
                        web_url)
values ('FlightEcho-ExclusiveAccess',
        '1.0.0',
        '10.0.0',
        '2.0.0',
        true,
        false,
        'https://the3life.github.io/FlightEcho-ExclusiveAccess');

-- News

insert into fe_v4.translation_entities (name)
values ('news');

insert into fe_v4.translation_entities (name)
values ('test');

insert into fe_v4.translation_fields(entity_id, name)
values (1, 'title');

insert into fe_v4.translation_fields(entity_id, name)
values (1, 'text');

insert into fe_v4.translation_fields(entity_id, name)
values (2, 'content');

insert into fe_v4.translation_records(entity_id)
values (1);

insert into fe_v4.translation_records(entity_id)
values (1);

insert into fe_v4.translation_records(entity_id)
values (1);

insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (1, 1, 'en', 'Test Title 1');
insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (2, 1, 'en', 'Test Title 2');
insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (3, 1, 'en', 'Test Video');

insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (1, 1, 'tr', 'Deneme Başlık 1');
insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (2, 1, 'tr', 'Deneme Başlık 2');
insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (3, 1, 'tr', 'Deneme Video');

insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (1, 2, 'en', 'Test Text 1');
insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (2, 2, 'en', 'Test Text 2');
insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (3, 2, 'en', 'Test Video https://www.youtube.com/watch?v=OMbY_OHYrf0&pp=ygUMcGluayBwYW50aGVy');

insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (1, 2, 'tr', 'Deneme İçerik 1');
insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (2, 2, 'tr', 'Deneme İçerik 2');
insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (3, 2, 'tr', 'Deneme Video https://www.youtube.com/watch?v=OMbY_OHYrf0&pp=ygUMcGluayBwYW50aGVy');

insert into fe_v4.news (translation_record_id, status)
values (1, 'published');

insert into fe_v4.news (translation_record_id, status)
values (2, 'published');

insert into fe_v4.news (translation_record_id, status)
values (3, 'published');

-- Test

insert into fe_v4.translation_records(entity_id)
values (2);

insert into fe_v4.translation_records(entity_id)
values (2);

insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (4, 3, 'en', 'Test 1');
insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (5, 3, 'en', 'Test 2');

insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (4, 3, 'tr', 'Deneme 1');
insert into fe_v4.translations(translation_record_id, translation_field_id, language, value)
values (5, 3, 'tr', 'Deneme 2');

insert into fe_v4.test (translation_record_id)
values (4);

insert into fe_v4.test (translation_record_id)
values (5);

-- Code

insert into fe_v4.codes (code,
                         action,
                         value,
                         is_active,
                         used_count,
                         max_use)
values ('AAAA-BBBB-CCCC-DDDD',
        'grant_app',
        'FlightEcho-ExclusiveAccess',
        true,
        0,
        0);

-- Support Center

insert into fe_v4.support_center (user_id,
                                  text)
values ((select id from fe_v4.users where email = 'the3life@gmail.com'),
        'Test Message 1');

insert into fe_v4.support_center (user_id,
                                  text)
values ((select id from fe_v4.users where email = 'user1@test.com'),
        'Test Message 2');

insert into fe_v4.support_center (user_id,
                                  text)
values ((select id from fe_v4.users where email = 'user2@test.com'),
        'Test Message 3');