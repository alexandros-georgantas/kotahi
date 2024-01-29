import React from 'react'
import propTypes from 'prop-types'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { grid } from '@pubsweet/ui-toolkit'
import { ActionButton, Heading, Icon, Spinner, Title } from '../../shared'
import { color } from '../../../theme'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 128px 0;
  width: 100%;
`

const TopContentWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${grid(2)};
`

const StyledTitle = styled(Heading)`
  padding: 0 ${grid(4)};
  text-align: center;
`

const StyledPublisher = styled(Title)`
  padding: 0 ${grid(8)};
  text-align: center;
`

const MigrationLoadingScreen = ({
  hasError,
  issn,
  link,
  migrationComplete,
  migrationStatus,
  onTryAgain,
  publisher,
  title,
}) => {
  const { t } = useTranslation()

  const handleGoToJournal = () => {
    window.open(link, '_blank')
  }

  return (
    <Wrapper>
      <TopContentWrapper>
        <StyledTitle>
          {title ||
            `${t('oneMinuteMigrationPage.migratingJournal')} ${issn}...`}
        </StyledTitle>
        {publisher && !hasError && (
          <StyledPublisher>{publisher}</StyledPublisher>
        )}
      </TopContentWrapper>

      {hasError || migrationComplete ? (
        <Icon color={color.brand1.base} size={6}>
          {hasError ? 'alertTriangle' : 'check'}
        </Icon>
      ) : (
        <Spinner />
      )}

      {migrationComplete ? (
        <ActionButton onClick={handleGoToJournal} primary type="button">
          {t('oneMinuteMigrationPage.goToJournal')}
        </ActionButton>
      ) : (
        <>
          <Title>
            {migrationStatus ||
              `${t('oneMinuteMigrationPage.fetchingMetadata')}...`}
          </Title>
          {hasError && (
            <ActionButton onClick={onTryAgain} primary type="button">
              {t('oneMinuteMigrationPage.tryAgain')}
            </ActionButton>
          )}
        </>
      )}
    </Wrapper>
  )
}

MigrationLoadingScreen.propTypes = {
  hasError: propTypes.bool,
  issn: propTypes.string.isRequired,
  link: propTypes.string,
  migrationComplete: propTypes.bool,
  migrationStatus: propTypes.string,
  onTryAgain: propTypes.func.isRequired,
  publisher: propTypes.string,
  title: propTypes.string,
}

MigrationLoadingScreen.defaultProps = {
  hasError: false,
  link: '',
  migrationComplete: false,
  migrationStatus: null,
  publisher: null,
  title: null,
}

export default MigrationLoadingScreen
