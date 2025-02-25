/* eslint-disable jest/expect-expect */
import { DashboardPage } from '../../page-object/dashboard-page'
import { ControlPage } from '../../page-object/control-page'
import { ManuscriptsPage } from '../../page-object/manuscripts-page'
import { SubmissionFormPage } from '../../page-object/submission-form-page'
import { dashboard } from '../../support/routes'

const decisionTextContent = 'Please fix Foo in the Paper!'
const decisionFileName = 'test-pdf.pdf'
const decisinFilePath = 'cypress/fixtures/test-pdf.pdf'

describe('Completing a review', () => {
  it('accept and do a review', () => {
    cy.task('restore', 'commons/bootstrap')
    cy.task('seed', 'three_reviews_completed') // restore the database as per dumps/three_reviews_completed.sql

    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.fixture('role_names').then(name => {
      /* Group Manager assigns Editor to manuscript */
      cy.login(name.role.admin, dashboard)
      // eslint-disable-next-line jest/valid-expect-in-promise
      DashboardPage.clickManuscriptNavButton()
      ManuscriptsPage.selectOptionWithText('Control')
      ControlPage.getAssignSeniorEditorDropdown().click({ force: true })
      cy.contains(name.role.seniorEditor).click({ force: true })

      /* Editor submits a decision */
      cy.login(name.role.seniorEditor, dashboard)
      DashboardPage.clickDashboardTab(2)
      DashboardPage.clickControl() // Navigate to Control Page
      ControlPage.clickDecisionTab(1)
      ControlPage.getPublishButton().should('be.disabled') // Verify publish button is disabled
      // Fill the decision form
      ControlPage.clickDecisionTextInput()
      ControlPage.getDecisionTextInput().type(decisionTextContent)
      cy.get('[data-testid="dropzone"]:first > input').selectFile(
        decisinFilePath,
        {
          force: true,
        },
      )
      ControlPage.clickRevise()
      ControlPage.clickSubmitDecisionButton() // Submit the decision
      ControlPage.checkSvgExists() // Check appears in front of button

      /* View Decision as an Author */
      cy.login(name.role.author, dashboard) // Login as an Author
      DashboardPage.getSubmittedManuscript().click() // Click on first MySubmission
      // Verify Decision Content
      DashboardPage.getDecisionField(0).should('contain', decisionTextContent)
      DashboardPage.getDecisionField(1).should('contain', decisionFileName)
      DashboardPage.getDecisionField(2).should('contain', 'Revise')
      DashboardPage.clickCreateNewVersionButton() // Create new manuscript version

      cy.getByDataTestId('submission.objectType').click()
      cy.contains('Dataset').click({ force: true })

      SubmissionFormPage.fillInField(
        'submission.$abstract',
        'New abstract...',
        true,
      )
      SubmissionFormPage.clickSubmitResearch()
      SubmissionFormPage.clickSubmitYourManuscript()
      DashboardPage.getSubmittedManuscript()
        .contains('test pdf')
        .should('exist') // Verify new submission got created

      /* Editor Workflow: Approve the new Manuscript version */
      cy.login(name.role.seniorEditor, dashboard)
      DashboardPage.clickDashboardTab(2)
      DashboardPage.clickControl() // Navigate to Control Page
      ControlPage.clickDecisionTab(1)
      ControlPage.getPublishButton().should('be.disabled') // Verify publish button is disabled
      ControlPage.getDecisionTextInput().type('Great Paper!')
      ControlPage.getDecisionFileInput().eq(0).selectFile(decisinFilePath, {
        force: true,
      })
      ControlPage.clickAccept()
      ControlPage.clickSubmitDecisionButton() // Submit the decision
      ControlPage.checkSvgExists()
      ControlPage.getPublishButton().should('not.be.disabled') // Verify publish button is not disabled */
    })
  })
})
