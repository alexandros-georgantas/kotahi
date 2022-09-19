--
-- PstgreSQL database dump
--

-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgboss; Type: SCHEMA; Schema: -; Owner: kotahidev
--

CREATE SCHEMA pgboss;


ALTER SCHEMA pgboss OWNER TO kotahidev;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: _state; Type: TYPE; Schema: pgboss; Owner: kotahidev
--

CREATE TYPE pgboss.job_state AS ENUM (
    'created',
    'retry',
    'active',
    'completed',
    'expired',
    'cancelled',
    'failed'
);


ALTER TYPE pgboss.job_state OWNER TO kotahidev;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: archive; Type: TABLE; Schema: pgboss; Owner: kotahidev
--

CREATE TABLE pgboss.archive (
    id uuid NOT NULL,
    name text NOT NULL,
    priority integer NOT NULL,
    data jsonb,
    state pgboss.job_state NOT NULL,
    retrylimit integer NOT NULL,
    retrycount integer NOT NULL,
    retrydelay integer NOT NULL,
    retrybackoff boolean NOT NULL,
    startafter timestamp with time zone NOT NULL,
    startedon timestamp with time zone,
    singletonkey text,
    singletonon timestamp without time zone,
    expirein interval NOT NULL,
    createdon timestamp with time zone NOT NULL,
    completedon timestamp with time zone,
    archivedon timestamp with time zone DEFAULT now() NOT NULL,
    keepuntil timestamp with time zone,
    on_complete boolean
);


ALTER TABLE pgboss.archive OWNER TO kotahidev;

--
-- Name: job; Type: TABLE; Schema: pgboss; Owner: kotahidev
--

CREATE TABLE pgboss.job (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name text NOT NULL,
    priority integer DEFAULT 0 NOT NULL,
    data jsonb,
    state pgboss.job_state DEFAULT 'created'::pgboss.job_state NOT NULL,
    retrylimit integer DEFAULT 0 NOT NULL,
    retrycount integer DEFAULT 0 NOT NULL,
    retrydelay integer DEFAULT 0 NOT NULL,
    retrybackoff boolean DEFAULT false NOT NULL,
    startafter timestamp with time zone DEFAULT now() NOT NULL,
    startedon timestamp with time zone,
    singletonkey text,
    singletonon timestamp without time zone,
    expirein interval DEFAULT '00:15:00'::interval NOT NULL,
    createdon timestamp with time zone DEFAULT now() NOT NULL,
    completedon timestamp with time zone,
    keepuntil timestamp with time zone DEFAULT (now() + '30 days'::interval) NOT NULL,
    on_complete boolean DEFAULT true NOT NULL
);


ALTER TABLE pgboss.job OWNER TO kotahidev;

--
-- Name: schedule; Type: TABLE; Schema: pgboss; Owner: kotahidev
--

