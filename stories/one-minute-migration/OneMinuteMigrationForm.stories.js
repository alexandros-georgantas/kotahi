/* eslint-disable no-console */
import React, { useState } from 'react'
import OneMinuteMigrationForm from '../../app/components/component-one-minute-migration/ui/OneMinuteMigrationForm'
import DesignEmbed from '../common/utils'

export const Base = args => {
  const [issn, setIssn] = useState(null)
  const [startMigrationDisabled, setStartMigrationDisabled] = useState(true)

  const handleIssnChange = ({ formData }) => {
    const { issn: issnValue } = formData

    console.log('issnValue:', issnValue)

    if (!issnValue || issnValue === '') {
      setIssn(null)
      setStartMigrationDisabled(true)
    } else {
      setIssn(issnValue)
      setStartMigrationDisabled(false)
    }
  }

  const handleStartMigration = async ({ issn: issnValue }) => {
    setStartMigrationDisabled(true)
    console.log(`Received ISSN: ${issnValue}`)
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 2500)
    })
  }

  return (
    <>
      {args.figmaEmbedLink && (
        <>
          <h2 style={{ color: '#333333' }}>Design</h2>
          <iframe
            allowFullScreen
            height={350}
            src={args.figmaEmbedLink}
            style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
            title="figma embed"
            width="100%"
          />
          <h2 style={{ color: '#333333' }}>Component</h2>
        </>
      )}

      <OneMinuteMigrationForm
        {...args}
        disabled={startMigrationDisabled}
        formData={{ issn }}
        onIssnChange={handleIssnChange}
        onStartMigration={handleStartMigration}
      />
    </>
  )
}

Base.args = {
  //   onStartMigration: handleStartMigration,
}

export default {
  title: 'OneMinuteMigration/OneMinuteMigrationForm',
  component: OneMinuteMigrationForm,
  parameters: {
    docs: {
      page: () => <DesignEmbed figmaEmbedLink="" />,
    },
  },
}
