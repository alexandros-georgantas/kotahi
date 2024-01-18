CREATE TABLE cms_file_templates (
  id UUID NOT NULL DEFAULT public.gen_random_uuid(),
  name TEXT,
  group_id UUID REFERENCES groups(id) NOT NULL,
  file_id UUID REFERENCES files(id) on delete set null,
  parent_id UUID,
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE
);
