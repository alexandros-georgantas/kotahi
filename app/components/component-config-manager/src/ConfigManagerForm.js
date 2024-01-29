/* eslint-disable react/jsx-handler-names */
/* eslint-disable no-underscore-dangle */
import React, { useMemo, useRef, useState } from 'react'
import Form from '@rjsf/core'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { generateSchemas, tabLabels } from './ui/schema' // Import the function that generates the schema and uiSchema

import {
  ActionButton,
  Container,
  HeadingWithAction,
  Heading,
  PaddedContent,
  SectionContent,
  Tab,
  TabsContainer,
} from '../../shared'
import { FlexRow } from '../../../globals'
import { color } from '../../../theme'

// #region Styleds
const SCROLLBAR_WIDTH = 8
const CONTENT_MARGIN = 6

const StyledContainer = styled(Container)`
  --tabs-border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const StyledSectionContent = styled(SectionContent)`
  border: var(--tabs-border);
  border-top-left-radius: 0;
  display: flex;
  height: 100%;
  margin-bottom: 1rem;
  margin-top: 0;
  overflow: hidden;
  position: relative;
  width: 100%;
  z-index: 3;

  &::before,
  &::after {
    --direction: to bottom;
    background-image: linear-gradient(
      var(--direction),
      #fff 5%,
      #ffffffba 40%,
      #fff1 90%,
      #fff0 100%
    );
    content: '';
    display: flex;
    height: 50px;
    pointer-events: none;
    position: absolute;
    width: calc(100% - ${SCROLLBAR_WIDTH + CONTENT_MARGIN}px);
    z-index: 99;
  }

  &:before {
    --direction: to bottom;
    top: ${CONTENT_MARGIN}px;
  }

  &:after {
    --direction: to top;
    bottom: ${CONTENT_MARGIN}px;
  }
`

const StyledPaddedContent = styled(PaddedContent)`
  display: ${p => (p.$active ? 'flex' : 'none')};
  margin: ${CONTENT_MARGIN}px;
  opacity: ${p => (p.$visible ? 1 : 0)};
  overflow-y: scroll;
  padding-bottom: 30px;
  padding-top: 30px;
  scrollbar-color: ${color.brand1.base}88;
  scrollbar-width: auto;
  transition: opacity 0.2s ease;
  width: 100%;

  ::-webkit-scrollbar {
    width: ${SCROLLBAR_WIDTH}px;
  }

  ::-webkit-scrollbar-track {
    background: #fff0;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${color.brand1.base}88;
    border-radius: 20px;
    margin: 0.2rem 0.2rem;
  }
`

const StyledFlexRow = styled(FlexRow)`
  align-items: flex-end;
`

const StyledHeading = styled(Heading)`
  padding: 0.5rem 0 1.5rem;
`

const StyledTabsContainer = styled(TabsContainer)`
  z-index: 4;
