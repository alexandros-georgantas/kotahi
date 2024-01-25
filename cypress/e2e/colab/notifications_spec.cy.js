/* eslint-disable jest/no-commented-out-tests */
/* eslint-disable prettier/prettier,jest/valid-expect-in-promise */
/* eslint-disable jest/expect-expect */

import { dashboard } from '../../support/routes1'
import { ManuscriptsPage } from '../../page-object/manuscripts-page'
import { Menu } from '../../page-object/page-component/menu'
import { DashboardPage } from '../../page-object/dashboard-page'
import { ControlPage } from '../../page-object/control-page'

describe('notifications tests', () => {
  beforeEach(() => {
    // task to restore the database as per the dumps/initial_state_other.sql
    cy.task('restore', 'commons/colab_bootstrap')
    cy.task('seed', 'submission_complete')
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.fixture('role_names').then(name => {
      cy.login(name.role.admin, dashboard)
    })
    cy.awaitDisappearSpinner()
    DashboardPage.getHeader().should('be.visible')
  })

  context('sent notification via control panel', () => {
    beforeEach(() => {
      Menu.clickManuscriptsAndAssertPageLoad()
      ManuscriptsPage.selectOptionWithText('Control')
      cy.awaitDisappearSpinner()
    })
    it('sent notification to user from notification tab', () => {
      ControlPage.clickDecisionTab(4)
      cy.get('[data-testid="choose-receiver"]').click()
      cy.get(
        '[data-testid="choose-receiver"] > div > div > input',
      ).type('Elaine{enter}', { force: true })
      cy.get('[data-testid="Notification_email_select"]').click()
      cy.get(
        '[data-testid="Notification_email_select"] > div > div > input',
      ).type('Invitation{enter}', { force: true })
      cy.contains('Notify').click()
      cy.get('[class*=LabelOnlySpan]:last').click()
      cy.contains('Invitation sent by Sinead Sullivan to Elaine Barnes')
    })
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('sent notification to unregistered user', () => {
      ControlPage.clickDecisionTab(4)
      cy.get('[title="Add a new task"]').click()
      cy.get('[class*="TextInput__StyledInput"]:last').type(
        'First task for unregistered user',
      )
      cy.get('[data-testid="Assignee_select"]').type('Unregistered User{enter}')
      cy.get('[data-cy="new-user-email"]')
        .focus()
        .type('uku.sidorela@gmail.com')
      cy.get('[data-cy="new-user-name"]').type('QA tester')
      // cy.contains('Unregistered User').click({ force: true})
      // cy.get('#react-select-12-option-0-0').click({ force: true })
      cy.get('[class*=MinimalButton]').click()
      cy.get('[class*=Task__EditLabel]').click()
    })
    it('sent notification 3 notifications via task details modal', () => {
      ControlPage.clickDecisionTab(4)
      cy.get('[title="Add a new task"]').click()
      cy.get('[class*="TextInput__StyledInput"]:last').type(
        'First task for unregistered user',
      )
      cy.get('[data-testid="Assignee_select"]').type('Reviewer{enter}')
      cy.get('[class*=MinimalButton]').click()
      cy.get('[class*=Task__EditLabel]').click()
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(200)
      cy.get('[class*=SecondaryActionButton__LabelOnlySpan]').click({
        force: true,
      })
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(50)
      cy.get('[data-testid="Recipient_select"]').type('Joane Pilger{enter}')
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(20)
      cy.get('[data-testid="Notification_email_select"]:last').click()
      cy.get(
        '[data-testid="Notification_email_select"] > div > div > input:last',
      ).type('Reviewer{enter}', { force: true })
      cy.contains('Send Now').click()
      cy.get('[class*=TaskEditModal__NotificationLogsToggle]').click()
      cy.contains('Reviewer Invitation sent by Sinead Sullivan to Joane Pilger')

      cy.get('[class*=SecondaryActionButton__LabelOnlySpan]:last').click({
        force: true,
      })
      cy.get('[data-testid="Recipient_select"]:last').type(
        'Sherry Crofoot{enter}',
      )
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(20)
      cy.get('[data-testid="Notification_email_select"]:last').click()
      cy.get(
        '[data-testid="Notification_email_select"] > div > div > input:last',
      ).type('Author{enter}', { force: true })
      cy.get('[class*=SecondaryActionButton__Button]:nth(1)').click()
      // cy.get('[class*=TaskEditModal__NotificationLogsToggle]').click()
      cy.contains('Author Invitation sent by Sinead Sullivan to Sherry Crofoot')

      cy.get('[class*=SecondaryActionButton__LabelOnlySpan]:last').click({
        force: true,
      })
      cy.get('[data-testid="Recipient_select"]:last').type('Gale Davis{enter}')
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(20)
      cy.get('[data-testid="Notification_email_select"]:last').click()
      cy.get(
        '[data-testid="Notification_email_select"] > div > div > input:last',
      ).type('Task{enter}', { force: true })
      cy.get('[class*=SecondaryActionButton__Button]:nth(2)').click()
      // cy.get('[class*=TaskEditModal__NotificationLogsToggle]').click()
      cy.contains('Task notification sent by Sinead Sullivan to Gale Davis')
      cy.get('[class*=ActionButton__BaseButton]:last').click()
    })
  })
})