CREATE TABLE pgboss.schedule (
    name text NOT NULL,
    cron text NOT NULL,
    timezone text,
    data jsonb,
    options jsonb,
    created_on timestamp with time zone DEFAULT now() NOT NULL,
    updated_on timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE pgboss.schedule OWNER TO kotahidev;

--
-- Name: version; Type: TABLE; Schema: pgboss; Owner: kotahidev
--

CREATE TABLE pgboss.version (
    version integer NOT NULL,
    maintained_on timestamp with time zone,
    cron_on timestamp with time zone
);


ALTER TABLE pgboss.version OWNER TO kotahidev;

--
-- Name: aliases; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.aliases (
    id uuid NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    name text,
    email text,
    aff text
);


ALTER TABLE public.aliases OWNER TO kotahidev;

--
-- Name: channel_members; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.channel_members (
    id uuid NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone,
    user_id uuid NOT NULL,
    channel_id uuid NOT NULL
);


ALTER TABLE public.channel_members OWNER TO kotahidev;

--
-- Name: channels; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.channels (
    id uuid NOT NULL,
    manuscript_id uuid,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone,
    topic text,
    type text
);


ALTER TABLE public.channels OWNER TO kotahidev;

--
-- Name: entities; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.entities (
    id uuid NOT NULL,
    data jsonb
);


ALTER TABLE public.entities OWNER TO kotahidev;

--
-- Name: files; Type: TABLE; Schema: public; Owner: kotahidev
--

DROP TABLE IF EXISTS "public"."files";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."files" (
    "id" uuid NOT NULL,
    "created" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" timestamptz,
    "type" text NOT NULL,
    "name" text,
    "label" text,
    "file_type" text,
    "filename" text,
    "url" text,
    "mime_type" text,
    "size" int4,
    "review_comment_id" uuid,
    "stored_objects" jsonb,
    "tags" jsonb DEFAULT '[]'::jsonb,
    "reference_id" uuid,
    "object_id" uuid,
    "alt" text,
    "upload_status" text,
    "caption" text
);


ALTER TABLE public.files OWNER TO kotahidev;


DROP TABLE IF EXISTS "public"."files_old";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."files_old" (
    "id" uuid NOT NULL,
    "created" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" timestamptz,
    "object_type" text,
    "object_id" uuid,
    "label" text,
    "file_type" text NOT NULL,
    "filename" text NOT NULL,
    "url" text NOT NULL,
    "mime_type" text,
    "size" int4 NOT NULL,
    "type" text NOT NULL,
    "manuscript_id" uuid NOT NULL,
    "review_comment_id" uuid
);


INSERT INTO "public"."files" ("id", "created", "updated", "type", "name", "stored_objects", "tags", "reference_id", "object_id", "alt", "upload_status", "caption") VALUES
('4aded767-78f0-4bd1-857e-1569f2f7b265', '2022-05-13 10:56:32.657+00', '2022-05-13 10:56:32.657+00', 'file', 'sample pdf.pdf' , '[{"id": "42dbd180-a78b-4b14-9e7e-74ac6838dba1", "key": "52ce9cf9c7a8.pdf", "size": 3028, "type": "original", "mimetype": "application/pdf", "extension": "pdf", "imageMetadata": null}]', '["manuscript"]', NULL, '8f05064b-b00d-4aec-a98f-f7ba3656cc2f', NULL, NULL, NULL);

--
-- Name: forms; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.forms (
    id UUID NOT NULL DEFAULT public.gen_random_uuid(),
    type TEXT NOT NULL DEFAULT 'form',
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
    updated TIMESTAMP WITH TIME ZONE,
    purpose TEXT NOT NULL,
    structure JSONB NOT NULL,
    CONSTRAINT pkey_forms PRIMARY KEY (id)
);

ALTER TABLE public.forms OWNER TO kotahidev;

--
-- Name: identities; Type: TABLE; Schema: public; Owner: kotahidev
--

DROP TABLE IF EXISTS "public"."email_blacklist";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."email_blacklist" (
    "id" uuid NOT NULL,
    "created" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" timestamptz,
    "email" text NOT NULL,
    PRIMARY KEY ("id")
);


CREATE TABLE public.identities (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone,
    type text NOT NULL,
    identifier text,
    name text,
    aff text,
    oauth jsonb,
    is_default boolean
);


ALTER TABLE public.identities OWNER TO kotahidev;

--
-- Name: manuscripts; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.manuscripts (
    id uuid NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone,
    parent_id uuid,
    submitter_id uuid,
    status text,
    decision text,
    authors jsonb,
    suggestions jsonb,
    meta jsonb,
    submission jsonb,
    published timestamp with time zone,
    type text NOT NULL
);


ALTER TABLE public.manuscripts OWNER TO kotahidev;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.messages (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    channel_id uuid NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone,
    content text
);


ALTER TABLE public.messages OWNER TO kotahidev;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.migrations (
    id text NOT NULL,
    run_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.migrations OWNER TO kotahidev;

--
-- Name: review_comments; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.review_comments (
    id uuid NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone,
    review_id uuid,
    user_id uuid,
    content text,
    comment_type text,
    type text
);


ALTER TABLE public.review_comments OWNER TO kotahidev;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.reviews (
    id uuid NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone,
    recommendation text,
    is_decision boolean DEFAULT false,
    user_id uuid,
    manuscript_id uuid,
    type text NOT NULL
);


ALTER TABLE public.reviews OWNER TO kotahidev;

--
-- Name: team_members; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.team_members (
    id uuid NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(255),
    team_id uuid,
    user_id uuid,
    alias_id uuid
);


ALTER TABLE public.team_members OWNER TO kotahidev;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.teams (
    id uuid NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone,
    name text,
    role text NOT NULL,
    members jsonb,
    owners jsonb,
    global boolean,
    type text NOT NULL,
    object_id uuid,
    object_type text
);


ALTER TABLE public.teams OWNER TO kotahidev;

--
-- Name: users; Type: TABLE; Schema: public; Owner: kotahidev
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    created timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated timestamp with time zone,
    admin boolean,
    email text,
    username text,
    password_hash text,
    teams jsonb,
    password_reset_token text,
    password_reset_timestamp timestamp with time zone,
    type text NOT NULL,
    profile_picture text,
    online boolean
);


ALTER TABLE public.users OWNER TO kotahidev;

--
-- Data for Name: archive; Type: TABLE DATA; Schema: pgboss; Owner: kotahidev
--

DROP TABLE IF EXISTS "public"."threaded_discussions";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE IF NOT EXISTS public.threaded_discussions (
  id uuid NOT NULL,
  created timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  manuscript_id uuid NOT NULL,
  threads json NOT NULL
);


--
-- Data for Name: job; Type: TABLE DATA; Schema: pgboss; Owner: kotahidev
--

INSERT INTO pgboss.job (id, name, priority, data, state, retrylimit, retrycount, retrydelay, retrybackoff, startafter, startedon, singletonkey, singletonon, expirein, createdon, completedon, keepuntil, on_complete) VALUES ('876670c0-8195-11eb-815e-59df8a5d915a', '__pgboss__maintenance', 0, NULL, 'completed', 0, 0, 0, false, '2021-03-10 12:41:18.669507+01', '2021-03-10 12:41:18.675148+01', '__pgboss__maintenance', NULL, '00:15:00', '2021-03-10 12:41:18.669507+01', '2021-03-10 12:41:18.693727+01', '2021-03-10 12:49:18.669507+01', false);
INSERT INTO pgboss.job (id, name, priority, data, state, retrylimit, retrycount, retrydelay, retrybackoff, startafter, startedon, singletonkey, singletonon, expirein, createdon, completedon, keepuntil, on_complete) VALUES ('87686c90-8195-11eb-815e-59df8a5d915a', '__pgboss__cron', 0, NULL, 'completed', 2, 0, 0, false, '2021-03-10 12:41:18.685423+01', '2021-03-10 12:41:22.689863+01', NULL, '2021-03-10 11:41:00', '00:15:00', '2021-03-10 12:41:18.685423+01', '2021-03-10 12:41:22.824712+01', '2021-03-10 12:42:18.685423+01', false);
INSERT INTO pgboss.job (id, name, priority, data, state, retrylimit, retrycount, retrydelay, retrybackoff, startafter, startedon, singletonkey, singletonon, expirein, createdon, completedon, keepuntil, on_complete) VALUES ('89da2fe0-8195-11eb-815e-59df8a5d915a', '__pgboss__cron', 0, NULL, 'completed', 2, 0, 0, false, '2021-03-10 12:42:01.782499+01', '2021-03-10 12:48:02.953124+01', NULL, '2021-03-10 11:42:00', '00:15:00', '2021-03-10 12:41:22.782499+01', '2021-03-10 12:48:02.980596+01', '2021-03-10 12:43:01.782499+01', false);
INSERT INTO pgboss.job (id, name, priority, data, state, retrylimit, retrycount, retrydelay, retrybackoff, startafter, startedon, singletonkey, singletonon, expirein, createdon, completedon, keepuntil, on_complete) VALUES ('7ac41380-8196-11eb-815e-59df8a5d915a', '__pgboss__cron', 0, NULL, 'created', 2, 0, 0, false, '2021-03-10 12:49:01.96878+01', NULL, NULL, '2021-03-10 11:49:00', '00:15:00', '2021-03-10 12:48:06.96878+01', NULL, '2021-03-10 12:50:01.96878+01', false);
INSERT INTO pgboss.job (id, name, priority, data, state, retrylimit, retrycount, retrydelay, retrybackoff, startafter, startedon, singletonkey, singletonon, expirein, createdon, completedon, keepuntil, on_complete) VALUES ('7862a3e0-8196-11eb-815e-59df8a5d915a', '__pgboss__cron', 0, NULL, 'completed', 2, 0, 0, false, '2021-03-10 12:48:02.975253+01', '2021-03-10 12:48:06.958274+01', NULL, '2021-03-10 11:48:00', '00:15:00', '2021-03-10 12:48:02.975253+01', '2021-03-10 12:48:06.970586+01', '2021-03-10 12:49:02.975253+01', false);
INSERT INTO pgboss.job (id, name, priority, data, state, retrylimit, retrycount, retrydelay, retrybackoff, startafter, startedon, singletonkey, singletonon, expirein, createdon, completedon, keepuntil, on_complete) VALUES ('876ab680-8195-11eb-815e-59df8a5d915a', '__pgboss__maintenance', 0, NULL, 'completed', 0, 0, 0, false, '2021-03-10 12:43:18.696869+01', '2021-03-10 12:48:18.70568+01', '__pgboss__maintenance', NULL, '00:15:00', '2021-03-10 12:41:18.696869+01', '2021-03-10 12:48:18.766285+01', '2021-03-10 12:51:18.696869+01', false);
INSERT INTO pgboss.job (id, name, priority, data, state, retrylimit, retrycount, retrydelay, retrybackoff, startafter, startedon, singletonkey, singletonon, expirein, createdon, completedon, keepuntil, on_complete) VALUES ('81ccc410-8196-11eb-815e-59df8a5d915a', '__pgboss__maintenance', 0, NULL, 'created', 0, 0, 0, false, '2021-03-10 12:50:18.770247+01', NULL, '__pgboss__maintenance', NULL, '00:15:00', '2021-03-10 12:48:18.770247+01', NULL, '2021-03-10 12:58:18.770247+01', false);


--
-- Data for Name: schedule; Type: TABLE DATA; Schema: pgboss; Owner: kotahidev
--



--
-- Data for Name: version; Type: TABLE DATA; Schema: pgboss; Owner: kotahidev
--

INSERT INTO pgboss.version (version, maintained_on, cron_on) VALUES (16, '2021-03-10 12:48:18.764191+01', '2021-03-10 12:48:06.965457+01');


--
-- Data for Name: aliases; Type: TABLE DATA; Schema: public; Owner: kotahidev
--



--
-- Data for Name: channel_members; Type: TABLE DATA; Schema: public; Owner: kotahidev
--



--
-- Data for Name: channels; Type: TABLE DATA; Schema: public; Owner: kotahidev
--

INSERT INTO public.channels (id, manuscript_id, created, updated, topic, type) VALUES ('fbb752f5-fb46-4ab6-9896-bcf34a384c92', '06ea851c-619c-453e-a12e-6568da11252c', '2021-03-10 12:48:02.828+01', '2021-03-10 12:48:02.828+01', 'Manuscript discussion', 'all');
INSERT INTO public.channels (id, manuscript_id, created, updated, topic, type) VALUES ('1e410fdb-9afe-4a6f-97b5-526e384d4df3', '06ea851c-619c-453e-a12e-6568da11252c', '2021-03-10 12:48:02.828+01', '2021-03-10 12:48:02.828+01', 'Editorial discussion', 'editorial');


--
-- Data for Name: entities; Type: TABLE DATA; Schema: public; Owner: kotahidev
--



--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: kotahidev
--

INSERT INTO public.files (id, created, updated, label, file_type, filename, url, mime_type, size, type, object_id, review_comment_id) VALUES ('81ffbef0-c77e-46dc-a86c-864f7f1f336c', '2021-03-10 12:48:21.069+01', '2021-03-10 12:48:21.069+01', NULL, 'supplementary', 'test-pdf.pdf', '/static/uploads/508239154500088a36827c250d0b83b7.pdf', 'application/pdf', 142400, 'file', '06ea851c-619c-453e-a12e-6568da11252c', NULL);


--
-- Data for Name: forms; Type: TABLE DATA; Schema: public; Owner: kotahidev
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: public; Owner: kotahidev
--

INSERT INTO public.identities (id, user_id, created, updated, type, identifier, name, aff, oauth, is_default) VALUES ('d341a633-cdce-4a7f-a9ad-5afc03cd0dd1', '027afa6a-edbc-486e-bb31-71e12f8ea1c5', '2020-07-21 16:17:24.741+02', '2020-07-21 16:17:25.87+02', 'orcid', '0000-0002-0564-2016', 'Emily Clay', NULL, '{"accessToken": "079a1165-31e5-4b59-9a99-d80ff7a21ebf", "refreshToken": "ccadc737-defc-419e-823b-a9f3673848ba"}', true);
INSERT INTO public.identities (id, user_id, created, updated, type, identifier, name, aff, oauth, is_default) VALUES ('bcda196e-765a-42c8-94da-ca2e43b80f96', '3802b0e7-aadc-45de-9cf9-918fede99b97', '2020-07-21 16:30:45.721+02', '2020-07-21 16:33:26.742+02', 'orcid', '0000-0002-5641-5729', 'Sinead Sullivan', NULL, '{"accessToken": "ef1ed3ec-8371-41b2-a136-fd196ae52a72", "refreshToken": "6972dace-d9a6-4cd3-a2ad-ec7eb3e457c7"}', true);
INSERT INTO public.identities (id, user_id, created, updated, type, identifier, name, aff, oauth, is_default) VALUES ('4af83984-6359-47c5-a075-5ddfa9c555d9', '0da0bbec-9261-4706-b990-0c10aa3cc6b4', '2020-07-21 16:35:06.127+02', '2020-07-21 16:35:07.104+02', 'orcid', '0000-0002-7645-9921', 'Sherry Crofoot', NULL, '{"accessToken": "2ad4e130-0775-4e13-87fb-8e8f5a0570ae", "refreshToken": "159933d9-2020-4c02-bdfb-163af41017dc"}', true);
INSERT INTO public.identities (id, user_id, created, updated, type, identifier, name, aff, oauth, is_default) VALUES ('acfa1777-0aec-4fe1-bc16-92bb9d19e884', '85e1300e-003c-4e96-987b-23812f902477', '2020-07-21 16:35:38.384+02', '2020-07-21 16:35:39.358+02', 'orcid', '0000-0002-9429-4446', 'Elaine Barnes', NULL, '{"accessToken": "dcf07bc7-e59c-41b3-9ce0-924ac20aeeea", "refreshToken": "ae49d6a1-8e62-419d-8767-4a3ec22c1950"}', true);
INSERT INTO public.identities (id, user_id, created, updated, type, identifier, name, aff, oauth, is_default) VALUES ('88c85115-d83c-42d7-a1a1-0139827977da', '40e3d054-9ac8-4c0f-84ed-e3c6307662cd', '2020-07-21 16:36:24.975+02', '2020-07-21 16:36:26.059+02', 'orcid', '0000-0001-5956-7341', 'Gale Davis', NULL, '{"accessToken": "3e9f6f6c-7cc0-4afa-9fdf-6ed377c36aad", "refreshToken": "80b1e911-df97-43f1-9f11-17b61913f6d7"}', true);
INSERT INTO public.identities (id, user_id, created, updated, type, identifier, name, aff, oauth, is_default) VALUES ('049f91da-c84e-4b80-be2e-6e0cfca7a136', '231717dd-ba09-43d4-ac98-9d5542b27a0c', '2020-07-22 14:18:36.611+02', '2020-07-22 14:18:37.745+02', 'orcid', '0000-0003-2536-230X', 'Test Account', NULL, '{"accessToken": "eb551178-79e5-4189-8c5f-0a553092a9b5", "refreshToken": "4506fa5f-bd77-4867-afb4-0b07ea5302d6"}', true);
INSERT INTO public.identities (id, user_id, created, updated, type, identifier, name, aff, oauth, is_default) VALUES ('2fb8359c-239c-43fa-91f5-1ff2058272a6', '1d599f2c-d293-4d5e-b6c1-ba34e81e3fc8', '2020-07-24 15:21:54.604+02', '2020-07-24 15:21:55.7+02', 'orcid', '0000-0003-1838-2441', 'Joanne Pilger', NULL, '{"accessToken": "842de329-ef16-4461-b83b-e8fe57238904", "refreshToken": "524fbdc5-9c67-4b4c-af17-2ce4cf294e88"}', true);


--
-- Data for Name: manuscripts; Type: TABLE DATA; Schema: public; Owner: kotahidev
--

INSERT INTO public.manuscripts (id, created, updated, parent_id, submitter_id, status, decision, authors, suggestions, meta, submission, published, type) VALUES ('06ea851c-619c-453e-a12e-6568da11252c', '2021-03-10 12:48:02.815+01', '2021-03-10 12:48:28.803+01', NULL, '027afa6a-edbc-486e-bb31-71e12f8ea1c5', 'submitted', NULL, NULL, NULL, '{"notes": [{"content": "", "notesType": "fundingAcknowledgement"}, {"content": "", "notesType": "specialInstructions"}], "title": "My URL submission"}', '{"irb": "yes", "name": "Emily Clay", "cover": "This is my cover letter", "links": [{"url": "https://doi.org/10.6084/m9.figshare.913521.v1"}, {"url": "https://github.com/jure/mathtype_to_mathml"}], "ethics": "This is my ethics statement", "contact": "emily@example.com", "methods": ["Functional MRI", "Optical Imaging"], "datacode": "This is my data and code availability statement", "humanMRI": "3T", "keywords": "some, keywords", "packages": ["SPM", "FSL"], "subjects": "patients", "suggested": "Erica James, Matthew Matretzky", "objectType": "software", "affiliation": "Example University, England", "otherMethods": "Erica James, Matthew Matretzky", "humanMRIother": "7T", "animal_research_approval": "yes"}', NULL, 'Manuscript');


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: kotahidev
--



--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: kotahidev
--

INSERT INTO public.migrations (id, run_at) VALUES ('1524494862-entities.sql', '2020-08-16 22:36:46.642584+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1542276313-initial-user-migration.sql', '2020-08-16 22:36:46.654019+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1560771823-add-unique-constraints-to-users.sql', '2020-08-16 22:36:46.66205+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1580908536-add-identities.sql', '2020-08-16 22:36:46.674013+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1581371297-migrate-users-to-identities.js', '2020-08-16 22:36:46.695786+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1581450834-manuscript.sql', '2020-08-16 22:36:46.705481+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1582930582-drop-fragments-and-collections.js', '2020-08-16 22:36:46.715537+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1585323910-add-channels.sql', '2020-08-16 22:36:46.728966+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1585344885-add-messages.sql', '2020-08-16 22:36:46.743035+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1585513226-add-profile-pic.sql', '2020-08-16 22:36:46.748428+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1592915682-change-identities-constraint.sql', '2020-08-16 22:36:46.756393+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1596830547-review.sql', '2020-08-16 22:36:46.766024+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1596830548-add-review-comments.sql', '2020-08-16 22:36:46.776351+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1596830548-initial-team-migration.sql', '2020-08-16 22:36:46.795918+02');
INSERT INTO public.migrations (id, run_at) VALUES ('1596838897-files.sql', '2020-08-16 22:36:46.807663+02');


--
-- Data for Name: review_comments; Type: TABLE DATA; Schema: public; Owner: kotahidev
--



--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: kotahidev
--



--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: kotahidev
--

INSERT INTO public.team_members (id, created, updated, status, team_id, user_id, alias_id) VALUES ('df69d471-bead-42b6-a8b5-d1bff0a36040', '2021-03-10 12:48:02.832+01', '2021-03-10 12:48:02.832+01', NULL, 'dccbd509-505f-4ad6-8ceb-8a42b62c917b', '027afa6a-edbc-486e-bb31-71e12f8ea1c5', NULL);


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: kotahidev
--

INSERT INTO public.teams (id, created, updated, name, role, members, owners, global, type, object_id, object_type) VALUES ('dccbd509-505f-4ad6-8ceb-8a42b62c917b', '2021-03-10 12:48:02.828+01', '2021-03-10 12:48:02.828+01', 'Author', 'author', NULL, NULL, NULL, 'team', '06ea851c-619c-453e-a12e-6568da11252c', 'manuscript');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: kotahidev
--

INSERT INTO public.users (id, created, updated, admin, email, username, password_hash, teams, password_reset_token, password_reset_timestamp, type, profile_picture, online) VALUES ('85e1300e-003c-4e96-987b-23812f902477', '2020-07-21 16:35:38.381+02', '2020-07-24 16:43:03.114+02', NULL, NULL, '0000000294294446', NULL, NULL, NULL, NULL, 'user', '/static/profiles/testuser1.jpg', false);
INSERT INTO public.users (id, created, updated, admin, email, username, password_hash, teams, password_reset_token, password_reset_timestamp, type, profile_picture, online) VALUES ('1d599f2c-d293-4d5e-b6c1-ba34e81e3fc8', '2020-07-24 15:21:54.59+02', '2020-07-24 16:43:26.378+02', NULL, NULL, '0000000318382441', NULL, NULL, NULL, NULL, 'user', '/static/profiles/testuser3.jpg', false);
INSERT INTO public.users (id, created, updated, admin, email, username, password_hash, teams, password_reset_token, password_reset_timestamp, type, profile_picture, online) VALUES ('40e3d054-9ac8-4c0f-84ed-e3c6307662cd', '2020-07-21 16:36:24.973+02', '2020-07-24 16:43:43.943+02', NULL, NULL, '0000000159567341', NULL, NULL, NULL, NULL, 'user', '/static/profiles/testuser4.jpg', true);
INSERT INTO public.users (id, created, updated, admin, email, username, password_hash, teams, password_reset_token, password_reset_timestamp, type, profile_picture, online) VALUES ('231717dd-ba09-43d4-ac98-9d5542b27a0c', '2020-07-22 14:18:36.597+02', '2020-07-24 16:43:54.939+02', NULL, NULL, '000000032536230X', NULL, NULL, NULL, NULL, 'user', '/static/profiles/testuser5.jpg', false);
INSERT INTO public.users (id, created, updated, admin, email, username, password_hash, teams, password_reset_token, password_reset_timestamp, type, profile_picture, online) VALUES ('0da0bbec-9261-4706-b990-0c10aa3cc6b4', '2020-07-21 16:35:06.125+02', '2020-07-24 16:44:59.306+02', NULL, NULL, '0000000276459921', NULL, NULL, NULL, NULL, 'user', '/static/profiles/testuser7.jpg', true);
INSERT INTO public.users (id, created, updated, admin, email, username, password_hash, teams, password_reset_token, password_reset_timestamp, type, profile_picture, online) VALUES ('3802b0e7-aadc-45de-9cf9-918fede99b97', '2020-07-21 16:30:45.719+02', '2021-03-10 12:41:10.044+01', true, NULL, '0000000256415729', NULL, NULL, NULL, NULL, 'user', '/static/profiles/testuser6.jpg', false);
INSERT INTO public.users (id, created, updated, admin, email, username, password_hash, teams, password_reset_token, password_reset_timestamp, type, profile_picture, online) VALUES ('027afa6a-edbc-486e-bb31-71e12f8ea1c5', '2020-07-21 16:17:24.734+02', '2021-03-10 12:48:02.837+01', NULL, NULL, '0000000205642016', NULL, NULL, NULL, NULL, 'user', '/static/profiles/testuser2.jpg', true);


--
-- Name: job job_pkey; Type: CONSTRAINT; Schema: pgboss; Owner: kotahidev
--

ALTER TABLE ONLY pgboss.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);


