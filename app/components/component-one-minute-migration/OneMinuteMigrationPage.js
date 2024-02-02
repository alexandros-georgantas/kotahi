import React, { useState } from 'react'
import { gql, useMutation, useSubscription } from '@apollo/client'
import { t } from 'i18next'
import OneMinuteMigrationForm from './ui/OneMinuteMigrationForm'
import MigrationLoadingScreen from './ui/MigrationLoadingScreen'

const START_MIGRATION = gql`
  mutation StartMigration($issn: String!) {
    startOneMinuteMigration(issn: $issn)
  }
`

const MIGRATION_STATUS_UPDATE = gql`
  subscription MigrationStatusUpdate($groupId: ID!) {
    migrationStatusUpdate(groupId: $groupId)
  }
`

const MIGRATION_TITLE_AND_PUBLISHER = gql`
  subscription MigrationTitleAndPublisher($groupId: ID!) {
    migrationTitleAndPublisher(groupId: $groupId) {
      title
      publisher
    }
  }
`

const link = `${process.env.FLAX_SITE_URL}/journal/`

const OneMinuteMigrationPage = props => {
  const [issn, setIssn] = useState(null)
  const [startMigrationDisabled, setStartMigrationDisabled] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [title, setTitle] = useState(null)
  const [publisher, setPublisher] = useState(null)
  const [migrationStatus, setMigrationStatus] = useState(null)
  const [migrationComplete, setMigrationComplete] = useState(false)
  const [hasError, setHasError] = useState(false)

  const [startMigrationMutation] = useMutation(START_MIGRATION)

  useSubscription(MIGRATION_STATUS_UPDATE, {
    variables: {
      groupId: localStorage.getItem('groupId'),
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const { migrationStatusUpdate } = subscriptionData.data

      setMigrationStatus(t(`oneMinuteMigrationPage.${migrationStatusUpdate}`))
    },
  })

  useSubscription(MIGRATION_TITLE_AND_PUBLISHER, {
    variables: {
      groupId: localStorage.getItem('groupId'),
    },
    onSubscriptionData: ({ subscriptionData }) => {
      const { migrationTitleAndPublisher } = subscriptionData.data

      setTitle(migrationTitleAndPublisher.title)
      setPublisher(migrationTitleAndPublisher.publisher)
    },
  })

  const handleTryAgain = () => {
    setIssn(null)
    setStartMigrationDisabled(true)
    setSubmitted(false)
    setTitle(null)
    setPublisher(null)
    setMigrationStatus(null)
    setMigrationComplete(false)
    setHasError(false)
  }

  const handleIssnChange = ({ formData }) => {
    const { issn: issnValue } = formData

    if (!issnValue || issnValue === '') {
      setIssn(null)
      setStartMigrationDisabled(true)
    } else {
      setIssn(issnValue)
      setStartMigrationDisabled(false)
    }
  }

  const handleStartMigration = async () => {
    setSubmitted(true)
    startMigrationMutation({ variables: { issn } })
      .then(res => {
        setMigrationComplete(true)
      })
      .catch(error => {
        console.error('migration error:', error.message)

        if (error.message === '404') {
          setPublisher(t('oneMinuteMigrationPage.notFound'))
        }

        setTitle(t('oneMinuteMigrationPage.error'))
        setMigrationStatus(t('oneMinuteMigrationPage.checkIssn'))
        setHasError(true)
      })
  }

  return submitted ? (
    <MigrationLoadingScreen
      hasError={hasError}
      issn={issn}
      link={link}
      migrationComplete={migrationComplete}
      migrationStatus={migrationStatus}
      onTryAgain={handleTryAgain}
      publisher={publisher}
      title={title}
    />
  ) : (
    <OneMinuteMigrationForm
      disabled={startMigrationDisabled}
      formData={{ issn }}
      onIssnChange={handleIssnChange}
      onStartMigration={handleStartMigration}
    />
  )
}

export default OneMinuteMigrationPage
