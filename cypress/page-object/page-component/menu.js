/// <reference types="Cypress" />
import { DashboardPage } from '../dashboard-page'
import { ManuscriptsPage } from '../manuscripts-page'

/**
 * Page component which represents the left side menu bar,
 * which contains the Logged User, Dashboard & My profile options (for non-admin users),
 * as well as the Forms, Users, Manuscripts options for admin users.
 * These options are available on all other pages.
 */
const MENU_BUTTON = 'Menu__Item'
const USER_BUTTON = 'Menu__UserItem'
const BACKGROUND = 'Menu__Root'
const MESSAGE_NOT_AUTHORISED = 'AdminPage__Root'

export const Menu = {
  getDashboardButton() {
    return cy.getByContainsClass(MENU_BUTTON).contains('Dashboard')
  },
  clickDashboard() {
    this.getDashboardButton().click()
  },
  clickDashboardAndVerifyPageLoaded() {
    this.getDashboardButton().click()
    cy.awaitDisappearSpinner()
    DashboardPage.getHeader().should('contain', 'Dashboard')
  },
  getFormsButton() {
    return cy.getByContainsClass(MENU_BUTTON).contains('Forms')
  },
  clickForms() {
    this.getFormsButton().click()
  },
  getUsersButton() {
    return cy.getByContainsClass(MENU_BUTTON).contains('Users')
  },
  clickUsers() {
    this.getUsersButton().click()
  },
  getManuscriptsButton() {
    return cy.getByContainsClass(MENU_BUTTON).contains('Manuscripts')
  },
  clickManuscripts() {
    this.getManuscriptsButton().click()
  },
  clickManuscriptsAndAssertPageLoad() {
    this.clickManuscripts()
    cy.awaitDisappearSpinner()
    ManuscriptsPage.getTableHeader().should('be.visible')
  },
  getMyProfileButton() {
    return cy.getByContainsClass(MENU_BUTTON).contains('My profile')
  },
  clickMyProfile() {
    this.getMyProfileButton().click()
  },
  getLoggedUserButton() {
    return cy.getByContainsClass(USER_BUTTON)
  },
  clickLoggedUser() {
    this.getLoggedUserButton().click()
  },
  getBackground() {
    return cy.getByContainsClass(BACKGROUND)
  },
  getMessageNotAuthorisedUser() {
    return cy.getByContainsClass(MESSAGE_NOT_AUTHORISED)
  },
}
export default Menu
