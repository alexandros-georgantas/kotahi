ALTER TABLE cms_layouts
ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS hex_code TEXT;