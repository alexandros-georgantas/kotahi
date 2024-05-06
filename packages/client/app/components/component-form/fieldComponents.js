import React from 'react'
import styled from 'styled-components'
import { RadioGroup } from '@pubsweet/ui'
import {
  Select,
  FilesUpload,
  TextInput,
  CheckboxGroup,
  RichTextEditor,
} from '../shared'
import AuthorsInput from '../component-submit/src/components/AuthorsInput'
import LinksInput from '../component-submit/src/components/LinksInput'
import ThreadedDiscussion from '../component-formbuilder/src/components/builderComponents/ThreadedDiscussion/ThreadedDiscussion'

const VisualAbstract = props => (
  <FilesUpload acceptMultiple={false} mimeTypesToAccept="image/*" {...props} />
)

const SafeRadioGroup = styled(RadioGroup)`
  position: relative;
`

/** Definitions for available field types */
const fieldComponents = {
  Title: TextInput,
  Authors: AuthorsInput,
  Abstract: RichTextEditor,
  Keywords: TextInput,
  TextField: TextInput,
  AbstractEditor: RichTextEditor,
  RadioGroup: SafeRadioGroup,
  CheckboxGroup,
  AuthorsInput,
  Select,
  LinksInput,
  ThreadedDiscussion,
  SupplementaryFiles: FilesUpload,
  VisualAbstract,
}

export default fieldComponents
