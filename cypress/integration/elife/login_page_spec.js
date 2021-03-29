import { Menu } from '../../page-object/page-component/menu'
import { LoginPage } from '../../page-object/login-page'
import { manuscripts, login } from '../../support/routes'
import { ManuscriptsPage } from '../../page-object/manuscripts-page'

describe('Login page tests', () => {
  it('page should display eLife branding settings', () => {
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.fixture('branding_settings').then(settings => {
      cy.visit(login)

      // assert settings are specific to eLife instance
      LoginPage.getBackground()
        .should('have.css', 'background')
        .and('contains', settings.elife.primaryColor)
      LoginPage.getLogo()
        .should('have.attr', 'alt')
        .and('eq', settings.elife.brandName)
      LoginPage.getLogo()
        .should('have.attr', 'src')
        .and('eq', settings.elife.logoPath)
      LoginPage.getLoginButton()
        .should('have.css', 'background')
        .and('contains', settings.elife.primaryColor)
    })
  })

  it('branding settings should be visible after login', () => {
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.fixture('branding_settings').then(settings => {
      // task to restore the database as per the  dumps/initialState.sql
      cy.task('restore', 'initialState')

      // login as admin
      // eslint-disable-next-line jest/valid-expect-in-promise
      cy.fixture('role_names').then(name => {
        cy.login(name.role.admin, manuscripts)
      })

      Menu.getBackground()
        .should('have.css', 'background')
        .and('contains', settings.elife.primaryColor)

      ManuscriptsPage.getCreatedCaret(0)
        .should('have.css', 'color')
        .and('eq', settings.elife.primaryColor)
      ManuscriptsPage.getCreatedCaret(1)
        .should('have.css', 'color')
        .and('eq', settings.elife.primaryColor)
      ManuscriptsPage.getSubmitButton()
        .should('have.css', 'background')
        .should('contain', settings.elife.primaryColor)
    })
  })

  it('dashboard page should not be visible to the logged in user', () => {
    // task to restore the database as per the  dumps/initialState.sql
    cy.task('restore', 'initialState')

    // login as admin
    // eslint-disable-next-line jest/valid-expect-in-promise
    cy.fixture('role_names').then(name => {
      cy.login(name.role.admin, manuscripts)
    })

    Menu.getDashboardButton().should('not.exist')
  })
})
