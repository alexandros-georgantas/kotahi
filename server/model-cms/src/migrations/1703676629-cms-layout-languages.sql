ALTER TABLE cms_layouts ADD COLUMN IF NOT EXISTS languages jsonb NOT NULL DEFAULT '[]'::jsonb;

-- ALTER TABLE cms_layouts ALTER COLUMN secondary_color TYPE jsonb USING '{}'::jsonb;
-- ALTER TABLE cms_layouts ALTER COLUMN secondary_color SET NOT NULL;
-- ALTER TABLE cms_layouts ALTER COLUMN secondary_color SET DEFAULT '{}'::jsonb;


-- ALTER TABLE cms_layouts ALTER COLUMN primary_color TYPE jsonb USING '{}'::jsonb;
-- ALTER TABLE cms_layouts ALTER COLUMN primary_color SET NOT NULL;
-- ALTER TABLE cms_layouts ALTER COLUMN primary_color SET DEFAULT '{}'::jsonb;

-- ALTER TABLE cms_layouts DROP COLUMN IF EXISTS logo_id;
-- ALTER TABLE cms_layouts ADD COLUMN IF NOT EXISTS logo_id jsonb NOT NULL DEFAULT '{}'::jsonb;

-- ALTER TABLE cms_layouts ALTER COLUMN footer_text TYPE jsonb USING '{}'::jsonb;
-- ALTER TABLE cms_layouts ALTER COLUMN footer_text SET NOT NULL;
-- ALTER TABLE cms_layouts ALTER COLUMN footer_text SET DEFAULT '{}'::jsonb;

-- UPDATE cms_pages SET
-- flax_footer_config = '{}'::jsonb,
-- flax_header_config = '{}'::jsonb;


-- ALTER TABLE cms_pages ALTER COLUMN title TYPE jsonb USING '{}'::jsonb;
-- ALTER TABLE cms_pages ALTER COLUMN title SET NOT NULL;
-- ALTER TABLE cms_pages ALTER COLUMN title SET DEFAULT '{}'::jsonb;

-- ALTER TABLE cms_pages ALTER COLUMN content TYPE jsonb USING '{}'::jsonb;
-- ALTER TABLE cms_pages ALTER COLUMN content SET NOT NULL;
-- ALTER TABLE cms_pages ALTER COLUMN content SET DEFAULT '{}'::jsonb;