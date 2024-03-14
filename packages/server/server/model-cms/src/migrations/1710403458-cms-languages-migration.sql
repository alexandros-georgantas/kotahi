CREATE TABLE IF NOT EXISTS cms_languages(
  id UUID NOT NULL DEFAULT public.gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  languages TEXT[] NOT NULL,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE 
);

INSERT INTO cms_languages (group_id, languages) SELECT id, ARRAY['en'] FROM groups;

ALTER TABLE cms_layouts ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS language TEXT;

UPDATE cms_layouts SET language='en';
UPDATE cms_pages SET language='en';

ALTER TABLE cms_layouts ALTER COLUMN language SET NOT NULL;
ALTER TABLE cms_pages ALTER COLUMN language SET NOT NULL;