`

const StyledTab = styled(Tab)`
  --bgActive: linear-gradient(180deg, #fff 0%, #fff 100%);
  border: var(--tabs-border);
  border-bottom-color: ${p => (p.active ? '#0000' : '#0001')};
  display: flex;
  font-weight: bold;
  justify-content: center;
  margin-bottom: -1px;
  padding: 0.7rem 1.5rem 0.5rem;
  position: relative;
  transition: box-shadow 0.3s, border-color 0.2s;

  &:before {
    background-color: ${p => (p.active ? color.brand1.base : '#fff0')};
    bottom: 0;
    content: '';
    display: flex;
    height: 2px;
    position: absolute;
    transition: background-color 0.3s;
    width: calc(100% - 3rem);
  }
`

const InstanceTypeLegend = styled.legend`
  border: 0;
  border-bottom: 1px solid #e5e5e5;
  color: #333;
  display: block;
  font-size: 21px;
  line-height: inherit;
  margin-bottom: 20px;
  padding: 0;
  width: 100%;
`

const StyledActionButton = styled(ActionButton)`
  margin-right: 20px;
  width: 10%;
`

const ButtonWithNoStyle = styled.button`
  all: unset;
`

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 0.6rem;
`
// #endregion Styleds

const FieldTemplate = props => {
  const { classNames, description, children, showInstanceType, t } = props
  const currentFieldName = key => description._owner.key === key
  // eslint-disable-next-line no-nested-ternary
  return !showInstanceType ? (
    !currentFieldName('instanceName') ? (
      <div className={classNames}>
        {description}
        {children}
      </div>
    ) : (
      ''
    )
  ) : (
    <div className={classNames}>
      {!currentFieldName('instanceName') ? (
        description
      ) : (
        <InstanceTypeLegend>{t('configPage.Instance Type')}</InstanceTypeLegend>
      )}
      {children}
    </div>
  )
}

const ConfigManagerForm = ({
  configId,
  disabled,
  formData: passedFormData,
  deleteFile,
  createFile,
  config,
  liveValidate = true,
  omitExtraData = true,
  updateConfig,
  updateConfigStatus,
  emailTemplates,
}) => {
  const { t } = useTranslation()
  const [contentVisible, setContentVisible] = useState(true)
  const [tabKey, setTabKey] = useState('general')
  const logoAndFavicon = useRef({})
  const storedFormData = useRef(passedFormData)

  const schemas = useMemo(() => {
    const emailNotificationOptions = emailTemplates.map(template => {
      const emailOption = {
        const: template.id,
        title: template.emailContent.description,
      }

      return emailOption
    })

    // This will return first email template found of reviewer invitation type
    const defaultReviewerInvitationEmail = emailTemplates.find(
      emailTemplate => emailTemplate.emailTemplateType === 'reviewerInvitation',
    )

    // modifying the default reviewer invitation template into react json schema form structure
    const defaultReviewerInvitationTemplate = {
      const: defaultReviewerInvitationEmail.id,
      title: defaultReviewerInvitationEmail.emailContent.description,
    }

    // This will return first email template found of author proofing invitation type
    const defaultAuthorProofingInvitationEmail = emailTemplates.find(
      emailTemplate =>
        emailTemplate.emailTemplateType === 'authorProofingInvitation',
    )

    // modifying the default author proofing invitation template into react json schema form structure
    const defaultAuthorProofingInvitationTemplate = {
      const: defaultAuthorProofingInvitationEmail.id,
      title: defaultAuthorProofingInvitationEmail.emailContent.description,
    }

    // This will return first email template found of author proofing submitted type
    const defaultAuthorProofingSubmittedEmail = emailTemplates.find(
      emailTemplate =>
        emailTemplate.emailTemplateType === 'authorProofingSubmitted',
    )

    // modifying the default author proofing submitted template into react json schema form structure
    const defaultAuthorProofingSubmittedTemplate = {
      const: defaultAuthorProofingSubmittedEmail.id,
      title: defaultAuthorProofingSubmittedEmail.emailContent.description,
    }

    return generateSchemas(
      emailNotificationOptions,
      deleteFile,
      createFile,
      config,
      defaultReviewerInvitationTemplate,
      defaultAuthorProofingInvitationTemplate,
      defaultAuthorProofingSubmittedTemplate,
      t,
      logoAndFavicon,
    )
  }, [])

  const handlers = {
    form: {
      onChange: ({ formData }) => {
        const updatedData = {
          ...storedFormData.current,
          ...formData,
        }

        storedFormData.current = updatedData
      },
      onSubmit: () => {
        const toSubmit = storedFormData.current
        const logoid = logoAndFavicon.current?.logo?.id || null
        const faviconid = logoAndFavicon.current?.icon?.id || null

        logoid && (toSubmit.groupIdentity.logoId = logoid)
        faviconid && (toSubmit.groupIdentity.favicon = faviconid)

        return updateConfig(configId, toSubmit)
      },
    },

    tabs: key => ({
      onClick: e => {
        if (tabKey === key) return
        setContentVisible(false)
        setTimeout(() => {
          setTabKey(key)
          setContentVisible(true)
        }, 150)
      },
    }),
  }

  const forms = useMemo(
    () =>
      Object.keys(tabLabels).map(key => (
        <StyledPaddedContent
          $active={tabKey === key}
          $visible={contentVisible}
          key={key}
        >
          <StyledForm
            disabled={disabled}
            FieldTemplate={props => (
              <FieldTemplate
                showInstanceType={key === 'general'}
                t={t}
                {...props}
              />
            )}
            formData={storedFormData.current}
            liveValidate={liveValidate}
            noHtml5Validate
            omitExtraData={omitExtraData}
            onChange={handlers.form.onChange}
            schema={schemas.data[key]}
            uiSchema={schemas.ui[key]}
          >
            {/* to avoid default submit button display inside the form */}
            <hr />
          </StyledForm>
        </StyledPaddedContent>
      )),
    [tabKey, contentVisible],
  )

  return (
    <>
      <link
        crossOrigin="anonymous"
        href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css"
        integrity="sha384-HSMxcRTRxnN+Bdg0JdbxYKrThecOKuH5zCYotlSAcp1+c8xmyTe9GYg1l9a69psu"
        rel="stylesheet"
      />
      <StyledContainer>
        <HeadingWithAction>
          <StyledHeading>{t('configPage.Configuration')}</StyledHeading>
        </HeadingWithAction>
        <StyledFlexRow>
          {Object.entries(tabLabels).map(([k, v]) => (
            <StyledTabsContainer key={k}>
              <ButtonWithNoStyle type="submit" {...handlers.tabs(k)}>
                <StyledTab active={tabKey === k}>{v}</StyledTab>
              </ButtonWithNoStyle>
            </StyledTabsContainer>
          ))}
        </StyledFlexRow>
        <StyledSectionContent>{forms}</StyledSectionContent>
        <Footer>
          <StyledActionButton
            disabled={disabled}
            onClick={handlers.form.onSubmit}
            primary
            status={updateConfigStatus}
            type="submit"
          >
            {t('configPage.Submit')}
          </StyledActionButton>
        </Footer>
      </StyledContainer>
    </>
  )
}

export default ConfigManagerForm
