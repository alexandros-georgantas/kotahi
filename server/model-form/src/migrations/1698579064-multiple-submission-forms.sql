-- Add is_active field
ALTER TABLE forms ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE forms ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT false;
UPDATE forms SET is_active = true, is_default = true WHERE purpose = category OR purpose = 'submit';

-- Move the 'purpose' field inside the 'structure' JSON column where it's more convenient
UPDATE forms SET structure = jsonb_set(structure, '{purpose}', to_jsonb(purpose));
ALTER TABLE forms ALTER COLUMN purpose DROP NOT NULL; -- This column is deprecated

-- Form data in submission and review objects now needs to record $$formPurpose
UPDATE manuscripts SET submission = jsonb_set(submission, '{$$formPurpose}', '"submit"'::jsonb);
UPDATE reviews set json_data = jsonb_set(json_data, '{$$formPurpose}', '"review"'::jsonb) WHERE NOT is_decision;
UPDATE reviews set json_data = jsonb_set(json_data, '{$$formPurpose}', '"decision"'::jsonb) WHERE is_decision;
