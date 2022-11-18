import { useQuery } from '@apollo/client'
import { throttle } from 'lodash'
import PropTypes from 'prop-types'
import React, { useCallback, useContext, useRef } from 'react'
import Modal from 'react-modal'
import {
  matchPath,
  Redirect,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom'
import styled from 'styled-components'
import { ConfigProvider } from './config/src'
import { JournalContext } from './xpub-journal/src'
import { XpubContext } from './xpub-with-context/src'

import FormBuilderPage from './component-formbuilder/src/components/FormBuilderPage'
import ManuscriptPage from './component-manuscript/src/components/ManuscriptPage'
import ManuscriptsPage from './component-manuscripts/src/ManuscriptsPage'
import ProductionPage from './component-production/src/components/ProductionPage'
import { Profile } from './component-profile/src'
import ReportPage from './component-reporting/src/ReportPage'
import DecisionPage from './component-review/src/components/DecisionPage'
import ReviewPage from './component-review/src/components/ReviewPage'
import ReviewPreviewPage from './component-review/src/components/ReviewPreviewPage'
import NewSubmissionPage from './component-submit/src/components/NewSubmissionPage'
import SubmitPage from './component-submit/src/components/SubmitPage'
import TasksTemplatePage from './component-task-manager/src/TasksTemplatePage'
import UsersManager from './component-users-manager/src/UsersManager'

import QUERY from './adminPageQueries'

import Menu from './Menu'
import { Spinner } from './shared'

import currentRolesVar from '../shared/currentRolesVar'
import DashboardEditsPage from './component-dashboard/src/components/DashboardEditsPage'
import DashboardLayout from './component-dashboard/src/components/DashboardLayout'
import DashboardReviewsPage from './component-dashboard/src/components/DashboardReviewsPage'
import DashboardSubmissionsPage from './component-dashboard/src/components/DashboardSubmissionsPage'
import RolesUpdater from './RolesUpdater'

const getParams = ({ routerPath, path }) => {
  return matchPath(routerPath, path).params
}

const Root = styled.div`
  display: grid;
  grid-template-areas: 'menu main';
  grid-template-columns: 200px auto;
  height: 100vh;
  max-height: 100vh;
  ${({ converting }) =>
    converting &&
    `
     button,
     a {
       pointer-events: none;
     }
  `};
  overflow: hidden;
  position: relative;
  z-index: 0;
`

// TODO: Redirect if token expires
const PrivateRoute = ({ component: Component, redirectLink, ...rest }) => {
  if (
    ['aperture', 'colab'].includes(process.env.INSTANCE_NAME) &&
    rest.currentUser &&
    !rest.currentUser.email
  ) {
    return <Redirect to="/kotahi/profile" />
  }

  return (
    <Route
      {...rest}
      render={props => {
        return localStorage.getItem('token') ? (
          <Component {...rest} {...props} />
        ) : (
          <Redirect to={redirectLink} />
        )
      }}
    />
  )
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  redirectLink: PropTypes.string.isRequired,
}

const updateStuff = data => {
  if (data?.currentUser) {
    // eslint-disable-next-line no-underscore-dangle
    return currentRolesVar(data.currentUser._currentRoles)
  }

  return false
}

const AdminPage = () => {
  Modal.setAppElement('#root')
  const history = useHistory()
  const journal = useContext(JournalContext)
  const [conversion] = useContext(XpubContext)

  const { loading, error, data, refetch } = useQuery(QUERY, {
    fetchPolicy: 'network-only',
    // TODO: useCallback used because of bug: https://github.com/apollographql/apollo-client/issues/6301
    onCompleted: useCallback(dataTemp => updateStuff(dataTemp), []),
  })

  const previousDataRef = useRef(null)

  // Do this to prevent polling-related flicker
  if (loading && !previousDataRef.current) {
    return <Spinner />
  }

  let notice = ''

  if (error) {
    if (error.networkError) {
      notice = 'You are offline.'
    } else {
      const redirectlocation = `/login`
      return <Redirect to={redirectlocation} />
    }
  }

  const currentUser = data?.currentUser
  journal.textStyles = data?.builtCss.css
  const hasAlert = data?.userHasTaskAlerts
  const config = JSON.parse(data?.config || '{}')

  previousDataRef.current = data

  const urlFrag = journal.metadata.toplevel_urlfragment
  const { pathname } = history.location
  const showLinks = pathname.match(/^\/(submit|manuscript)/g)
  let links = []
  const submissionFormBuilderLink = `${urlFrag}/admin/submission-form-builder`
  const reviewFormBuilderLink = `${urlFrag}/admin/review-form-builder`
  const decisionFormBuilderLink = `${urlFrag}/admin/decision-form-builder`
  const homeLink = `${urlFrag}/dashboard`
  const dashboardSubmissionsLink = `${urlFrag}/dashboard/submissions`
  const dashboardReviewsLink = `${urlFrag}/dashboard/reviews`
  const dashboardEditsLink = `${urlFrag}/dashboard/edits`
  const profileLink = `${urlFrag}/profile`
  const manuscriptsLink = `${urlFrag}/admin/manuscripts`
  const reportsLink = `${urlFrag}/admin/reports`
  const userAdminLink = `${urlFrag}/admin/users`
  const tasksTemplateLink = `${urlFrag}/admin/tasks`
  const loginLink = `/login?next=${homeLink}`
  const path = `${urlFrag}/versions/:version`
  const redirectLink = `/login?next=${homeLink}`

  if (showLinks) {
    const params = getParams(pathname, path)
    const baseLink = `${urlFrag}/versions/${params.version}`
    const submitLink = `${baseLink}/submit`
    const manuscriptLink = `${baseLink}/manuscript`

    links = showLinks
      ? [
          { link: submitLink, name: 'Summary Info' },
          { link: manuscriptLink, name: 'Manuscript' },
        ]
      : null
  }

  if (
    currentUser &&
    ['aperture', 'colab', 'ncrc'].includes(process.env.INSTANCE_NAME)
  ) {
    links.push({ link: homeLink, name: 'Dashboard', icon: 'home', hasAlert })
  }

  if (currentUser?.admin) {
    links.push({
      link: manuscriptsLink,
      name: 'Manuscripts',
      icon: 'file-text',
    })
    if (process.env.INSTANCE_NAME !== 'ncrc')
      links.push({ link: reportsLink, name: 'Reports', icon: 'activity' })
  }

  if (currentUser?.admin) {
    links.push({
      menu: 'Settings',
      name: 'Settings',
      icon: 'settings',
      links: [
        {
          menu: 'Forms',
          name: 'Forms',
          icon: 'check-square',
          links: [
            { link: submissionFormBuilderLink, name: 'Submission' },
            { link: reviewFormBuilderLink, name: 'Review' },
            { link: decisionFormBuilderLink, name: 'Decision' },
          ],
        },
        { link: tasksTemplateLink, name: 'Tasks', icon: 'list' },
        { link: userAdminLink, name: 'Users', icon: 'users' },
      ],
    })
  }

  const invitationId = window.localStorage.getItem('invitationId')
    ? window.localStorage.getItem('invitationId')
    : ''

  const dashboardRedirect = () =>
    invitationId ? (
      <Redirect to="/invitation/accepted" />
    ) : (
      // TODO: Default this to the user's saved last dashboard tab
      <Redirect to={dashboardSubmissionsLink} />
    )

  // Throttled refetch query `currentUser` once every 2mins
  const throttledRefetch = throttle(refetch, 120000, { trailing: false })

  // Triggered by captured events onClick and onKeyDown
  const handleEvent = e => {
    throttledRefetch()
  }

  return (
    <Root
      converting={conversion.converting}
      onClickCapture={handleEvent}
      onKeyDownCapture={handleEvent}
    >
      <ConfigProvider config={config}>
        <Menu
          brand={journal.metadata.name}
          brandLink={homeLink}
          className=""
          loginLink={loginLink}
          navLinkComponents={links}
          notice={notice}
          profileLink={profileLink}
          user={currentUser}
        />
        <Switch>
          <PrivateRoute
            component={Profile}
            exact
            path={profileLink}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={Profile}
            currentUser={currentUser}
            exact
            key="view-profile"
            path={`${urlFrag}/profile/:id`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            exact
            path={`${urlFrag}/dashboard/:path?`}
            redirectLink={redirectLink}
          >
            <DashboardLayout urlFrag={urlFrag}>
              <Switch>
                <PrivateRoute
                  component={dashboardRedirect}
                  currentUser={currentUser}
                  exact
                  path={homeLink}
                  redirectLink={redirectLink}
                />
                <PrivateRoute
                  component={DashboardSubmissionsPage}
                  currentUser={currentUser}
                  exact
                  path={dashboardSubmissionsLink}
                  redirectLink={redirectLink}
                />
                <PrivateRoute
                  component={DashboardReviewsPage}
                  currentUser={currentUser}
                  exact
                  path={dashboardReviewsLink}
                  redirectLink={redirectLink}
                />
                <PrivateRoute
                  component={DashboardEditsPage}
                  currentUser={currentUser}
                  exact
                  path={dashboardEditsLink}
                  redirectLink={redirectLink}
                />
              </Switch>
            </DashboardLayout>
          </PrivateRoute>
          <PrivateRoute
            component={NewSubmissionPage}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/newSubmission`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={SubmitPage}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/versions/:version/submit`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={ReviewPage}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/versions/:version/review`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={ReviewPreviewPage}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/versions/:version/reviewPreview`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={DecisionPage}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/versions/:version/decision`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={Profile}
            exact
            path={profileLink}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={Profile}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/profile/:id`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={NewSubmissionPage}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/newSubmission`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={SubmitPage}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/versions/:version/submit`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={ReviewPage}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/versions/:version/review`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={ReviewPreviewPage}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/versions/:version/reviewPreview`}
            redirectLink={redirectLink}
          />
          <PrivateRoute
            component={DecisionPage}
            currentUser={currentUser}
            exact
            path={`${urlFrag}/versions/:version/decision`}
            redirectLink={redirectLink}
          />

          {['elife', 'ncrc'].includes(process.env.INSTANCE_NAME) && (
            <PrivateRoute
              component={SubmitPage}
              exact
              path={`${urlFrag}/versions/:version/evaluation`}
              redirectLink={redirectLink}
            />
          )}
          {currentUser?.admin && [
            // We use array instead of <></> because of https://stackoverflow.com/a/68637108/6505513
            <PrivateRoute
              component={FormBuilderPage}
              currentUser={currentUser}
              exact
              key="form-builder"
              path={`${urlFrag}/admin/form-builder`}
              redirectLink={redirectLink}
            />,
            <PrivateRoute
              category="submission"
              component={FormBuilderPage}
              currentUser={currentUser}
              exact
              key="submission-form-builder"
              path={`${urlFrag}/admin/submission-form-builder`}
              redirectLink={redirectLink}
            />,
            <PrivateRoute
              category="review"
              component={FormBuilderPage}
              currentUser={currentUser}
              exact
              key="review-form-builder"
              path={`${urlFrag}/admin/review-form-builder`}
              redirectLink={redirectLink}
            />,
            <PrivateRoute
              category="decision"
              component={FormBuilderPage}
              currentUser={currentUser}
              exact
              key="decision-form-builder"
              path={`${urlFrag}/admin/decision-form-builder`}
              redirectLink={redirectLink}
            />,
            <PrivateRoute
              component={ManuscriptPage}
              currentUser={currentUser}
              exact
              key="manuscript"
              path={`${urlFrag}/versions/:version/manuscript`}
              redirectLink={redirectLink}
            />,
            <PrivateRoute
              component={UsersManager}
              currentUser={currentUser}
              key="users"
              path={`${urlFrag}/admin/users`}
              redirectLink={redirectLink}
            />,
            <PrivateRoute
              component={ManuscriptsPage}
              currentUser={currentUser}
              key="manuscripts"
              path={`${urlFrag}/admin/manuscripts`}
              redirectLink={redirectLink}
            />,
            <PrivateRoute
              component={ReportPage}
              currentUser={currentUser}
              key="reports"
              path={reportsLink}
              redirectLink={redirectLink}
            />,
            <PrivateRoute
              component={ProductionPage}
              currentUser={currentUser}
              key="production"
              path={`${urlFrag}/versions/:version/production`}
              redirectLink={redirectLink}
            />,
            <PrivateRoute
              component={TasksTemplatePage}
              key="tasks"
              path={`${urlFrag}/admin/tasks`}
              redirectLink={redirectLink}
            />,
          ]}
        </Switch>
        <RolesUpdater />
      </ConfigProvider>
    </Root>
  )
}

export default AdminPage
