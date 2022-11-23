import { useMutation, useQuery } from '@apollo/client'
import config from 'config'
import React, { useEffect } from 'react'
import { SectionContent, SectionHeader, Title } from '../../../shared'
import mutations from '../graphql/mutations'
import queries from '../graphql/queries'
import OwnerTable from './sections/OwnerTable'

const DashboardSubmissionsPage = () => {
  const instanceName = process.env.INSTANCE_NAME
  const urlFrag = config.journal.metadata.toplevel_urlfragment
  const wantedRoles = ['author']

  const query = useQuery(queries.dashboard, {
    fetchPolicy: 'cache-and-network',
    variables: { wantedRoles },
  })

  const [updateTab] = useMutation(mutations.updateTab)

  useEffect(() => {
    updateTab({
      variables: {
        tab: 'submissions',
      },
    })
  }, [])

  return !['ncrc'].includes(instanceName) ? (
    <SectionContent>
      <SectionHeader>
        <Title>My Submissions</Title>
      </SectionHeader>
      <OwnerTable query={query} urlFrag={urlFrag} />
    </SectionContent>
  ) : null
}

export default DashboardSubmissionsPage