--
-- Name: schedule schedule_pkey; Type: CONSTRAINT; Schema: pgboss; Owner: kotahidev
--

ALTER TABLE ONLY pgboss.schedule
    ADD CONSTRAINT schedule_pkey PRIMARY KEY (name);


--
-- Name: version version_pkey; Type: CONSTRAINT; Schema: pgboss; Owner: kotahidev
--

ALTER TABLE ONLY pgboss.version
    ADD CONSTRAINT version_pkey PRIMARY KEY (version);


--
-- Name: aliases aliases_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.aliases
    ADD CONSTRAINT aliases_pkey PRIMARY KEY (id);


--
-- Name: channel_members channel_members_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.channel_members
    ADD CONSTRAINT channel_members_pkey PRIMARY KEY (id);


--
-- Name: channels channels_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_pkey PRIMARY KEY (id);


--
-- Name: entities entities_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.entities
    ADD CONSTRAINT entities_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: manuscripts manuscripts_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.manuscripts
    ADD CONSTRAINT manuscripts_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: review_comments review_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: archive_archivedon_idx; Type: INDEX; Schema: pgboss; Owner: kotahidev
--

CREATE INDEX archive_archivedon_idx ON pgboss.archive USING btree (archivedon);


--
-- Name: archive_id_idx; Type: INDEX; Schema: pgboss; Owner: kotahidev
--

