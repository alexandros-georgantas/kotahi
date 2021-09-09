import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation, gql } from '@apollo/client'
import { set, debounce } from 'lodash'
import DecisionVersion from './DecisionVersion'

import {
  Spinner,
  VersionSwitcher,
  ErrorBoundary,
  Columns,
  Manuscript,
  Chat,
  CommsErrorBanner,
} from '../../../shared'

import gatherManuscriptVersions from '../../../../shared/manuscript_versions'

import MessageContainer from '../../../component-chat/src'

import { fragmentFields } from '../../../component-submit/src/userManuscriptFormQuery'

import { query } from './queries'

export const updateMutation = gql`
  mutation($id: ID!, $input: String) {
    updateManuscript(id: $id, input: $input) {
      id
      ${fragmentFields}
    }
  }
`

let debouncers = {}

const DecisionPage = ({ match }) => {
  const [confirming, setConfirming] = useState(false)

  // eslint-disable-next-line no-unused-vars
  const [manuscriptChangedFields, setManuscriptChangedFields] = useState({
    submission: {},
  })

  const toggleConfirming = () => {
    setConfirming(confirm => !confirm)
  }

  useEffect(() => {
    return () => {
      debouncers = {}
    }
  }, [])

  const { loading, error, data } = useQuery(query, {
    variables: {
      id: match.params.version,
    },
    // fetchPolicy: 'cache-and-network',
  })

  const [update] = useMutation(updateMutation)

  const updateManuscript = (versionId, manuscriptDelta) => {
    return update({
      variables: {
        id: versionId,
        input: JSON.stringify(manuscriptDelta),
      },
    })
  }

  const handleChange = (value, path, versionId) => {
    const manuscriptDelta = {} // Only the changed fields
    set(manuscriptDelta, path, value)
    setManuscriptChangedFields(s => {
      return {
        submission: {
          ...s.submission,
          ...manuscriptDelta.submission,
        },
      }
    })
    debouncers[path] = debouncers[path] || debounce(updateManuscript, 3000)
    return debouncers[path](versionId, manuscriptDelta)
  }

  if (loading) return <Spinner />
  if (error) return <CommsErrorBanner error={error} />

  const { manuscript, formForPurpose } = data

  const form = formForPurpose?.structure ?? {
    name: '',
    children: [],
    description: '',
    haspopup: 'false',
  }

  const versions = gatherManuscriptVersions(manuscript)

  // Protect if channels don't exist for whatever reason
  let editorialChannelId, allChannelId

  if (Array.isArray(manuscript.channels) && manuscript.channels.length) {
    editorialChannelId = manuscript.channels.find(c => c.type === 'editorial')
      .id
    allChannelId = manuscript.channels.find(c => c.type === 'all').id
  }

  const channels = [
    { id: allChannelId, name: 'Discussion with author' },
    { id: editorialChannelId, name: 'Editorial discussion' },
  ]

  return (
    <Columns>
      <Manuscript>
        <ErrorBoundary>
          <VersionSwitcher>
            {versions.map((version, index) => (
              <DecisionVersion
                confirming={confirming}
                current={index === 0}
                form={form}
                key={version.manuscript.id}
                match={match}
                onChange={handleChange}
                onSubmit={(x, y) => {
                  // I don't think we're actually using this.
                  // console.log(`onSubmit called! `, x, y, z)
                }}
                parent={manuscript}
                republish={(x, y) => {
                  // are we actually using this?
                  // console.log(`republish called! `, x, y, z)
                }}
                toggleConfirming={toggleConfirming}
                updateManuscript={updateManuscript}
                version={version.manuscript}
              />
            ))}
          </VersionSwitcher>
        </ErrorBoundary>
      </Manuscript>
      <Chat>
        <MessageContainer channels={channels} />
      </Chat>
    </Columns>
  )
}

DecisionPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      version: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
}

export default DecisionPage
