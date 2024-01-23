import { EditoriaSchema } from 'wax-prosemirror-core'

const KotahiSchema = {
  marks: { ...EditoriaSchema.marks },
  nodes: {
    ...EditoriaSchema.nodes,
  },
}

// console.log(KotahiSchema)

export default KotahiSchema
