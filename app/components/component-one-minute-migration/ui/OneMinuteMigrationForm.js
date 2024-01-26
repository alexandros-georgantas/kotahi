import React, { useState } from 'react'
import propTypes from 'prop-types'
import Form from '@rjsf/core'
import { useTranslation } from 'react-i18next'

import {
  ActionButton,
  Container,
  HeadingWithAction,
  Heading,
  PaddedContent,
  SectionContent,
  WidthLimiter,
} from '../../shared'

const FieldTemplate = props => {
  const { classNames, description, children } = props
  return (
    <div className={classNames}>
      {description}
      {children}
    </div>
  )
}

const OneMinuteMigrationForm = ({
  disabled,
  formData,
  onIssnChange,
  onStartMigration,
}) => {
  const [loading, setLoading] = useState('')
  const { t } = useTranslation()

  const schema = {
    type: 'object',
    properties: {
      issn: {
        type: ['string', 'null'],
        description: t('oneMinuteMigrationPage.issnDescription'),
      },
    },
    required: ['issn'],
  }

  const handleSubmit = ({ formData: inputFormData }) => {
    setLoading('pending')
    onStartMigration(inputFormData)
      .then(() => setLoading('success'))
      .catch(e => setLoading('failure'))
  }

  return (
    <>
      <link
        crossOrigin="anonymous"
        href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css"
        integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
        rel="stylesheet"
      />
      <Container>
        <HeadingWithAction>
          <Heading>{t('oneMinuteMigrationPage.pageTitle')}</Heading>
        </HeadingWithAction>
        <WidthLimiter>
          <SectionContent>
            <PaddedContent>
              <Form
                // disabled={disabled}
                FieldTemplate={FieldTemplate}
                formData={formData}
                liveValidate
                noHtml5Validate
                onChange={onIssnChange}
                onSubmit={handleSubmit}
                schema={schema}
                //   uiSchema={uiSchema}
              >
                <ActionButton
                  disabled={disabled}
                  primary
                  status={loading}
                  type="submit"
                >
                  {t('oneMinuteMigrationPage.startMigration')}
                </ActionButton>
              </Form>
            </PaddedContent>
          </SectionContent>
        </WidthLimiter>
      </Container>
    </>
  )
}

OneMinuteMigrationForm.propTypes = {
  disabled: propTypes.bool,
  onIssnChange: propTypes.func.isRequired,
  onStartMigration: propTypes.func.isRequired,
}

OneMinuteMigrationForm.defaultProps = {
  disabled: false,
}

export default OneMinuteMigrationForm
