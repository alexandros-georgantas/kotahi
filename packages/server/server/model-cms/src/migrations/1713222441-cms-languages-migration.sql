ALTER TABLE cms_layouts ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE cms_layouts ADD COLUMN IF NOT EXISTS language_priority INTEGER;
ALTER TABLE cms_pages ADD COLUMN IF NOT EXISTS language TEXT;

UPDATE cms_layouts SET language='en', language_priority = 0;
UPDATE cms_pages SET language='en';

ALTER TABLE cms_layouts ALTER COLUMN language SET NOT NULL;
ALTER TABLE cms_layouts ALTER COLUMN language_priority SET NOT NULL;
ALTER TABLE cms_pages ALTER COLUMN language SET NOT NULL;
