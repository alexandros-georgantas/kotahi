CREATE TABLE doc_sets (
  id UUID NOT NULL DEFAULT public.gen_random_uuid(),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  main_doc_id UUID,
  title TEXT NOT NULL,
  creator_id UUID,
  modified_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE docs (
  id UUID NOT NULL DEFAULT public.gen_random_uuid(),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE,
  doc_set_id UUID NOT NULL REFERENCES doc_sets(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  modified_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

CREATE TABLE doc_relations (
  id UUID NOT NULL DEFAULT public.gen_random_uuid(),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE,
  doc_set_id UUID NOT NULL REFERENCES doc_sets(id) ON DELETE CASCADE,
  from_id UUID NOT NULL REFERENCES docs(id) ON DELETE CASCADE,
  to_id UUID NOT NULL REFERENCES docs(id) ON DELETE CASCADE,
  relation_type TEXT NOT NULL,
  context JSONB NOT NULL
);

CREATE TABLE doc_versions (
  id UUID NOT NULL DEFAULT public.gen_random_uuid(),
  created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp,
  updated TIMESTAMP WITH TIME ZONE,
  doc_id UUID NOT NULL REFERENCES docs(id) ON DELETE CASCADE,
  creator_id UUID,
  editor_user_ids UUID[] NOT NULL,
  is_draft BOOLEAN NOT NULL,
  locked_date TIMESTAMP WITH TIME ZONE,
  "data" JSONB NOT NULL
);