CREATE INDEX archive_id_idx ON pgboss.archive USING btree (id);


--
-- Name: job_name; Type: INDEX; Schema: pgboss; Owner: kotahidev
--

CREATE INDEX job_name ON pgboss.job USING btree (name text_pattern_ops);


--
-- Name: job_singletonkey; Type: INDEX; Schema: pgboss; Owner: kotahidev
--

CREATE UNIQUE INDEX job_singletonkey ON pgboss.job USING btree (name, singletonkey) WHERE ((state < 'completed'::pgboss.job_state) AND (singletonon IS NULL));


--
-- Name: job_singletonkeyon; Type: INDEX; Schema: pgboss; Owner: kotahidev
--

CREATE UNIQUE INDEX job_singletonkeyon ON pgboss.job USING btree (name, singletonon, singletonkey) WHERE (state < 'expired'::pgboss.job_state);


--
-- Name: job_singletonon; Type: INDEX; Schema: pgboss; Owner: kotahidev
--

CREATE UNIQUE INDEX job_singletonon ON pgboss.job USING btree (name, singletonon) WHERE ((state < 'expired'::pgboss.job_state) AND (singletonkey IS NULL));


--
-- Name: channel_members_idx; Type: INDEX; Schema: public; Owner: kotahidev
--

CREATE INDEX channel_members_idx ON public.channel_members USING btree (user_id, channel_id);


