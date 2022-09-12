import React, { useState } from 'react'
import { th } from '@pubsweet/ui-toolkit'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { Icon } from 'wax-prosemirror-components'

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`

const Tabs = styled.div`
  background: #fff;
  display: flex;
  flex-direction: row;
  & > div:first-child {
    margin-top: 0;
  }
`

const activeTab = css`
  background: ${th('colorBackgroundTabs')};
  box-shadow: 0 0 1px ${th('colorPrimary')};
`

const disabledTab = css`
  display: none;
  cursor: not-allowed;
  opacity: 0.4;
`

const Tab = styled.div`
  cursor: pointer;
  margin: 0 4px 4px 4px;
  ${props => props.active && activeTab}
  ${props => props.disabled && disabledTab}

  padding: 8px;

  &:first-child {
    margin-top: 4px;
  }

  &:hover {
    background: ${th('colorBackgroundTabs')};
  }
`

const Content = styled.div`
  background: #fff;
  height: 100%;
  width: 100%;
`

const VerticalTabs = ({ tabList }) => {
  if (!tabList || tabList.length === 0) return null

  const [tabDisplay, setTabDisplay] = useState(tabList[0].id)

  return (
    <Wrapper>
      <Tabs>
        {tabList.map(tab => (
          <Tab
            active={tabDisplay === tab.id}
            disabled={tab.disabled}
            key={tab.id}
            onClick={() => {
              if (!tab.disabled) setTabDisplay(tab.id)
            }}
            title={tab.title}
          >
            <Icon name={tab.icon} />
          </Tab>
        ))}
      </Tabs>

      <Content>{tabList.find(tab => tabDisplay === tab.id).component}</Content>
    </Wrapper>
  )
}

VerticalTabs.propTypes = {
  tabList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      displayName: PropTypes.string,
      component: PropTypes.node,
    }),
  ).isRequired,
}

export default VerticalTabs
