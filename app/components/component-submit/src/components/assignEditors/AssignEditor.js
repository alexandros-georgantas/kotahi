import React, { useEffect, useState } from 'react'
import config from 'config'
import { get } from 'lodash'
import { gql, useQuery, useMutation } from '@apollo/client'
import PropTypes from 'prop-types'
import { Select } from '../../../../shared'
import {
  CREATE_TEAM_MUTATION,
  UPDATE_TEAM_MUTATION,
} from '../../../../../queries'

const editorOption = user => ({
  label: user.defaultIdentity?.name || user.email || user.username,
  value: user.id,
})

const query = gql`
  {
    users {
      id
      username
      email
      admin
      defaultIdentity {
        id
        name
      }
    }
  }
`

// TODO Instead use ../../../../component-review/src/components/assignEditors/AssignEditor.js and delete this file
const AssignEditor = ({ teamRole, manuscript }) => {
  const [team, setTeam] = useState([])
  const [teams, setTeams] = useState([])
  const [selectedEditor, setSelectedEditor] = useState(undefined)
  const [members, setMembers] = useState([])

  useEffect(() => {
    setTeam((manuscript.teams || []).find(t => t.role === teamRole) || {})
    setTeams(manuscript.teams || [])
  }, [manuscript])

  useEffect(() => {
    setTeam(teams.find(t => t.role === teamRole) || {})
  }, [teams])

  useEffect(() => {
    setMembers(team.members || [])
  }, [team])

  useEffect(() => {
    setSelectedEditor(members.length > 0 ? members[0].user.id : undefined)
  }, [members])

  useEffect(() => {
    if (selectedEditor) {
      if (teams.find(t => t.role === teamRole)) {
        updateTeam({
          variables: {
            id: team.id,
            input: {
              members: [{ user: { id: selectedEditor } }],
            },
          },
        })
      } else {
        const editor = teamRole === 'editor' ? 'Editor' : 'Handling Editor'

        const input = {
          // Editors are always linked to the parent manuscript
          manuscriptId: manuscript.id,
          name: teamRole === 'seniorEditor' ? 'Senior Editor' : editor,
          role: teamRole,
          members: [{ user: { id: selectedEditor } }],
        }

        createTeam({
          variables: {
            input,
          },
        }).then(({ data }) => {
          setTeams([
            ...teams,
            {
              id: data.createTeam.id,
              role: teamRole,
              members: [{ user: { id: selectedEditor } }],
            },
          ])
        })
      }
    }
  }, [selectedEditor])

  const teamName = get(config, `teams.${teamRole}.name`)

  const { data, loading, error } = useQuery(query)

  const [updateTeam] = useMutation(UPDATE_TEAM_MUTATION)
  const [createTeam] = useMutation(CREATE_TEAM_MUTATION)

  if (loading || error) {
    return null
  }

  const options = (data.users || []).map(user => editorOption(user))

  return (
    <Select
      aria-label={`Assign ${teamRole}`}
      data-testid={`assign${teamRole}`}
      label={teamName}
      onChange={selected => setSelectedEditor(selected.value)}
      options={options}
      placeholder={`Assign ${teamName}…`}
      value={selectedEditor}
    />
  )
}

AssignEditor.propTypes = {
  teamRole: PropTypes.string.isRequired,
  manuscript: PropTypes.shape({
    id: PropTypes.string.isRequired,
    teams: PropTypes.arrayOf(
      PropTypes.shape({
        role: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
}

export default AssignEditor
