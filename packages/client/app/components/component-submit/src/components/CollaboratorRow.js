import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Color from 'color'
import { Select } from '../../../shared'
import { color } from '../../../../theme'
import Image from '../../../component-avatar/src/image'

const StyledListItem = styled.div`
  width: 100%;
`

const getInitials = fullname => {
  const deconstructName = fullname.split(' ')
  const firstInitial = deconstructName[0][0].toUpperCase()

  const lastInitial =
    deconstructName.length > 1 &&
    deconstructName[deconstructName.length - 1][0].toUpperCase()

  return `${firstInitial}${lastInitial || ''}`
}

const UserRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const UserDetails = styled.div`
  display: flex;
  gap: 8px;
`

const AccessLabel = styled.span`
  padding: 0 12px;
`

const UserAvatar = styled.div`
  align-items: center;
  background-color: ${props => props.backgroundColour};
  border-radius: 50%;
  color: ${props => props.textColour};
  display: flex;
  font-size: 14px;
  font-weight: bold;
  height: 24px;
  justify-content: center;
  width: 24px;
`

const StyledSelect = styled(Select)`
  width: fit-content;
`

const CollaboratorRow = ({
  id,
  onChangeAccess,
  onRemoveAccess,
  role,
  status,
  teamId,
  canChangeAccess,
  user,
}) => {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const dropdownItems = [
    { value: 'read', label: t('collaborateForm.canView') },
    { value: 'write', label: t('collaborateForm.canEdit') },
    { value: 'remove', label: t('collaborateForm.removeAccess') },
  ]

  const { username, id: userId, profilePicture } = user
  const isAuthor = role === 'author'

  const placeholderAvatar = '/profiles/default_avatar.svg'

  const backgroundColour = color.brand2.base()
  let textColour

  try {
    textColour = Color(backgroundColour).isLight()
      ? color.text
      : color.textReverse
  } catch (e) {
    textColour = color.gray90
  }

  const customStyles = {
    control: provided => ({
      ...provided,
      border: 'none',
      borderRadius: 0,
      minHeight: 'unset',
      minWidth: '10em',
    }),
  }

  const handleChange = async ({ value }) => {
    setLoading(true)

    if (value === 'remove') {
      await onRemoveAccess({ teamId, userId })
    } else {
      await onChangeAccess({ teamMemberId: id, value })
    }

    setLoading(false)
  }

  return (
    <StyledListItem key={id}>
      <UserRow isAuthor={isAuthor}>
        <UserDetails>
          {profilePicture === placeholderAvatar ? (
            <UserAvatar
              backgroundColour={backgroundColour}
              textColour={textColour}
            >
              {getInitials(username)}
            </UserAvatar>
          ) : (
            <Image size={24} src={profilePicture} type="user" />
          )}
          <span>{username}</span>
        </UserDetails>
        {isAuthor ? (
          <AccessLabel>{t('collaborateForm.author')}</AccessLabel>
        ) : (
          <div>
            {canChangeAccess ? (
              <StyledSelect
                bordered={false}
                customStyles={customStyles}
                defaultValue={dropdownItems.find(v => v.value === status)}
                isLoading={loading}
                onChange={handleChange}
                options={dropdownItems}
              />
            ) : (
              <AccessLabel>
                {dropdownItems.find(v => v.value === status).label}
              </AccessLabel>
            )}
          </div>
        )}
      </UserRow>
    </StyledListItem>
  )
}

CollaboratorRow.propTypes = {
  id: PropTypes.string.isRequired,
  onChangeAccess: PropTypes.func.isRequired,
  onRemoveAccess: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
  status: PropTypes.string,
  teamId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  canChangeAccess: PropTypes.bool.isRequired,
}

CollaboratorRow.defaultProps = {
  status: '',
}

export default CollaboratorRow
