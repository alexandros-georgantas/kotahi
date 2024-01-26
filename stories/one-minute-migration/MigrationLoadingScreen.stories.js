import React, { useState } from 'react'
import propTypes from 'prop-types'
import MigrationLoadingScreen from '../../app/components/component-one-minute-migration/ui/MigrationLoadingScreen'
import DesignEmbed from '../common/utils'

export const Base = ({ hasError, ...args }) => {
  const [title, setTitle] = useState(null)
  const [publisher, setPublisher] = useState(null)
  const [migrationStatus, setMigrationStatus] = useState(null)
  const [migrationComplete, setMigrationComplete] = useState(false)

  const issn = '1234-5678'

  const migrate = () => {
    setTimeout(() => {
      setTitle('Journal of Kotahi')
      setPublisher('Coko University Press')
      setMigrationStatus('Saving metadata...')
    }, 1 * 2500)

    setTimeout(() => {
      setMigrationStatus('Generating meta data files and folders...')
    }, 2 * 2500)
    setTimeout(() => {
      setMigrationStatus('Sorting journal per volumes and issues...')
    }, 3 * 2500)
    setTimeout(() => {
      setMigrationStatus('Trying to find the logo from the menu page...')
    }, 4 * 2500)
    setTimeout(() => {
      setMigrationStatus('Trying to find the about page...')
    }, 5 * 2500)
    setTimeout(() => {
      setMigrationStatus('Trying to find the team page...')
    }, 6 * 2500)
    setTimeout(() => {
      setMigrationComplete(true)
      setMigrationStatus('Migration complete')
    }, 7 * 2500)
  }

  const migrateWithError = () => {
    setTimeout(() => {
      setTitle('Error')
      setMigrationStatus('Failed to find journal')
    }, 2500)
  }

  hasError ? migrateWithError() : migrate()

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

      <MigrationLoadingScreen
        {...args}
        issn={issn}
        migrationComplete={migrationComplete}
        migrationStatus={migrationStatus}
        publisher={publisher}
        title={title}
      />
    </>
  )
}

Base.propTypes = {
  hasError: propTypes.bool,
}

Base.defaultProps = {
  hasError: false,
}

export const Error = Base.bind()

Error.args = {
  hasError: true,
}

export default {
  title: 'OneMinuteMigration/LoadingScreen',
  component: MigrationLoadingScreen,
  parameters: {
    docs: {
      page: () => <DesignEmbed figmaEmbedLink="" />,
    },
  },
}