--
-- Name: is_default_idx; Type: INDEX; Schema: public; Owner: kotahidev
--

CREATE UNIQUE INDEX is_default_idx ON public.identities USING btree (is_default, user_id) WHERE (is_default IS TRUE);


--
-- Name: team_members_team_id_user_id_idx; Type: INDEX; Schema: public; Owner: kotahidev
--

CREATE INDEX team_members_team_id_user_id_idx ON public.team_members USING btree (team_id, user_id);


--
-- Name: teams_manuscript_id_idx; Type: INDEX; Schema: public; Owner: kotahidev
--

-- CREATE INDEX teams_manuscript_id_idx ON public.teams USING btree (manuscript_id);


--
-- Name: channel_members channel_members_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.channel_members
    ADD CONSTRAINT channel_members_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id);


--
-- Name: channel_members channel_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.channel_members
    ADD CONSTRAINT channel_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: channels channels_manuscript_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.channels
    ADD CONSTRAINT channels_manuscript_id_fkey FOREIGN KEY (manuscript_id) REFERENCES public.manuscripts(id) ON DELETE CASCADE;


--
-- Name: files files_manuscript_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

-- ALTER TABLE ONLY public.files
--     ADD CONSTRAINT files_manuscript_id_fkey FOREIGN KEY (manuscript_id) REFERENCES public.manuscripts(id) ON DELETE CASCADE;


