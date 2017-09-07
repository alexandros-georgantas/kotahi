import React from 'react'
import { FormSection } from 'redux-form'
import { AbstractEditor, TitleEditor } from 'xpub-edit'
import { CheckboxGroup, Menu, TextField, ValidatedField } from 'xpub-ui'
import { withJournal } from 'xpub-journal'
import classes from './Metadata.local.scss'
import { join, required, minChars, maxChars, minSize, split } from '../lib/validators'

const Metadata = ({ journal }) => (
  <FormSection name="metadata">
    <div className={classes.section} id="metadata.title">
      <ValidatedField
        name="title"
        required
        validate={[minChars(20), maxChars(500)]}
        component={input =>
          <TitleEditor
            placeholder="Enter the title…"
            title="Title"
            {...input}/>
        }/>
    </div>

    <div className={classes.section} id="metadata.abstract">
      <ValidatedField
        name="abstract"
        required
        validate={[minChars(100), maxChars(5000)]}
        component={input =>
          <AbstractEditor
            title="Abstract"
            placeholder="Enter the abstract…"
            {...input}/>
        }/>
    </div>

    <div className={classes.section} id="metadata.authors">
      <div className={classes.label}>Authors</div>

      <ValidatedField
        name="authors"
        required
        format={join()}
        parse={split()}
        validate={[minSize(1)]}
        component={input =>
          <TextField
            placeholder="Enter author names…"
            {...input}/>
        }/>
    </div>

    <div className={classes.section} id="metadata.keywords">
      <div className={classes.label}>Keywords</div>

      <ValidatedField
        name="keywords"
        required
        format={join()}
        parse={split()}
        validate={[minSize(1)]}
        component={input =>
          <TextField
            placeholder="Enter keywords…"
            {...input}/>
        }/>
    </div>

    <div className={classes.section} id="metadata.articleType">
      <div className={classes.label}>Type of article</div>

      <ValidatedField
        name="articleType"
        required
        validate={[required, minSize(1)]}
        component={input =>
          <Menu
            options={journal.articleTypes}
            {...input}/>
        }/>
    </div>

    <div className={classes.section} id="metadata.articleSection">
      <div className={classes.label}>Section</div>

      <ValidatedField
        name="articleSection"
        required
        validate={[required, minSize(1)]}
        component={input =>
          <CheckboxGroup
            options={journal.articleSections}
            {...input}/>
        }/>
    </div>
  </FormSection>
)

export default withJournal(Metadata)
