import React, { useContext, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { ConfigContext } from '../../config/src'
import { UPDATE_CONFIG } from '../../../queries'
import {
  createFileMutation,
  deleteFileMutation,
} from '../../component-cms-manager/src/queries'
import { CommsErrorBanner, Spinner } from '../../shared'
import ConfigManagerForm from './ConfigManagerForm'

const fileFields = `
  id
  name
  tags
  storedObjects {
    mimetype
    key
    url
    type
  }
`

const GET_CONFIG_AND_EMAIL_TEMPLATES = gql`
  query GetConfigAndEmailTemplates($id: ID!) {
    config(id: $id) {
      id
      formData
      active
      logo {
        ${fileFields}
      }
      
      icon {
        ${fileFields}
      }
      groupId
    }
    emailTemplates {
      id
      created
      updated
      emailTemplateType
      emailContent {
        cc
        subject
        body
        description
      }
    }
  }
`

const ConfigManagerPage = ({ match, ...props }) => {
  const config = useContext(ConfigContext)

  const [update] = useMutation(UPDATE_CONFIG, {
    refetchQueries: GET_CONFIG_AND_EMAIL_TEMPLATES,
  })

  const [createFile] = useMutation(createFileMutation)
  const [deleteFile] = useMutation(deleteFileMutation)
  const [updateConfigStatus, setUpdateConfigStatus] = useState(null)

  const [getConfig, { loading, error, data }] = useLazyQuery(
    GET_CONFIG_AND_EMAIL_TEMPLATES,
    {
      variables: { id: config?.id },
      fetchPolicy: 'network-only',
    },
  )

  useEffect(() => {
    getConfig()
  }, [config.id])

  if (loading && !data) return <Spinner />

  if (error) return <CommsErrorBanner error={error} />

  const updateConfig = async (configId, formData) => {
    setUpdateConfigStatus('pending')

    const response = await update({
      variables: {
        id: configId,
        input: {
          formData: JSON.stringify(formData),
          active: true,
        },
      },
    })

    setUpdateConfigStatus(response.data.updateConfig ? 'success' : 'failure')
    getConfig()
    return response
  }

  return data?.config ? (
    <ConfigManagerForm
      config={data.config}
      configId={data.config.id}
      createFile={createFile}
      deleteFile={deleteFile}
      disabled={!data.config.active}
      emailTemplates={data.emailTemplates}
      formData={JSON.parse(data.config.formData)}
      updateConfig={updateConfig}
      updateConfigStatus={updateConfigStatus}
    />
  ) : (
    <Spinner />
  )
}

export default ConfigManagerPage