--
-- Name: files files_review_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_review_comment_id_fkey FOREIGN KEY (review_comment_id) REFERENCES public.review_comments(id) ON DELETE CASCADE;


--
-- Name: manuscripts manuscripts_submitter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.manuscripts
    ADD CONSTRAINT manuscripts_submitter_id_fkey FOREIGN KEY (submitter_id) REFERENCES public.users(id);


--
-- Name: messages messages_channel_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_channel_id_fkey FOREIGN KEY (channel_id) REFERENCES public.channels(id) ON DELETE CASCADE;


--
-- Name: messages messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: review_comments review_comments_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: review_comments review_comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.review_comments
    ADD CONSTRAINT review_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_manuscript_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_manuscript_id_fkey FOREIGN KEY (manuscript_id) REFERENCES public.manuscripts(id) ON DELETE CASCADE;


--
-- Name: identities sidentities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.identities
    ADD CONSTRAINT sidentities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: team_members team_members_alias_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_alias_id_fkey FOREIGN KEY (alias_id) REFERENCES public.aliases(id);


--
-- Name: team_members team_members_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_members team_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: teams teams_manuscript_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: kotahidev
--

-- ALTER TABLE ONLY public.teams
--     ADD CONSTRAINT teams_manuscript_id_fkey FOREIGN KEY (manuscript_id) REFERENCES public.manuscripts(id) ON DELETE CASCADE;

ALTER TABLE public.forms 
  ADD category TEXT NULL;

UPDATE public.forms SET category = 'submission';

-- 
-- Name: Channels; schema:public; owner: kotahidev;
-- 
INSERT INTO public.channels ( 
  id, topic, type 
) VALUES (  
  '9fd7774c-11e5-4802-804c-ab64aefd5080', 'System-wide discussion', 'editorial'
) ON CONFLICT DO NOTHING;


ALTER TABLE public.manuscripts ADD COLUMN short_id SERIAL;

update public.manuscripts child
set short_id=parent.short_id
from public.manuscripts parent
where parent.id = child.parent_id;



ALTER TABLE public.manuscripts ADD is_hidden BOOLEAN;



