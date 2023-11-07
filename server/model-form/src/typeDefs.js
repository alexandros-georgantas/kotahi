const typeDefs = `
  input FormInput {
    id: ID!
    created: DateTime
    updated: DateTime
    isActive: Boolean
    isDefault: Boolean
    structure: FormStructureInput!
    category: String!
    groupId: ID!
  }

  input CreateFormInput {
    created: DateTime
    isActive: Boolean!,
    isDefault: Boolean!,
    structure: FormStructureInput!
    category: String!
    groupId: ID!
  }

  input FormStructureInput {
    name: String!
    purpose: String!
    description: String
    haspopup: String!
    popuptitle: String
    popupdescription: String
    children: JSON!
  }

  type Form {
    id: ID!
    created: DateTime!
    updated: DateTime
    isActive: Boolean!
    isDefault: Boolean!
    structure: FormStructure!
    category: String!
    groupId: ID
  }

  type FormStructure {
    name: String
    purpose: String
    description: String
    haspopup: String!
    popuptitle: String
    popupdescription: String
    children: JSON!
  }

  type SubmissionFormUseCount {
    purpose: String!
    manuscriptsCount: Int!
  }

  extend type Query {
    form(formId: ID!): Form
    allFormsInCategory(category: String!, groupId: ID!): [Form!]!
    activeFormInCategory(category: String!, groupId: ID!): Form
    activeFormsInCategory(category: String!, groupId: ID!): [Form!]!
    submissionFormUseCounts(groupId: ID!): [SubmissionFormUseCount!]!
  }

  extend type Mutation {
    createForm(form: CreateFormInput!): Form!
    updateForm(form: FormInput!): Form!
    updateFormElement(element: JSON!, formId: ID!, parentElementId: ID): Form!
    deleteFormElement(formId: ID!, elementId: ID!): Form
    deleteForm(formId: ID!): Boolean
  }
`

module.exports = typeDefs
