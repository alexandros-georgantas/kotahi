module.exports = {
  instanceName: 'journal',
  user: { isAdmin: false, kotahiApiTokens: 'test:123456' },
  report: { showInMenu: true },
  review: { showSummary: false },
  dashboard: {
    showSections: ['submission', 'review', 'editor'],
    loginRedirectUrl: '/dashboard',
  },
  manuscript: {
    labelColumn: false,
    tableColumns:
      'shortId, titleAndAbstract, created, updated, status, submission.$customStatus, author',
    manualImport: false,
    newSubmission: false,
    autoImportHourUtc: 21,
    paginationCount: 10,
    archivePeriodDays: 60,
    semanticScholarImportsRecencyPeriodDays: 42,
  },
  submission: {
    allowAuthorsSubmitNewVersion: true,
  },
  production: {
    crossrefRetrievalEmail: 'test@coko.foundation',
    getDataFromDatacite: false,
    citationStyles: {
      styleName: 'apa',
      localeName: 'en-US',
    },
    crossrefSearchResultCount: 3,
    manuscriptVersionHistory: {
      historyIntervalInMinutes: 10,
    },
  },
  publishing: {
    hypothesis: {
      group: 'test',
      apiKey: 'text',
      shouldAllowTagging: false,
      reverseFieldOrder: false,
    },
    webhook: {
      ref: 'test',
      url: 'test',
      token: 'test',
    },
    crossref: {
      login: 'test',
      password: 'test',
      doiPrefix: '10.12345',
      licenseUrl: 'test',
      registrant: 'test',
      journalName: 'test',
      depositorName: 'test',
      depositorEmail: 'test@coko.foundation',
      journalHomepage: 'test',
      publicationType: 'article',
      journalAbbreviatedName: 'test',
      publishedArticleLocationPrefix: 'test',
      useSandbox: false,
    },
  },
  taskManager: {
    teamTimezone: 'Etc/UTC',
  },
  controlPanel: {
    showTabs: [
      'Team',
      'Decision',
      'Reviews',
      'Manuscript text',
      'Metadata',
      'Tasks & Notifications',
    ],
    hideReview: false,
    sharedReview: false,
    // showFeatures: ['Assign Editors', 'Reviews', 'Decision', 'Publish'],
    displayManuscriptShortId: true,
    authorProofingEnabled: true,
  },
  notification: {
    gmailAuthEmail: 'test@coko.foundation',
    gmailSenderEmail: 'test@coko.foundation',
    gmailAuthPassword: 'test',
  },
  eventNotification: {
    reviewerInvitationPrimaryEmailTemplate: null,
    authorProofingInvitationEmailTemplate: null,
    authorProofingSubmittedEmailTemplate: null,
  },
  groupIdentity: {
    brandName: 'Kotahi',
    primaryColor: '#3aae2a',
    secondaryColor: '#9e9e9e',
    logoPath: '/assets/logo-kotahi.png',
  },
}