INSERT INTO "public"."forms" ("id", "type", "created", "updated", "purpose", "structure", "category") VALUES
('522b8066-e02e-4cd3-90e7-3b4985052381', 'Form', '2022-05-13 10:53:22.715+00', '2022-05-13 10:53:22.715+00', 'review', '{"name": "Review Form", "children": [{"id": "78a82745-2aa7-4725-b42d-d54809dd7926", "name": "meta.abstract", "title": "Comments to the Author", "component": "AbstractEditor", "description": "<p class=\"paragraph\">Text field for comments to the author.</p>", "placeholder": "Enter your review..."}, {"id": "19893e6e-aca6-40ec-9a0a-34c490ba22ac", "name": "authorFileName", "title": "authorFiles", "component": "SupplementaryFiles", "description": "<p class=\"paragraph\">Drag and drop your files here</p>"}, {"id": "e169b0fa-377a-43a4-9365-ce7e9b1f8f38", "name": "meta.abstract", "title": "Confidential comments to editor (optional)", "component": "AbstractEditor", "description": "<p class=\"paragraph\">Confidential note for the editor</p>", "placeholder": "Enter a confidential note to the editor (optional)…", "hideFromAuthors": "true"}, {"id": "78a94bf5-05c9-411d-bc97-5f84d2f686a2", "name": "fileName", "title": "Files", "component": "SupplementaryFiles", "description": "<p class=\"paragraph\">Drag and drop your files here</p>"}, {"id": "5705067e-3ee0-41ae-a953-87167b171c3f", "name": "submission.status", "title": "Decision Status", "inline": "false", "options": [{"id": "1ba634b0-82f9-481c-a135-77c6d3e28fec", "label": "Accept", "value": "accept", "labelColor": "#00ff7b"}, {"id": "459469e8-12ca-426c-9e05-581a14fe7c03", "label": "Revise", "value": "revise", "labelColor": "#daea61"}, {"id": "e38b9433-4e93-4e1d-b4a3-5a14f7ac3fc6", "label": "Reject", "value": "reject", "labelColor": "#e64e3d"}], "validate": [{"id": "76c87808-32cb-41cb-9f72-5254f610015f", "label": "Required", "value": "required"}], "component": "RadioGroup", "description": "<p class=\"paragraph\">Status of decesion </p>"}], "haspopup": "false", "description": "<p class=\"paragraph\">Form for Reviews</p>"}', 'review'),
('7b528dff-793b-4c77-a250-8e4b1bbcbf0e', 'Form', '2022-05-13 10:53:22.717+00', '2022-05-13 10:53:22.717+00', 'decision', '{"name": "Decision Form", "children": [{"id": "74cf4404-3d04-46cb-a3da-e7d70d47db0a", "name": "meta.abstract", "title": "Decision", "component": "AbstractEditor", "description": "<p class=\"paragraph\">Text field for decisions.</p>", "placeholder": "Write/paste your decision letter here, or upload it using the upload button on the right."}, {"id": "78a94bf5-05c9-411d-bc97-5f84d2f686a2", "name": "fileName", "title": "Files", "component": "SupplementaryFiles", "description": "<p class=\"paragraph\">Drag and drop your files here</p>"}, {"id": "5705067e-3ee0-41ae-a953-87167b171c3f", "name": "submission.status", "title": "Decision Status", "inline": "false", "options": [{"id": "1ba634b0-82f9-481c-a135-77c6d3e28fec", "label": "Accept", "value": "accept", "labelColor": "#00ff7b"}, {"id": "459469e8-12ca-426c-9e05-581a14fe7c03", "label": "Revise", "value": "revise", "labelColor": "#daea61"}, {"id": "e38b9433-4e93-4e1d-b4a3-5a14f7ac3fc6", "label": "Reject", "value": "reject", "labelColor": "#e64e3d"}], "validate": [{"id": "76c87808-32cb-41cb-9f72-5254f610015f", "label": "Required", "value": "required"}], "component": "RadioGroup", "description": "<p class=\"paragraph\">Status of decesion </p>"}], "haspopup": "false"}', 'decision'),
('eae525b1-5b07-4c67-9bca-daf88bcb9804', 'Form', '2022-05-13 10:53:22.71+00', '2022-05-13 10:53:22.71+00', 'submit', '{"name": "Research Object Submission Form", "children": [{"id": "fa0c39ca-0486-4e29-ba24-f86f7d375c3f", "name": "submission.objectType", "title": "Type of Research Object", "options": [{"id": "df5fc212-b055-4cba-9d0e-e85222e3d4f2", "label": "Dataset", "value": "dataset"}, {"id": "ef2ddada-105a-412e-8d7f-56b1df44c02f", "label": "Software", "value": "software"}, {"id": "0fafbfc3-6797-46e3-aff4-3fd4f16261b1", "label": "Figure", "value": "figure"}, {"id": "5117a7c6-2fcf-414b-ac60-47f8d93ccfef", "label": "Notebook", "value": "notebook"}, {"id": "32121b38-b855-465e-b039-b5100177698b", "label": "Research article ", "value": "Research article "}], "component": "Select"}, {"id": "47fd802f-ed30-460d-9617-c8a9b9025e95", "name": "meta.title", "title": "Title", "component": "TextField", "placeholder": "Enter the manuscript''s title", "includeInReviewerPreview": "true"}, {"id": "d76e5b3c-eeaa-4168-9318-95d43a31e3e4", "name": "submission.authorNames", "title": "Author names", "component": "AuthorsInput", "includeInReviewerPreview": "true"}, {"id": "62ca72ad-04b0-41fc-85d1-415469d7e895", "name": "submission.topics", "title": "Topics", "options": [{"id": "2323b6d1-8223-45e8-a0fc-1044a1e39d37", "label": "Neuropsychology ", "value": "Neuropsychology "}, {"id": "ac7cafca-c5c8-4940-9f2f-014d18660e90", "label": "Topic 2", "value": "Topic 2"}, {"id": "93c88240-9c2b-4c23-9301-23ed94ef61d7", "label": "Topic 3", "value": "Topic 3"}], "component": "CheckboxGroup", "includeInReviewerPreview": "true"}, {"id": "1c2e9325-3fa8-41f3-8607-180eb8a25aa3", "name": "submission.DOI", "title": "DOI", "component": "TextField", "placeholder": "Enter the manuscript''s DOI", "doiValidation": "true", "includeInReviewerPreview": "true"}, {"id": "d80b2c88-6144-4003-b671-63990b9b2793", "name": "submission.abstract", "title": "Abstract", "component": "AbstractEditor", "description": "<p>Please provide a short summary of your submission</p>", "placeholder": "Input your abstract...", "shortDescription": "Abstract", "includeInReviewerPreview": "true"}, {"id": "7f5aa395-3486-4067-b636-ae204d472c16", "name": "submission.AuthorCorrespondence", "title": "Author correspondence ", "component": "TextField"}, {"id": "347dc171-f008-45ac-8433-ca0711bf213c", "name": "submission.cover", "title": "Cover letter", "component": "AbstractEditor", "description": "<p>Cover letter describing submission, relevant implications, and timely information to consider</p>", "placeholder": "Enter your cover letter"}, {"id": "14b8da7d-5924-4098-8d1f-e528c7c440b9", "name": "submission.EditorsEvaluation", "title": "Editors evaluation ", "component": "TextField"}, {"id": "bf2f9b4a-377b-4303-8f51-70d836eb1456", "name": "submission.datacode", "title": "Data and Code availability statements", "component": "AbstractEditor", "placeholder": "Enter your data and code availability statement"}, {"id": "fa5e5b75-4b6f-4a2d-9113-c2b4db73ef8a", "name": "submission.competingInterests", "title": "Competing interests", "component": "AbstractEditor", "includeInReviewerPreview": "true"}, {"id": "6bfdc237-814d-4af8-b0f0-064099d679ba", "name": "submission.Funding", "title": "Funding", "component": "TextField"}, {"id": "b769b4d5-f9b3-48d3-a6d5-77bb6a9e95b0", "name": "fileName", "title": "Upload supplementary materials", "component": "SupplementaryFiles"}, {"id": "b127ecb1-4862-4662-a958-3266eb284353", "name": "submission.authorContributions", "title": "Author contributions ", "component": "TextField"}, {"id": "6342cff7-c57a-4fd9-b91d-c4cf77b4c309", "name": "submission.DecisionLetter", "title": "Decision letter and author response", "component": "AbstractEditor"}, {"id": "e8af0c63-e46f-46a8-bc90-5023fe50a541", "name": "submission.references", "title": "References ", "component": "AbstractEditor", "includeInReviewerPreview": "true"}, {"id": "ebe75cec-0ba8-4f00-9024-20e77ed94f1c", "name": "submission.reviewingEditor", "title": "Reviewing editors name ", "component": "AuthorsInput"}, {"id": "6871680a-2278-40b3-80c6-7de06f21aafb", "name": "submission.copyrightHolder", "title": "Copyright holder", "component": "TextField", "description": "<p class=\"paragraph\">e.g. British Medical Journal </p>"}, {"id": "1e9ff636-f850-4d20-b079-36af49fa4ad1", "name": "submission.copyrightStatement", "title": "Copyright statement ", "component": "TextField", "description": "<p class=\"paragraph\">e.g. This article is distributed under the terms of the Creative Commons Attribution License, which permits unrestricted use and redistribution provided that the original author and source are credited.</p>"}, {"id": "7617c919-4413-4306-b709-ef78c3110c3f", "name": "submission.copyrightYear", "title": "Copyright year ", "component": "TextField", "description": "<p class=\"paragraph\">e.g. 2022</p>"}, {"id": "6deaacc6-759a-4a68-b494-c38c664bb665", "name": "submission.dateReceived", "title": "Date received ", "component": "TextField", "description": "<p class=\"paragraph\">preferred format: DD.MM.YYYY e.g. 07.01.2021</p>"}, {"id": "8b858adc-5f65-4385-9f79-5c5af1f67bd5", "name": "submission.dateAccepted", "title": "Date accepted", "component": "TextField", "description": "<p class=\"paragraph\">preferred format: DD.MM.YYYY e.g. 07.01.2021</p>"}, {"id": "f6e46890-4b96-4c90-ab48-b4fc5abb9b40", "name": "submission.datePublished", "title": "Date published ", "component": "TextField", "description": "<p class=\"paragraph\">preferred format: DD.MM.YYYY e.g. 07.01.2021</p>"}], "haspopup": "true", "popuptitle": "By submitting the manuscript, you agree to the following statements.", "description": "<p>Please fill out the form below to complete your submission.</p>", "popupdescription": "<p>The corresponding author confirms that all co-authors are included, and that everyone listed as a co-author agrees to that role and all the following requirements and acknowledgements:</p><p></p><p>The submission represents original work and sources are given proper attribution. The journal employs CrossCheck to compare submissions against a large and growing database of published scholarly content. If in the judgment of a senior editor a submission is genuinely suspected of plagiarism, it will be returned to the author(s) with a request for explanation.</p><p></p><p>The research was conducted in accordance with ethical principles.</p><p></p><p>There is a Data Accessibility Statement, containing information about the location of open data and materials, in the manuscript.</p><p></p><p>A conflict of interest statement is present in the manuscript, even if to state no conflicts of interest.</p>"}', 'submission');



--
-- PostgreSQL database dump complete
--