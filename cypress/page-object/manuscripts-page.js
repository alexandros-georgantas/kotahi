/// <reference types="Cypress" />
/**
 * Page component representing the fourth option in the left side menu,
 * where users can see the list of submitted manuscripts & select Control,
 * View or Delete.
 */
const MANUSCRIPTS_OPTIONS_LIST = '[class*=style__UserAction]'
const BUTTON = 'button'
const MANUSCRIPTS_PAGE_TITLE = '[class*=General__Heading-sc]'
const EVALUATION_BUTTON = '[href*=evaluation]'
const CONTROL_BUTTON = '[href*=control]'
const CREATED_CARET = 'Carets__Caret'
const AUTHOR_FIELD = 'UserCombo__Primary'
const STATUS_FIELD = 'Badge__Status'
const MANUSCRIPTS_TABLE_HEAD = '[class*=Table__Header] > tr >th'
const ARTICLE_ID = '[class*=Table__Row]>td:nth-child(1)'

export const ManuscriptsPage = {
  getManuscriptsOptionsList() {
    return cy.get(MANUSCRIPTS_OPTIONS_LIST)
  },
  selectOptionWithText(text) {
    this.getManuscriptsOptionsList().contains(text).click()
  },
  getOptionWithText(text) {
    return this.getManuscriptsOptionsList().contains(text)
  },
  getSubmitButton() {
    return cy.get(BUTTON).contains('New submission')
  },
  clickSubmit() {
    this.getSubmitButton().click()
  },
  getManuscriptsPageTitle() {
    return cy.get(MANUSCRIPTS_PAGE_TITLE)
  },
  getEvaluationButton() {
    return cy.get(EVALUATION_BUTTON)
  },
  clickEvaluation() {
    this.getEvaluationButton().click()
  },
  getControlButton() {
    return cy.get(CONTROL_BUTTON)
  },
  getCreatedCaret(nth) {
    return cy.getByContainsClass(CREATED_CARET).eq(nth)
  },
  getAuthorField(nth) {
    return cy.getByContainsClass(AUTHOR_FIELD).eq(nth)
  },
  getAuthor(nth) {
    return this.getAuthorField(nth).invoke('text')
  },
  getStatusField(nth) {
    return cy.getByContainsClass(STATUS_FIELD).eq(nth)
  },
  getStatus(nth) {
    return this.getStatusField(nth).invoke('text')
  },
  getTabelHead(nth) {
    return cy.get(MANUSCRIPTS_TABLE_HEAD).eq(nth)
  },
  getArticleIdColumn(nth) {
    return cy.get(ARTICLE_ID).eq(nth)
  },
  clickArticleId() {
    cy.get(MANUSCRIPTS_TABLE_HEAD).eq(0).click()
  },
}
export default ManuscriptsPage
