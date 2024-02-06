const en = {
  translation: {
    msStatus: {
      new: 'Unsubmitted',
      submitted: 'Submitted',
      accepted: 'Accepted',
      evaluated: 'Evaluated',
      rejected: 'Rejected',
      revise: 'Revise',
      revising: 'Revising',
      published: 'Published',
      assigned: 'Author proof assigned',
      inProgress: 'Author proofing in progress',
      completed: 'Author proof completed',
      unknown: 'Unknown',
    },
    reviewerStatus: {
      invited: 'Invited',
      rejected: 'Declined',
      declined: 'Declined',
      accepted: 'Accepted',
      inProgress: 'In Progress',
      completed: 'Completed',
      unanswered: 'Unanswered',
    },
    common: {
      cms: 'CMS',
      pdf: 'PDF',
      OK: 'OK',
      Cancel: 'Cancel',
      Yes: 'Yes',
      No: 'No',
      Save: 'Save',
      Update: 'Update',
      Confirm: 'Confirm',
      Delete: 'Delete',
      'Enter search terms...': 'Enter search terms...',
      surroundMultiword:
        'Surround multi-word phrases with quotes "". Exclude a term by prefixing with -. Specify alternate matches using OR. Use * as wildcard for word endings. Wrap subexpressions in parentheses ().',
      noOption: 'No option',
      danteRangeCalendar: {
        Presets: 'Presets',
        Today: 'Today',
        Yesterday: 'Yesterday',
        'Past 7 days': 'Past 7 days',
        'Past 30 days': 'Past 30 days',
        'Past 90 days': 'Past 90 days',
        'Past year': 'Past year',
        Clear: 'Clear',
      },
      roles: {
        Admin: 'Admin',
        'Group Manager': 'Group Manager',
        User: 'User',
      },
      emailUpdate: {
        invalidEmail: 'Email is invalid',
        emailTaken: 'Email is already taken',
        smthWentWrong: 'Something went wrong',
      },
      relativeDateStrings: {
        today: 'today',
        yesterday: 'yesterday',
        daysAgo: '{{count}} day ago',
        daysAgo_plural: '{{count}} days ago',
      },
      recommendations: {
        Accept: 'Accept',
        Revise: 'Revise',
        Reject: 'Reject',
      },
      teams: {
        assign: 'Assign {{teamLabel}}...',
        'Senior Editor': 'Advisory Curator',
        'Handling Editor': 'Handling Editor',
        Editor: 'Handling Curator',
      },
      kanban: {
        'Last updated': 'Last updated',
        'Invited via email': 'Invited via email',
      },
      days: {
        day: 'day',
        day_plural: 'days',
      },
    },
    leftMenu: {
      'Summary Info': 'Summary Info',
      Manuscript: 'Manuscript',
      Dashboard: 'Dashboard',
      Manuscripts: 'Manuscripts',
      Reports: 'Reports',
      Settings: 'Settings',
      Forms: 'Forms',
      Submission: 'Submission',
      Review: 'Review',
      Decision: 'Decision',
      Tasks: 'Tasks',
      Users: 'Users',
      Configuration: 'Configuration',
      Emails: 'Emails',
      CMS: 'CMS',
      Pages: 'Pages',
      Layout: 'Layout',
      Article: 'Article Template',
      'Go to your profile': 'Go to your profile',
    },

    profilePage: {
      'Your profile': 'Your profile',
      'Profile: ': 'Profile: ',
      Logout: 'Logout',
      Username: 'Username',
      Email: 'Email',
      Language: 'Language',
      Change: 'Change',
      usernameWarn:
        'Cannot begin with a numeral or start or end with space characters',
      userPrivilegeAlert: `User Privileges Required
        <br /> Please ensure that you have the appropriate role permissions or
        contact your system administrator for assistance.`,
      'Drop it here': 'Drop it here',
      'Change profile picture': 'Change profile picture',
      'Mute all discussion email notifications':
        'Mute all discussion email notifications',
      ORCID: 'ORCID',
    },
    manuscriptsTable: {
      'No matching manuscripts were found':
        'No matching manuscripts were found',
      'Manuscript number': 'Manuscript number',
      Created: 'Created',
      Updated: 'Updated',
      'Last Status Update': 'Last Status Update',
      Status: 'Status',
      'Your Status': 'Your Status',
      Title: 'Title',
      Version: 'Version',
      Author: 'Author',
      Editor: 'Editor',
      'Reviewer Status': 'Reviewer Status',
      Actions: 'Actions',
      Decision: 'DECISION',
      Team: 'TEAM',
      'No results found': 'No results found',
      pagination: `Showing <strong>{{firstResult}}</strong> to <strong>{{lastResult}}</strong> of <strong>{{totalCount}}</strong> results`,
      reviewAccept: 'Accept',
      reviewReject: 'Decline',
      reviewDo: 'Do Review',
      reviewCompleted: 'Completed',
      reviewContinue: 'Continue Review',
      all: 'All',
      Search: 'Search',
      actions: {
        Evaluation: 'Evaluation',
        Control: 'Control',
        View: 'View',
        Archive: 'Archive',
        Production: 'Production',
        Publish: 'Publish',
        confirmArchive:
          'Please confirm you would like to archive this manuscript',
        confirmArchiveButton: 'Archive',
        cancelArchiveButton: 'Cancel',
        'Publishing error': 'Publishing error',
        'Some targets failed to publish': 'Some targets failed to publish.',
      },
    },
    dashboardPage: {
      Dashboard: 'Dashboard',
      'New submission': '+ New submission',
      'New Alerts': 'New Alerts',
      'My Submissions': 'My Submissions',
      'To Review': 'To Review',
      "Manuscripts I'm Curator of": 'Manuscripts I’m Curator of',
      mySubmissions: {
        'My Submissions': 'My Submissions',
      },
      toReview: {
        'To Review': 'To Review',
      },
      edit: {
        "Manuscripts I'm curator of": 'Manuscripts I’m curator of',
      },
    },
    reviewPage: {
      Versions: 'Versions',
      'Anonymous Reviewer': 'Anonymous Reviewer',
      Submit: 'Submit',
    },
    reviewVerdict: {
      accept: 'accept',
      revise: 'revise',
      reject: 'reject',
    },
    manuscriptsPage: {
      Manuscripts: 'Manuscripts',
      manuscriptInvalid:
        'This manuscript has incomplete or invalid fields. Please correct these and try again.',
      importPending: 'pending',
      Refreshing: 'Refreshing',
      Refresh: 'Refresh',
      Select: 'Select',
      'Select All': 'Select All',
      selectedArticles: '{{count}} articles selected',
      Archive: 'Archive',
    },
    decisionPage: {
      'Current version': 'Current version',
      Team: 'Team',
      Decision: 'Decision',
      'Manuscript text': 'Manuscript text',
      Metadata: 'Metadata',
      'Tasks & Notifications': 'Tasks & Notifications',
      'Assign Editors': 'Assign Editors',
      'Reviewer Status': 'Reviewer Status',
      Version: 'Version',
      'See Declined': 'See Declined ({{count}})',
      'Hide Declined': 'Hide Declined',
      'No Declined Reviewers': 'No Declined Reviewers',
      'Invite Reviewers': 'Invite Reviewers',
      'New User': 'New User',
      selectUser: 'Select...',
      'Invite reviewer': 'Invite reviewer',
      'Invite and Notify': 'Invite and Notify',
      'User email address opted out': 'User email address opted out',
      inviteUser: {
        Email: 'Email',
        Name: 'Name',
      },
      declinedInvitation: 'Declined {{dateString}}',
      'Invited via email': 'Invited via email',
      'View Details': 'View Details',
      'Assign Author for Proofing': 'Assign Author for Proofing',
      'Submit for author proofing': 'Submit for author proofing',
      authorRequired: 'Requires an author to be invited!',
      hideAssignedAuthors: 'Hide all authors assigned',
      showAssignedAuthors: 'Show all authors assigned',
      assignedOn: '{{assigneeName}} assigned on {{date}}',
      decisionTab: {
        'Archived version': 'Archived version',
        notCurrentVersion:
          'This is not the current, but an archived read-only version of the manuscript.',
        'Completed Reviews': 'Completed Reviews',
        noReviews: 'No reviews completed yet.',
        reviewNum: 'Review {{num}}',
        'Anonmyous Reviewer': 'Anonmyous Reviewer',
        'Hide review': 'Hide review',
        'Hide reviewer name': 'Hide reviewer name',
        reviewModalShow: 'Show',
        reviewModalHide: 'Hide',
        Submit: 'Submit',
        Publishing: 'Publishing',
        publishOnlyAccepted: 'You can only publish accepted submissions.',
        publishingNewEntry:
          'Publishing will add a new entry on the public website and can not be undone.',
        Publish: 'Publish',
        Republish: 'Republish',
        publishedOn: 'This submission was published on {{date}}',
        doisToBeRegistered: 'DOIs to be registered: {{dois}}',
        noDoisToBeRegistered:
          'No DOIs will be registered at time of publishing.',
      },
      metadataTab: {
        'Manuscript Number': 'Manuscript Number:',
      },
      tasksTab: {
        Notifications: 'Notifications',
        'New User': 'New User',
        'Choose receiver': 'Choose receiver',
        'Choose notification template': 'Choose notification template',
        Notify: 'Notify',
        'User email address opted out': 'User email address opted out',
        Tasks: 'Tasks',
        newUser: {
          Email: 'Email',
          Name: 'Name',
        },
      },
      'Add another person': 'Add another person',
      'Delete this author': 'Delete this author',
    },
    editorSection: {
      noFileLoaded: 'No manuscript file loaded',
      noSupportedView: 'No supported view of the file',
    },
    reviewDecisionSection: {
      noDecisionUpdated: 'No decision has been updated for this manuscript yet',
    },
    otherReviewsSection: {
      noSharedReviews:
        'No collaborative reviews are available for this manuscript yet',
    },
    cmsPage: {
      article: {
        title: 'Article Template',
      },
      pages: {
        addNew: 'Add a new page',
        'New Page': 'New Page',
        Pages: 'Pages',
        Publish: 'Publish',
        'Saving data': 'Saving data',
        Rebuilding: 'Rebuilding...',
        Published: 'Published',
        Delete: 'Delete',
        fields: {
          title: 'Page title*',
          url: 'URL',
        },
        'New edits on page': 'New edits on page',
        'Edited on': 'Edited on {{date}}',
        'Published on': 'Published on {{date}}',
        'Not published yet': 'Not published yet',
      },
      layout: {
        Publish: 'Publish',
        Layout: 'Layout',
        'Saving data': 'Saving data',
        'Rebuilding Site': 'Rebuilding Site...',
        Published: 'Published',
        'Brand logo': 'Brand logo',
        'Brand Color': 'Brand Color',
        fields: {
          primaryColor: 'Primary color',
          secondaryColor: 'Secondary color',
        },
        Header: 'Header',
        useCheckbox:
          'Use checkbox to show and hide the page in the menu. Click and Drag to order them.',
        Footer: 'Footer',
        Status: 'Status',
        MakeFlaxSitePrivate:
          'Your publishing website will only be visible to those who have access to the Draft link',
        DraftCheckbox: 'Draft',
        Partners: 'Partners',
        'Footer Text': 'Footer Text',
        'Footer Page links': 'Footer Page links',
      },
    },
    authorsInput: {
      firstName: {
        label: 'First name',
        placeholder: 'Enter first name...',
      },
      lastName: {
        label: 'Last name',
        placeholder: 'Enter last name...',
      },
      email: {
        label: 'Email',
        placeholder: 'Enter email...',
      },
      affiliation: {
        label: 'Affiliation',
        placeholder: 'Enter affiliation...',
      },
    },
    dragndrop: {
      'Drag and drop your files here': 'Drag and drop your files here',
      'Drag and drop files': 'Drag and drop {{fileType}} files here',
      'Drag and drop other files here': 'Drag and drop other files here',
      'Your file has been uploaded': 'Your file has been uploaded.',
      Remove: 'Remove',
    },
    productionPage: {
      Production: 'Production',
      AuthorProofing: 'Author Proofing',
      Feedback: 'Feedback',
      Attachments: 'Attachments',
      Submitted: 'Submitted',
      Submit: 'Submit',
      'Edited on': 'Edited on {{date}}',
      submittedOn: '{{submitterName}} submitted on {{date}}',
      'read-only': ' (read-only)',
      'No supported view of the file': 'No supported view of the file',
      Download: 'Download',
      Editor: 'Editor',
      'PDF CSS': 'PDF CSS',
      'PDF template': 'PDF template',
      'PDF assets': 'PDF assets',
      'PDF metadata': 'PDF metadata',
    },
    invitationResults: {
      author: 'author',
      reviewer: 'reviewer',
      declinedAndOptedOut:
        'Declined {{invitationType}} invitation and opted out',
      declined: 'Declined {{invitationType}} invitation',
      accepted: 'Accepted {{invitationType}} invitation',
    },
    configPage: {
      Configuration: 'Configuration',
      'Instance Type': 'Instance Type',
      'Group Identity': 'Group Identity',
      'Brand name': 'Brand name',
      'Brand primary colour': 'Brand primary colour',
      'Brand secondary colour': 'Brand secondary colour',
      Logo: 'Logo',
      Favicon: 'Favicon',
      Dashboard: 'Dashboard',
      landingPage: 'Landing page for Group Manager users upon login',
      'Dashboard Page': 'Dashboard Page',
      'Manuscript Page': 'Manuscript Page',
      pagesVisibleToRegistered: 'Dashboard pages visible to registered users',
      'My Submissions': 'My Submissions',
      'To Review': 'To Review',
      "Manuscripts I'm editor of": 'Manuscripts I’m editor of',
      'Manuscripts page': 'Manuscripts page',
      'List columns to display on the Manuscripts page':
        'List columns to display on the Manuscripts page',
      numberOfManuscripts:
        'Number of manuscripts listed per page on the Manucripts page',
      hourManuscriptsImported: 'Hour when manuscripts are imported daily (UTC)',
      daysManuscriptRemain:
        'Number of days a manuscript should remain in the Manuscripts page before being automatically archived',
      importFromSematic:
        'Import manuscripts from Sematic Scholar no older than ‘x’ number of days',
      newSubmissionActionVisisble:
        '‘Add new submission’ action visible on the Manuscripts page',
      displayActionToSelect:
        'Display action to ‘Select’ manuscripts for review from the Manuscripts page',
      importManuscriptsManually:
        'Import manuscripts manually using the ‘Refresh’ action',
      'Control panel': 'Control panel',
      'Display manuscript short id': 'Display manuscript short id',
      'Author proofing enabled':
        'Allow authors to particpate in proofreading rounds',
      'Reviewers can see submitted reviews':
        'Reviewers can see submitted reviews',
      'Authors can see individual peer reviews':
        'Authors can see individual peer reviews',
      'Control pages visible to editors': 'Control pages visible to editors',
      Team: 'Team',
      Submission: 'Submission',
      allowToSubmitNewVersion:
        'Allow an author to submit a new version of their manuscript at any time',
      'Review page': 'Review page',
      showSummary: 'Reviewers can see the Decision form data',
      Publishing: 'Publishing',
      Hypothesis: 'Hypothesis',
      'Hypothesis API key': 'Hypothesis API key',
      'Hypothesis group id': 'Hypothesis group id',
      shouldAllowTagging: 'Apply Hypothesis tags in the submission form',
      reverseFieldOrder:
        'Reverse the order of Submission/Decision form fields published to Hypothesis',
      Crossref: 'Crossref',
      journalName: 'Journal/Group name',
      journalAbbreviatedName: 'Abbreviated name',
      journalHomepage: 'Home page',
      crossrefLogin: 'Crossref username',
      crossrefPassword: 'Crossref password',
      crossrefRegistrant: 'Crossref registrant id',
      crossrefDepositorName: 'Crossref depositor name',
      crossrefDepositorEmail: 'Depositor email address',
      publicationType: 'Select publication type',
      doiPrefix: 'Crossref DOI prefix',
      publishedArticleLocationPrefix: 'Crossref published article location',
      licenseUrl: 'Publication license URL',
      useSandbox: 'Publish to Crossref sandbox',
      Webhook: 'Webhook',
      webhookUrl: 'Publishing webhook URL',
      webhookToken: 'Publishing webhook token',
      webhookRef: 'Publishing webhook reference',
      'Task Manager': 'Task Manager',
      teamTimezone: 'Set timezone for Task Manager due dates',
      Emails: 'Emails',
      gmailAuthEmail: 'Gmail email address',
      gmailSenderEmail: 'Gmail sender email address',
      gmailAuthPassword: 'Gmail password',
      eventNotification: 'Event Notifications',
      reviewRejectedEmailTemplate: 'Reviewer rejects an invitation to review',
      reviewerInvitationPrimaryEmailTemplate: 'Reviewer invitation',
      evaluationCompleteEmailTemplate: 'Submitted review',
      submissionConfirmationEmailTemplate: 'Submitted manuscript',
      alertUnreadMessageDigestTemplate: 'Unread discussion message',
      authorProofingInvitationEmailTemplate: 'Author proof assigned invitation',
      authorProofingSubmittedEmailTemplate:
        'Author proof completed and submitted feedback',
      Reports: 'Reports',
      reportShowInMenu: 'Group Manager and admin can access Reports',
      'User Management': 'User Management',
      userIsAdmin: 'All users are assigned Group Manager and Admin roles',
      kotahiApis: 'Kotahi APIs',
      tokens: 'Tokens',
      Submit: 'Submit',
      article: 'article',
      'peer review': 'peer review',
      showTabs: {
        Team: 'Team',
        Decision: 'Decision',
        'Manuscript text': 'Manuscript text',
        Metadata: 'Metadata',
        'Tasks & Notifications': 'Tasks & Notifications',
      },
      crossrefRetrievalEmail: 'Email to use for citation search',
      crossrefSearchResultCount:
        'Number of results to return from citation search',
      crossrefStyleName: 'Select style formatting for citations',
      crossrefLocaleName: 'Select locale for citations',
      production: {
        Production: 'Production',
        'Email to use for citation search': 'Email to use for citation search',
        'Number of results to return from citation search':
          'Number of results to return from citation search',
        'Select style formatting for citations':
          'Select style formatting for citations',
        apa: 'American Psychological Association (APA)',
        cmos: 'Chicago Manual of Style (CMOS)',
        cse: 'Council of Science Editors (CSE)',
        'Select locale for citations': 'Select locale for citations',
      },
      allowedIPs: 'List of repository IPs allowed access',
      api: 'COAR Notify',
    },
    reportsPage: {
      Reports: 'Reports',
      Show: 'Show',
      activityForManuscripts: 'activity for manuscripts arriving',
      activityForManuscriptsTooltip: `Metrics are shown for manuscripts that were first entered
                <br />
                into the system between these dates. Date boundaries are
                <br />
                at midnight in Universal Time.`,
      'Editors workflow': 'Editors’ workflow',
      'All manuscripts': 'All manuscripts',
      Submitted: 'Submitted',
      'Editor assigned': 'Editor assigned',
      'Decision complete': 'Decision complete',
      Accepted: 'Accepted',
      Published: 'Published',
      'Reviewers workflow': 'Reviewers’ workflow',
      'Reviewer invited': 'Reviewer invited',
      'Invite accepted': 'Invite accepted',
      'Review completed': 'Review completed',
      'Manuscripts published today': 'Manuscripts published today',
      'From midnight local time': 'From midnight local time',
      Average: 'Average',
      'Manuscripts in progress': 'Manuscripts in progress',
      'Based on the selected date range': 'Based on the selected date range',
      reviwingAndEditing:
        'Reviewing and editing durations for individual manuscripts',
      'Days spent on': 'Days spent on',
      daysSpentReview: 'review,',
      daysSpentPostreview: 'post-review',
      'or incomplete': '(or incomplete)',
      'Submission date': 'Submission date',
      summaryInfo: {
        'Average time to publish': 'Average time to publish',
        roundedDays: '{{days}} day',
        roundedDays_plural: '{{days}} days',
        'From submission to published': 'From submission to published',
        'Average time to review': 'Average time to review',
        awaitingRevision: 'Awaiting revision',
        unassigned: 'Unassigned',
        reviewed: 'Reviewed',
      },
      reportTypes: {
        Summmary: 'Summmary',
        Manuscript: 'Manuscript',
        Editor: 'Editor',
        Reviewer: 'Reviewer',
        Author: 'Author',
      },
      tables: {
        manuscripts: {
          'Manuscript number': 'Manuscript number',
          'Entry date': 'Entry date',
          Title: 'Title',
          Author: 'Author',
          Editors: 'Editors',
          Reviewers: 'Reviewers',
          Status: 'Status',
          'Published date': 'Published date',
          reviewDuration: 'Review took <strong>{{durations}}</strong> day',
          reviewDuration_plural:
            'Review took <strong>{{durations}}</strong> days',
          prevReviewDuration:
            'Previous review took <strong>{{durations}}</strong> day',
          prevReviewDuration_plural:
            'Previous review took <strong>{{durations}}</strong> days',
          reviewDurations: 'Reviews took <strong>{{durations}}</strong> days',
          prevReviewDurations:
            'Previous reviews took <strong>{{durations}}</strong> days',
        },
        editor: {
          'Editor name': 'Editor name',
          'Manuscripts assigned': 'Manuscripts assigned',
          'Assigned for review': 'Assigned for review',
          Revised: 'Revised',
          Rejected: 'Rejected',
          Accepted: 'Accepted',
          Published: 'Published',
        },
        reviewer: {
          'Reviewer name': 'Reviewer name',
          'Review invites': 'Review invites',
          'Invites declined': 'Invites declined',
          'Reviews completed': 'Reviews completed',
          'Average review duration': 'Average review duration',
          'Recommended to accept': 'Recommended to accept',
          'Recommended to revise': 'Recommended to revise',
          'Recommended to reject': 'Recommended to reject',
          days: '{{days}} day',
          days_plural: '{{days}} days',
        },
        author: {
          'Author name': 'Author name',
          revisionRequested: 'Revision requested',
        },
      },
    },
    emailTemplate: {
      'Email Templates': 'Email Templates',
      'New Email Template': 'New Email Template',
      subject: 'Subject',
      cc: 'CC',
      ccEditorsCheckboxDescription:
        'Automatically add manuscript editors in "cc" when sending this email (if applicable)',
      body: 'Body',
      description: 'Description',
      addANewEmailTemplate: 'Add a new email template',
      'Edited on': 'Edited on {{date}}',
      delete: 'Delete',
      permanentlyDelete:
        'Deleting this email template will also delete its assignment from tasks and configuration settings. This action cannot be undone. Are you sure you want to delete?',
      validationMessages: {
        invalidEmail: 'Email is invalid',
        duplicateDescription:
          'Template with the Same Description Already Exists.',
      },
    },
    loginPage: {
      kotahiUses:
        'Kotahi uses ORCID <0>icon</0> to identify authors and staff.',
      'Login with ORCID': 'Login with ORCID',
      'Register with ORCID': 'Register with ORCID',
    },
    frontPage: {
      recent: 'Recent publications in {{brandName}}',
      Dashboard: 'Dashboard',
      Login: 'Login',
    },
    declineReviewPage: {
      youHaveDeclined:
        'You have declined an invitation to participate in a peer review.',
      reason: 'Please share your reasons for declining the invitation below.',
      messageHere: 'Your message here...',
      dontWantContact: 'I don’t want to be contacted again',
      'Submit Feedback': 'Submit Feedback',
      'Decline Invitation': 'Decline Invitation',
      thanks: 'Thank you for submitting the feedback.',
    },
    reviewPreviewPage: {
      Summary: 'Summary',
      Back: 'Back',
    },
    sharedReviews: {
      'Other Reviews': 'Other Reviews',
    },
    linkExpiredPage:
      'This invitation link has expired. Please contact the system administrator to send a new invitation.',
    waxEditor: {
      'Front matter tools': 'Front matter tools',
      'Back matter tools': 'Back matter tools',
      'Front matter': 'Front matter',
      'Change to front matter': 'Change to front matter',
      'Funding Group': 'Funding Group',
      'Funding source': 'Funding source',
      'Change to funding source': 'Change to funding source',
      'Award ID': 'Award ID',
      'Change to award ID': 'Change to award ID',
      'Funding statement': 'Funding statement',
      'Change to funding statement': 'Change to funding statement',
      Keywords: 'Keywords',
      Keyword: 'Keyword',
      'Change to keyword': 'Change to keyword',
      'Keyword list': 'Keyword list',
      'Change to keyword list': 'Change to keyword list',
      Abstract: 'Abstract',
      'Change to abstract': 'Change to abstract',
      Appendices: 'Appendices',
      Appendix: 'Appendix',
      'Change to appendix': 'Change to appendix',
      Acknowledgements: 'Acknowledgements',
      'Change to acknowledgements': 'Change to acknowledgements',
      Glossary: 'Glossary',
      'Glossary section': 'Glossary section',
      'Change to glossary section': 'Change to glossary section',
      'Glossary term': 'Glossary term',
      'Change to glossary term': 'Change to glossary term',
      'Glossary item': 'Glossary item',
      'Change to glossary item': 'Change to glossary item',
      Citations: 'Citations',
      'Reference list': 'Reference list',
      'Change to reference list': 'Change to reference list',
      Reference: 'Reference',
      'Change to reference': 'Change to reference',
    },
    manuscriptSubmit: {
      'Current version': 'Current version',
      'Edit submission info': 'Edit submission info',
      'Manuscript text': 'Manuscript text',
      'Submit your research object': 'Submit your research object',
      'Errors in your submission': 'Errors in your submission',
      errorsList:
        'There are errors in your submission, please correct the following:',
      Submit: 'Submit',
      or: 'or',
      'get back to your submission': 'get back to your submission',
      'Submit a new version': 'Submit a new version',
      submitVersionButton: 'Submit a new version...',
      canModify:
        'You can modify and resubmit a new version of your manuscript.',
      askedToRevise: `You have been asked to <strong>revise</strong> your manuscript;
              see the reviews and decision below. You may modify and resubmit a
              new version of your manuscript.`,
      'Submitted info': 'Submitted info',
      Reviews: 'Reviews',
      'No reviews to show': 'No reviews to show.',
      'No completed reviews': 'No completed reviews.',
      Metadata: 'Metadata',
    },
    chat: {
      'Your message here...': 'Your message here...',
      Send: 'Send',
      noDiscussion:
        'No discussion for this manuscript yet. Start by typing a message below.',
      'Unread messages': 'Unread messages',
      'Admin discussion': 'Admin discussion',
      'Group Manager discussion': 'Group Manager discussion',
      'Show admin discussion': 'Show admin discussion',
      'Show group manager discussion': 'Show group manager discussion',
      'Discussion with curatorial team': 'Discussion with curatorial team',
      'Discussion with curator': 'Discussion with curator',
      'Show Chat': 'Show Chat',
      'Hide Chat': 'Hide Chat',
      'Discussion with author': 'Discussion with author',
      'Curatorial discussion': 'Curatorial discussion',
      edit: 'Edit',
      delete: 'Delete',
      Edited: 'Edited',
      'Open video chat': 'Open video chat',
      Formatting: 'Formatting',
      'Hide formatting': 'Hide formatting',
    },
    taskManager: {
      list: {
        'Add your first task...': 'Add your first task...',
        'Add a new task': 'Add a new task',
        Title: 'Title',
        Assignee: 'Assignee',
        'Duration in days': 'Duration in days',
        'Duration/Due Date': 'Duration/Due Date',
        'Unregistered User': 'Unregistered User',
        'User Roles': 'User Roles',
        'Registered Users': 'Registered Users',
        userRoles: {
          Reviewer: 'Reviewer',
          Editor: 'Curator',
          Author: 'Author',
        },
      },
      task: {
        durationDaysNone: 'None',
        selectAssignee: 'Select...',
        'Give your task a name': 'Give your task a name...',
        Edit: 'Edit',
        Delete: 'Delete',
        'Click to mark as done': 'Click to mark as done',
        statuses: {
          Paused: 'Paused',
          Pause: 'Pause',
          'In progress': 'In progress',
          Continue: 'Continue',
          Done: 'Done',
          Start: 'Start',
        },
        unregisteredUser: {
          Email: 'Email',
          Name: 'Name',
        },
      },
    },
    tasksPage: {
      'Task Template Builder': 'Task Template Builder',
    },
    usersTable: {
      Users: 'Users',
      Name: 'Name',
      Created: 'Created',
      'Last Online': 'Last Online',
      Roles: 'Roles',
      Delete: 'Delete',
      Yes: 'Yes',
      Cancel: 'Cancel',
      None: 'None',
    },
    modals: {
      inviteDeclined: {
        'Invitation Decline': '{{name}}’s Invitation Decline',
        Declined: 'Declined: {{dateString}}',
        Reviewer: 'Reviewer:',
        Status: 'Status',
        declinedBadge: 'Declined',
        'Opted Out': 'Opted Out',
        'Declined Reason': 'Declined Reason',
        'No reason provided': 'No reason provided.',
      },
      reviewReport: {
        'Review Report': '{{name}}’s Review Report',
        'Last Updated': 'Last Updated: {{dateString}}',
        Reviewer: 'Reviewer:',
        Status: 'Status',
        reviewNotCompleted: 'Review hasn’t been completed yet',
        Delete: 'Delete',
        Shared: 'Shared',
        Recommendation: 'Recommendation',
        'Hide Review': 'Hide Review',
        'Hide Reviewer Name': 'Hide Reviewer Name',
      },
      inviteReviewer: {
        'Invite Reviewer': 'Invite Reviewer',
        Shared: 'Shared',
        'Email Notification': 'Email Notification',
        Cancel: 'Cancel',
        Invite: 'Invite',
      },
      deleteReviewer: {
        'Delete this reviewer': 'Delete this reviewer?',
        Reviewer: 'Reviewer:',
        Ok: 'Ok',
        Cancel: 'Cancel',
      },
      taskDelete: {
        permanentlyDelete: 'Permanently delete this task?',
        Ok: 'Ok',
        Cancel: 'Cancel',
      },
      taskEdit: {
        'Task details': 'Task details',
        'Task title': 'Task title',
        'Task description': 'Task description',
        'Give your task a name': 'Give your task a name...',
        Assignee: 'Assignee',
        'Due date': 'Due date',
        'Duration in days': 'Duration in days',
        'Add Notification Recipient': 'Add Notification Recipient',
        Recipient: 'Recipient',
        'Select a recipient': 'Select a recipient',
        'Select email template': 'Select email template',
        'Send notification': 'Send notification',
        Send: 'Send',
        days: 'days',
        before: 'before',
        after: 'after',
        'due date': 'due date',
        'Send Now': 'Send Now',
        'Show all notifications sent':
          'Show all notifications sent ({{count}})',
        'Hide all notifications sent':
          'Hide all notifications sent ({{count}})',
      },
      deleteField: {
        'Permanently delete this field': 'Permanently delete this field?',
      },
      deleteForm: {
        'Permanently delete this form': 'Permanently delete this form?',
      },
      assignUserRole: {
        text:
          'Do you wish to assign the <strong>{{role}}</strong> role for user {{user}}?',
      },
      removeUserRole: {
        text:
          'Do you wish to remove the <strong>{{role}}</strong> role for user {{user}}?',
      },
      deleteUser: {
        'Permanently delete user': 'Permanently delete user {{userName}}?',
        Delete: 'Delete',
        Cancel: 'Cancel',
      },
      cmsPageDelete: {
        Cancel: 'Cancel',
        Delete: 'Delete',
        permanentlyDelete: 'Permanently delete {{pageName}} page ?',
      },
      deleteMessage: {
        'Are you sure you want to delete this message?':
          'Are you sure you want to delete this message?',
      },
      editMessage: {
        'Edit message': 'Edit message',
        cancel: 'Cancel',
      },
      publishError: {
        'Some targets failed to publish': 'Some targets failed to publish.',
        'Publishing error': 'Publishing error',
      },
      deleteFile: {
        'Are you sure you want to delete this file?':
          'Are you sure you want to delete this file?',
      },
    },

    newSubmission: {
      'New submission': 'New submission',
      'Submission created': 'Submission created',
      'Upload Manuscript': 'Upload Manuscript',
      dragNDrop: 'Drag and drop or click to select file',
      acceptedFiletypes: 'Accepted file types: pdf, epub, zip, docx, latex',
      converting:
        'Your manuscript is being converted into a directly editable version. This might take a few seconds.',
      'Submit a URL instead': 'Submit a URL instead',
      errorUploading: '{{error}}',
    },
    formBuilder: {
      'New Form': 'New Form',
      'Create Form': 'Create Form',
      'Update Form': 'Update Form',
      'Add new form': 'Add new form',
      'Form purpose identifier': 'Form purpose identifier',
      'Form Name': 'Form Name',
      'Form title': 'Form title',
      Description: 'Description',
      submitConfirmPage: 'Show confirmation page when submitting?',
      'Popup Title': 'Popup Title',
      'Field Properties': 'Field Properties',
      'Field type': 'Field type',
      'Field title': 'Field title',
      'Field name': 'Name (internal field name)',
      'Field placeholder': 'Field placeholder',
      internalNameDescription:
        'Enter "submission." followed by a name including only letters, numbers or underscores, e.g. "submission.yourFieldNameHere"',
      'Field description': 'Field description',
      'Field options': 'Field options',
      'Field shortDescription':
        'Short title (optional — used in concise listings)',
      'Field validate': 'Validation options',
      'Field hideFromReviewers': 'Hide from reviewers?',
      'Field hideFromAuthors': 'Hide from authors?',
      'Field permitPublishing': 'Include when sharing or publishing?',
      'Field publishingTag': 'Hypothesis tag',
      'FieldDescription publishingTag':
        'You may specify a tag to use when sharing this field as a Hypothesis annotation.',
      'Label to display': 'Label to display',
      'Color label': 'Color label',
      'Enter label': 'Enter label…',
      'Internal name': 'Internal name',
      'Enter name': 'Enter name...',
      'Add another option': 'Add another option',
      'Delete this option': 'Delete this option',
      validateInputPlaceholder: 'Select...',
      'Field parse': 'Special parsing',
      'Field format': 'Special formatting',
      'Field doiValidation': 'Validate as a DOI?',
      'Field doiUniqueSuffixValidation':
        'Validate as a DOI suffix and ensure it is unique?',
      'Update Field': 'Update Field',
      'Correct invalid values before updating':
        'Correct invalid values before updating',
      'Field inline': 'Field inline',
      'Field sectioncss': 'Field sectioncss',
      'Please give the form a name.': 'Please give the form a name.',
      'Give the form a title': 'Give the form a title',
      'Edit form settings': 'Edit form settings',
      'Add a field': 'Add a field...',
      'Make this the active form': 'Make this the active form',
      confirmMakeActiveForm: 'Make this the active {{name}} form?',
      mustBePositiveInteger: 'Must be an integer > 0',
      correctBeforeSaving: 'Correct invalid values before saving',
      genericFields: 'Generic field types',
      specialFields: 'Special fields',
      dataType: 'Data type',
      nameInUse: 'This name is already in use for another field',
      fallbackFieldLabel: 'Field {{name}}',
      Active: 'Active',
      unnamedForm: 'Unnamed form',
      fieldOpts: {
        title: 'Title',
        authors: 'Authors',
        abstract: 'Abstract',
        visualAbstract: 'Single image attachment',
        attachments: 'Attachments',
        doi: 'DOI',
        doiSuffix: 'DOI suffix',
        sourceUri: 'Manuscript source URI',
        customStatus: 'Custom status',
        editDate: 'Last edit date — read-only',
        attachedManuscript: 'Attached manuscript — read-only',
        text: 'Text',
        richText: 'Rich text',
        select: 'Dropdown selection',
        radioGroup: 'Radio buttons',
        checkboxes: 'Checkboxes',
        contributors: 'List of contributors',
        links: 'List of links (URLs)',
        verdict: 'Verdict',
        discussion: 'Discussion',
      },
      typeOptions: {
        Select: 'Select',
        ManuscriptFile: 'Manuscript file',
        SupplementaryFiles: 'Attachments',
        VisualAbstract: 'Single image attachment',
        AuthorsInput: 'List of contributors',
        LinksInput: 'List of links (URIs)',
        AbstractEditor: 'Rich text',
        TextField: 'Text',
        CheckboxGroup: 'Checkboxes',
        RadioGroup: 'Radio buttons',
        undefined: '',
        ThreadedDiscussion: 'Discussion',
      },
      submission: {
        title: 'Submission Form Builder',
      },
      review: {
        title: 'Review Form Builder',
      },
      decision: {
        title: 'Decision Form Builder',
      },
    },
    fields: {
      hideFromReviewers: {
        true: 'Yes',
        false: 'No',
      },
      hideFromAuthors: {
        true: 'Yes',
        false: 'No',
      },
      permitPublishing: {
        false: 'Never',
        true: 'Ad hoc (Editor decides at time of sharing/publishing)',
        always: 'Always',
      },
      validate: {
        required: 'Required',
        minChars: 'Minimum characters',
        maxChars: 'Maximum characters',
        minSize: 'Minimum number of items',
        labels: {
          minChars: 'Minimum characters value',
          maxChars: 'Maximum characters value',
          minSize: 'Minimum number of items value',
        },
      },
      parse: {
        false: 'None',
        split: 'Split at commas',
      },
      format: {
        false: 'None',
        join: 'Join with commas',
      },
      doiValidation: {
        true: 'Yes',
        false: 'No',
      },
      doiUniqueSuffixValidation: {
        true: 'Yes',
        false: 'No',
      },
      inline: {
        true: 'Yes',
        false: 'No',
      },
    },
  },
}

export default en
