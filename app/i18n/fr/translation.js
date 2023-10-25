const fr = {
  translation: {
    msStatus: {
      new: 'Non soumis',
      submitted: 'Soumis',
      accepted: 'Accepté',
      evaluated: 'Évalué',
      rejected: 'Rejeté',
      revise: 'Réviser',
      revising: 'En révision',
      published: 'Publié',
      unknown: 'Inconnu',
    },
    reviewerStatus: {
      invited: 'Invité',
      rejected: 'Refusé',
      declined: 'Refusé',
      accepted: 'Accepté',
      inProgress: 'En cours',
      completed: 'Terminé',
      unanswered: 'Sans réponse',
    },
    common: {
      OK: 'Ok',
      Cancel: 'Annuler',
      'Enter search terms...': 'Saisissez des termes de recherche...',
      surroundMultiword:
        'Entourez les expressions à plusieurs mots avec des guillemets "". Excluez un terme en le préfixant avec -. Spécifiez des correspondances alternatives en utilisant OU. Utilisez * comme joker pour les fins de mots. Enveloppez les sous-expressions entre parenthèses ().',
      noOption: "Pas d'option",
      danteRangeCalendar: {
        Presets: 'Préconfigurations',
        Today: "Aujourd'hui",
        Yesterday: 'Hier',
        'Past 7 days': '7 derniers jours',
        'Past 30 days': '30 derniers jours',
        'Past 90 days': '90 derniers jours',
        'Past year': 'Année passée',
        Clear: 'Effacer',
      },
      roles: {
        Admin: 'Admin',
        'Group Manager': 'Gestionnaire de groupe',
        User: 'Utilisateur',
      },
      emailUpdate: {
        invalidEmail: 'Email invalide',
        emailTaken: 'Email déjà utilisé',
        smthWentWrong: 'Une erreur est survenue',
      },
      relativeDateStrings: {
        today: "aujourd'hui",
        yesterday: 'hier',
        daysAgo: 'il y a {{count}} jour',
        daysAgo_plural: '{{count}} jours auparavant',
      },
      recommendations: {
        Accept: 'Accepter',
        Revise: 'Réviser',
        Reject: 'Rejeter',
      },
      teams: {
        assign: 'Attribuer à {{teamLabel}}...',
        'Senior Editor': 'Éditeur en chef',
        'Handling Editor': 'Éditeur responsable',
        Editor: 'Éditeur',
      },
      kanban: {
        'Last updated': 'Dernière mise à jour',
        'Invited via email': 'Invité par email',
      },
      days: {
        day: 'jour',
        day_plural: 'jours',
      },
    },
    leftMenu: {
      'Summary Info': 'Résumé des infos',
      Manuscript: 'Manuscrit',
      Dashboard: 'Tableau de bord',
      Manuscripts: 'Manuscrits',
      Reports: 'Rapports',
      Settings: 'Paramètres',
      Forms: 'Formulaires',
      Submission: 'Soumission',
      Review: 'Révision',
      Decision: 'Décision',
      Tasks: 'Tâches',
      Users: 'Utilisateurs',
      Configuration: 'Configuration',
      Emails: 'Emails',
      CMS: 'CMS',
      Pages: 'Pages',
      Layout: 'Disposition',
      'Go to your profile': 'Accéder à votre profil',
    },

    profilePage: {
      'Your profile': 'Votre profil',
      'Profile: ': 'Profil : ',
      Logout: 'Déconnexion',
      Username: "Nom d'utilisateur",
      Email: 'Email',
      Language: 'Langue',
      Change: 'Changer',
      usernameWarn:
        'Ne peut pas commencer par un chiffre ou débuter ou finir par des espaces',
      userPrivilegeAlert: `Droits d'utilisateur requis
        <br /> Veuillez vous assurer que vous avez les permissions de rôle appropriées ou
        contactez votre administrateur système pour obtenir de l'aide.`,
      'Drop it here': 'Déposez-le ici',
      'Change profile picture': 'Changer la photo de profil',
      'Mute all discussion email notifications':
        'Désactiver toutes les notifications par e-mail pour les discussions',
      ORCID: 'ORCID',
    },
    manuscriptsTable: {
      'No matching manuscripts were found':
        'Aucun manuscrit correspondant trouvé',
      'Manuscript number': 'Numéro de manuscrit',
      Created: 'Créé',
      Updated: 'Mis à jour',
      'Last Status Update': 'Dernière mise à jour du statut',
      Status: 'Statut',
      'Your Status': 'Votre statut',
      Title: 'Titre',
      Version: 'Version',
      Author: 'Auteur',
      Editor: 'Éditeur',
      'Reviewer Status': 'Statut du réviseur',
      Actions: 'Actions',
      Decision: 'Décision',
      Team: 'Équipe',
      'No results found': 'Aucun résultat trouvé',
      pagination: `Affichage de <strong>{{firstResult}}</strong> à <strong>{{lastResult}}</strong> sur <strong>{{totalCount}}</strong> résultats`,
      reviewAccept: 'Accepter',
      reviewReject: 'Rejeter',
      reviewDo: 'Faire la révision',
      reviewCompleted: 'Terminé',
      reviewContinue: 'Continuer la révision',
      all: 'Tous',
      Search: 'Rechercher',
      actions: {
        Evaluation: 'Évaluation',
        Control: 'Contrôle',
        View: 'Voir',
        Archive: 'Archiver',
        Production: 'Production',
        Publish: 'Publier',
        confirmArchive:
          'Veuillez confirmer que vous souhaitez archiver ce manuscrit',
        confirmArchiveButton: 'Archiver',
        cancelArchiveButton: 'Annuler',
        'Publishing error': "Erreur d'édition",
        'Some targets failed to publish':
          'Certains objectifs ont échoué à publier.',
      },
    },
    dashboardPage: {
      Dashboard: 'Tableau de bord',
      'New submission': '+ Nouvelle soumission',
      'New Alerts': 'Nouvelles alertes',
      'My Submissions': 'Mes soumissions',
      'To Review': 'À réviser',
      "Manuscripts I'm Editor of": 'Manuscrits dont je suis éditeur',
      mySubmissions: {
        'My Submissions': 'Mes soumissions',
      },
      toReview: {
        'To Review': 'À réviser',
      },
      edit: {
        "Manuscripts I'm editor of": 'Manuscrits dont je suis éditeur',
      },
    },
    reviewPage: {
      Versions: 'Versions',
      'Anonymous Reviewer': 'Réviseur anonyme',
      Submit: 'Soumettre',
    },
    reviewVerdict: {
      accept: 'accepter',
      revise: 'réviser',
      reject: 'rejeter',
    },
    manuscriptsPage: {
      Manuscripts: 'Manuscrits',
      manuscriptInvalid:
        'Ce manuscrit a des champs incomplets ou invalides. Veuillez les corriger et réessayer.',
      importPending: 'en attente',
      Refreshing: 'Actualisation',
      Refresh: 'Actualiser',
      'Select All': 'Sélectionner tout',
      selectedArticles: '{{count}} articles sélectionnés',
      Archive: 'Archiver',
    },
    decisionPage: {
      'Current version': 'Version actuelle',
      Team: 'Équipe',
      Decision: 'Décision',
      'Manuscript text': 'Texte du manuscrit',
      Metadata: 'Métadonnées',
      'Tasks & Notifications': 'Tâches et notifications',
      'Assign Editors': 'Attribuer des éditeurs',
      'Reviewer Status': 'Statut du réviseur',
      Version: 'Version',
      'See Declined': 'Voir refusé ({{count}})',
      'Hide Declined': 'Masquer refusé',
      'No Declined Reviewers': 'Aucun réviseur refusé',
      'Invite Reviewers': 'Inviter des réviseurs',
      'New User': 'Nouvel utilisateur',
      selectUser: 'Sélectionner...',
      'Invite reviewer': 'Inviter un réviseur',
      'Invite and Notify': 'Inviter et notifier',
      'User email address opted out':
        "L'utilisateur a choisi de ne pas recevoir d'e-mails",
      inviteUser: {
        Email: 'Email',
        Name: 'Nom',
      },
      declinedInvitation: 'Refusé {{dateString}}',
      'Invited via email': 'Invité par email',
      'View Details': 'Voir les détails',
      decisionTab: {
        'Archived version': 'Version archivée',
        notCurrentVersion:
          "Ce n'est pas la version actuelle, mais une version archivée en lecture seule du manuscrit.",
        'Completed Reviews': 'Révisions terminées',
        noReviews: 'Aucune révision terminée pour le moment.',
        reviewNum: 'Révision {{num}}',
        'Anonmyous Reviewer': 'Réviseur anonyme',
        'Hide review': 'Masquer la révision',
        'Hide reviewer name': 'Masquer le nom du réviseur',
        reviewModalShow: 'Afficher',
        reviewModalHide: 'Masquer',
        Submit: 'Soumettre',
        Publishing: 'Publication',
        publishOnlyAccepted:
          'Vous pouvez uniquement publier les soumissions acceptées.',
        publishingNewEntry:
          'La publication ajoutera une nouvelle entrée sur le site public et ne pourra pas être annulée.',
        Publish: 'Publier',
        Republish: 'Republier',
        publishedOn: 'Cette soumission a été publiée le {{date}}',
        doisToBeRegistered: 'DOIs à enregistrer : {{dois}}',
        noDoisToBeRegistered:
          'Aucun DOI ne sera enregistré au moment de la publication.',
      },
      metadataTab: {
        'Manuscript Number': 'Numéro de manuscrit:',
      },
      tasksTab: {
        Notifications: 'Notifications',
        'New User': 'Nouvel utilisateur',
        'Choose receiver': 'Choisir le destinataire',
        'Choose notification template': 'Choisir le modèle de notification',
        Notify: 'Notifier',
        'User email address opted out':
          "L'utilisateur a choisi de ne pas recevoir d'e-mails",
        Tasks: 'Tâches',
        newUser: {
          Email: 'Email',
          Name: 'Nom',
        },
      },
      'Add another person': 'Ajouter une autre personne',
      'Delete this author': 'Supprimer cet auteur',
    },
    editorSection: {
      noFileLoaded: 'Aucun fichier de manuscrit chargé',
      noSupportedView: 'Aucune vue supportée du fichier',
    },
    cmsPage: {
      pages: {
        addNew: 'Ajouter une nouvelle page',
        'New Page': 'Nouvelle Page',
        Pages: 'Pages',
        Publish: 'Publier',
        'Saving data': 'Enregistrement des données',
        Rebuilding: 'Reconstruction en cours...',
        Published: 'Publié',
        Save: 'Enregistrer',
        Delete: 'Supprimer',
        fields: {
          title: 'Titre de la page*',
          url: 'URL',
        },
        'New edits on page': 'Nouvelles modifications sur la page',
        'Edited on': 'Modifié le {{date}}',
        'Published on': 'Publié le {{date}}',
        'Not published yet': 'Pas encore publié',
      },
      layout: {
        Publish: 'Publier',
        Layout: 'Mise en page',
        'Saving data': 'Enregistrement des données',
        'Rebuilding Site': 'Reconstruction du site en cours...',
        Published: 'Publié',
        'Brand logo': 'Logo de la marque',
        'Brand Color': 'Couleur de la marque',
        fields: {
          primaryColor: 'Couleur primaire',
          secondaryColor: 'Couleur secondaire',
        },
        Header: 'En-tête',
        useCheckbox:
          'Utilisez la case à cocher pour afficher ou masquer la page dans le menu. Cliquez et faites glisser pour les réorganiser.',
        Footer: 'Pied de page',
        Partners: 'Partenaires',
        'Footer Text': 'Texte du pied de page',
        'Footer Page links': 'Liens des pages du pied de page',
      },
    },
    authorsInput: {
      firstName: {
        label: 'Prénom',
        placeholder: 'Saisissez le prénom...',
      },
      lastName: {
        label: 'Nom',
        placeholder: 'Saisissez le nom...',
      },
      email: {
        label: 'Email',
        placeholder: 'Saisissez le courrier électronique...',
      },
      affiliation: {
        label: 'Affiliation',
        placeholder: 'Saisissez l’affiliation...',
      },
    },
    dragndrop: {
      'Drag and drop your files here': 'Glissez et déposez vos fichiers ici',
      'Your file has been uploaded': 'Votre fichier a été téléchargé.',
      Remove: 'Retirer',
    },
    productionPage: {
      Production: 'Production',
      'No supported view of the file': 'Aucune vue supportée du fichier',
      Download: 'Télécharger',
    },
    invitationResults: {
      author: 'auteur',
      reviewer: 'réviseur',
      declinedAndOptedOut:
        "A décliné l'invitation {{invitationType}} et a choisi de se désinscrire",
      declined: "A décliné l'invitation {{invitationType}}",
      accepted: "A accepté l'invitation {{invitationType}}",
    },
    configPage: {
      Configuration: 'Configuration',
      'Instance Type': "Type d'instance",
      'Group Identity': 'Identité du groupe',
      'Brand name': 'Nom de la marque',
      'Brand primary colour': 'Couleur principale de la marque',
      'Brand secondary colour': 'Couleur secondaire de la marque',
      Logo: 'Logo',
      Dashboard: 'Tableau de bord',
      landingPage:
        "Page d'accueil pour les utilisateurs du gestionnaire de groupe après la connexion",
      'Dashboard Page': 'Page du tableau de bord',
      'Manuscript Page': 'Page du manuscrit',
      pagesVisibleToRegistered:
        'Pages du tableau de bord visibles aux utilisateurs enregistrés',
      'My Submissions': 'Mes soumissions',
      'To Review': 'À évaluer',
      "Manuscripts I'm editor of": "Manuscrits dont je suis l'éditeur",
      'Manuscripts page': 'Page des manuscrits',
      'List columns to display on the Manuscripts page':
        'Liste des colonnes à afficher sur la page des manuscrits',
      numberOfManuscripts:
        'Nombre de manuscrits listés par page sur la page des manuscrits',
      hourManuscriptsImported:
        'Heure à laquelle les manuscrits sont importés quotidiennement (UTC)',
      daysManuscriptRemain:
        "Nombre de jours pendant lesquels un manuscrit doit rester sur la page des manuscrits avant d'être automatiquement archivé",
      importFromSematic:
        'Importer des manuscrits de Sematic Scholar datant de moins de « x » nombre de jours',
      newSubmissionActionVisisble:
        'Action « Ajouter une nouvelle soumission » visible sur la page des manuscrits',
      displayActionToSelect:
        "Afficher l'action pour « Sélectionner » des manuscrits pour l'évaluation à partir de la page des manuscrits",
      importManuscriptsManually:
        "Importer manuellement des manuscrits en utilisant l'action « Actualiser »",
      'Control panel': 'Panneau de contrôle',
      'Display manuscript short id':
        "Afficher l'identifiant court du manuscrit",
      'Reviewers can see submitted reviews':
        'Les évaluateurs peuvent voir les évaluations soumises',
      'Authors can see individual peer reviews':
        'Les auteurs peuvent voir les évaluations par les pairs individuelles',
      'Control pages visible to editors':
        'Pages de contrôle visibles aux éditeurs',
      Team: 'Équipe',
      Submission: 'Soumission',
      allowToSubmitNewVersion:
        'Permettre à un auteur de soumettre une nouvelle version de son manuscrit à tout moment',
      'Review page': "Page d'évaluation",
      showSummary:
        'Les évaluateurs peuvent voir les données du formulaire de décision',
      Publishing: 'Publication',
      Hypothesis: 'Hypothèse',
      'Hypothesis API key': 'Clé API Hypothèse',
      'Hypothesis group id': 'ID du groupe Hypothèse',
      shouldAllowTagging:
        'Appliquer des tags Hypothèse dans le formulaire de soumission',
      reverseFieldOrder:
        "Inverser l'ordre des champs du formulaire de soumission/décision publiés à Hypothèse",
      Crossref: 'Crossref',
      journalName: 'Nom du journal/groupe',
      journalAbbreviatedName: 'Nom abrégé',
      journalHomepage: "Page d'accueil",
      crossrefLogin: "Nom d'utilisateur Crossref",
      crossrefPassword: 'Mot de passe Crossref',
      crossrefRegistrant: 'ID du déposant Crossref',
      crossrefDepositorName: 'Nom du déposant Crossref',
      crossrefDepositorEmail: 'Adresse e-mail du déposant',
      publicationType: 'Sélectionner le type de publication',
      doiPrefix: 'Préfixe DOI Crossref',
      publishedArticleLocationPrefix:
        "Emplacement de l'article publié Crossref",
      licenseUrl: 'URL de la licence de publication',
      useSandbox: 'Publier dans le bac à sable Crossref',
      Webhook: 'Webhook',
      webhookUrl: 'URL du webhook de publication',
      webhookToken: 'Jeton du webhook de publication',
      webhookRef: 'Référence du webhook de publication',
      'Task Manager': 'Gestionnaire de tâches',
      teamTimezone:
        'Définir le fuseau horaire pour les dates limites du gestionnaire de tâches',
      Emails: 'Emails',
      gmailAuthEmail: 'Adresse e-mail Gmail',
      gmailSenderEmail: "Adresse e-mail de l'expéditeur Gmail",
      gmailAuthPassword: 'Mot de passe Gmail',
      eventNotification: "Notifications d'événement",
      reviewRejectedEmailTemplate:
        "L'évaluateur rejette une invitation à évaluer",
      reviewerInvitationPrimaryEmailTemplate: "Invitation à l'évaluation",
      evaluationCompleteEmailTemplate: 'Évaluation soumise',
      submissionConfirmationEmailTemplate: 'Manuscrit soumis',
      alertUnreadMessageDigestTemplate: 'Message de discussion non lu',
      Reports: 'Rapports',
      reportShowInMenu:
        "Le gestionnaire de groupe et l'administrateur peuvent accéder aux rapports",
      'User Management': 'Gestion des utilisateurs',
      userIsAdmin:
        "Tous les utilisateurs sont assignés les rôles de gestionnaire de groupe et d'administrateur",
      kotahiApiTokens: 'Jetons API Kotahi',
      Submit: 'Soumettre',
      article: 'article',
      'peer review': 'évaluation par les pairs',
      showTabs: {
        Team: 'Équipe',
        Decision: 'Décision',
        'Manuscript text': 'Texte du manuscrit',
        Metadata: 'Métadonnées',
        'Tasks & Notifications': 'Tâches et notifications',
      },
      crossrefRetrievalEmail:
        'E-mail à utiliser pour la recherche de citations',
      crossrefSearchResultCount:
        'Nombre de résultats à retourner de la recherche de citations',
      crossrefStyleName: 'Sélectionnez le format pour les citations',
      crossrefLocaleName: 'Sélectionnez la langue pour les citations',
      production: {
        Production: 'Production',
        'Email to use for citation search':
          'E-mail à utiliser pour la recherche de citations',
        'Number of results to return from citation search':
          'Nombre de résultats à retourner de la recherche de citations',
        'Select style formatting for citations':
          'Sélectionnez le format pour les citations',
        apa: 'American Psychological Association (APA)',
        cmos: 'Manuel de style de Chicago (CMOS)',
        cse: 'Conseil des éditeurs scientifiques (CSE)',
        'Select locale for citations':
          'Sélectionnez la langue pour les citations',
      },
    },
    reportsPage: {
      Reports: 'Rapports',
      Show: 'Afficher',
      activityForManuscripts: 'activité pour les manuscrits arrivant',
      activityForManuscriptsTooltip: `Les métriques sont montrées pour les manuscrits qui ont été ajoutés en premier 
                    <br />
                    entre ces dates. Les limites de date sont 
                    <br />
                    à minuit en temps universel.`,
      'Editors workflow': 'Flux de travail des éditeurs',
      'All manuscripts': 'Tous les manuscrits',
      Submitted: 'Soumis',
      'Editor assigned': 'Éditeur assigné',
      'Decision complete': 'Décision finale',
      Accepted: 'Accepté',
      Published: 'Publié',
      'Reviewers workflow': 'Flux de travail des évaluateurs',
      'Reviewer invited': 'Évaluateur invité',
      'Invite accepted': 'Invitation acceptée',
      'Review completed': 'Évaluation terminée',
      'Manuscripts published today': "Manuscrits publiés aujourd'hui",
      'From midnight local time': 'À partir de minuit, heure locale',
      Average: 'Moyenne',
      'Manuscripts in progress': 'Manuscrits en cours',
      'Based on the selected date range':
        'Basé sur la plage de dates sélectionnée',
      reviwingAndEditing:
        "Durées de révision et d'édition pour les manuscrits individuels",
      'Days spent on': 'Jours passés sur',
      daysSpentReview: 'révision,',
      daysSpentPostreview: 'post-révision',
      'or incomplete': '(ou incomplet)',
      'Submission date': 'Date de soumission',
      summaryInfo: {
        'Average time to publish': 'Temps moyen pour publier',
        roundedDays: '{{days}} jour',
        roundedDays_plural: '{{days}} jours',
        'From submission to published': 'De la soumission à la publication',
        'Average time to review': "Temps moyen pour l'examen",
        awaitingRevision: 'En attente de révision',
        unassigned: 'Non assigné',
        reviewed: 'Évalué',
      },
      reportTypes: {
        Summmary: 'Résumé',
        Manuscript: 'Manuscrit',
        Editor: 'Éditeur',
        Reviewer: 'Évaluateur',
        Author: 'Auteur',
      },
      tables: {
        manuscripts: {
          'Manuscript number': 'Numéro du manuscrit',
          'Entry date': "Date d'entrée",
          Title: 'Titre',
          Author: 'Auteur',
          Editors: 'Éditeurs',
          Reviewers: 'Évaluateurs',
          Status: 'Statut',
          'Published date': 'Date de publication',
          reviewDuration: 'La revue a pris <strong>{{durations}}</strong> jour',
          reviewDuration_other:
            'La revue a pris <strong>{{durations}}</strong> jours',
          prevReviewDuration:
            'La revue précédente a pris <strong>{{durations}}</strong> jour',
          prevReviewDuration_other:
            'La revue précédente a pris <strong>{{durations}}</strong> jours',
          reviewDurations:
            'Les revues ont pris <strong>{{durations}}</strong> jours',
          prevReviewDurations:
            'Les revues précédentes ont pris <strong>{{durations}}</strong> jours',
        },
        editor: {
          'Editor name': "Nom de l'éditeur",
          'Manuscripts assigned': 'Manuscrits assignés',
          'Assigned for review': 'Assigné pour évaluation',
          Revised: 'Révisé',
          Rejected: 'Rejeté',
          Accepted: 'Accepté',
          Published: 'Publié',
        },
        reviewer: {
          'Reviewer name': "Nom de l'évaluateur",
          'Review invites': 'Invitations à évaluer',
          'Invites declined': 'Invitations déclinées',
          'Reviews completed': 'Évaluations terminées',
          'Average review duration': "Durée moyenne de l'évaluation",
          'Recommended to accept': 'Recommandé pour acceptation',
          'Recommended to revise': 'Recommandé pour révision',
          'Recommended to reject': 'Recommandé pour rejet',
          days: '{{days}} jour',
          days_plural: '{{days}} jours',
        },
        author: {
          'Author name': "Nom de l'auteur",
          revisionRequested: 'Révision demandée',
        },
      },
    },
    emailtemplatesPage: {
      'Email Templates': "Modèles d'email",
      Subject: 'Sujet',
      CC: 'CC',
      Body: 'Corps',
    },
    loginPage: {
      kotahiUses:
        'Kotahi utilise ORCID <0>icône</0> pour identifier les auteurs et le personnel.',
      'Login with ORCID': 'Se connecter avec ORCID',
      'Register with ORCID': "S'inscrire avec ORCID",
    },
    frontPage: {
      recent: 'Publications récentes dans {{brandName}}',
      Dashboard: 'Tableau de bord',
      Login: 'Connexion',
    },
    declineReviewPage: {
      youHaveDeclined:
        'Vous avez décliné une invitation à participer à une évaluation par les pairs.',
      reason:
        'Veuillez partager vos raisons de refuser cette invitation ci-dessous.',
      messageHere: 'Votre message ici...',
      dontWantContact: 'Je ne souhaite pas être recontacté',
      'Submit Feedback': 'Envoyer les commentaires',
      'Decline Invitation': "Refuser l'invitation",
      thanks: "Merci d'avoir soumis vos commentaires.",
    },
    reviewPreviewPage: {
      Summary: 'Résumé',
      Back: 'Retour',
    },
    sharedReviews: {
      'Other Reviews': 'Autres avis',
    },
    linkExpiredPage:
      "Ce lien d'invitation a expiré. Veuillez contacter l'administrateur système pour envoyer une nouvelle invitation.",
    waxEditor: {
      'Front matter tools': 'Outils de la section préliminaire',
      'Back matter tools': 'Outils de la section finale',
      'Front matter': 'Section préliminaire',
      'Change to front matter': 'Modifier la section préliminaire',
      'Funding Group': 'Groupe de financement',
      'Funding source': 'Source de financement',
      'Change to funding source': 'Modifier la source de financement',
      'Award ID': 'Identifiant de la subvention',
      'Change to award ID': "Modifier l'identifiant de la subvention",
      'Funding statement': 'Déclaration de financement',
      'Change to funding statement': 'Modifier la déclaration de financement',
      Keywords: 'Mots-clés',
      Keyword: 'Mot-clé',
      'Change to keyword': 'Modifier le mot-clé',
      'Keyword list': 'Liste de mots-clés',
      'Change to keyword list': 'Modifier la liste de mots-clés',
      Abstract: 'Résumé',
      'Change to abstract': 'Modifier le résumé',
      Appendices: 'Annexes',
      Appendix: 'Annexe',
      'Change to appendix': "Modifier l'annexe",
      Acknowledgements: 'Remerciements',
      'Change to acknowledgements': 'Modifier les remerciements',
      Glossary: 'Glossaire',
      'Glossary section': 'Section du glossaire',
      'Change to glossary section': 'Modifier la section du glossaire',
      'Glossary term': 'Terme du glossaire',
      'Change to glossary term': 'Modifier le terme du glossaire',
      'Glossary item': 'Élément du glossaire',
      'Change to glossary item': "Modifier l'élément du glossaire",
      Citations: 'Citations',
      'Reference list': 'Liste de références',
      'Change to reference list': 'Modifier la liste de références',
      Reference: 'Référence',
      'Change to reference': 'Modifier la référence',
    },
    manuscriptSubmit: {
      'Current version': 'Version actuelle',
      'Edit submission info': 'Modifier les informations de soumission',
      'Manuscript text': 'Texte du manuscrit',
      'Submit your research object': 'Soumettre votre objet de recherche',
      'Errors in your submission': 'Erreurs dans votre soumission',
      errorsList:
        'Il y a des erreurs dans votre soumission, veuillez corriger ce qui suit :',
      Submit: 'Soumettre',
      or: 'ou',
      'get back to your submission': 'revenir à votre soumission',
      'Submit a new version': 'Soumettre une nouvelle version',
      submitVersionButton: 'Soumettre une nouvelle version...',
      canModify:
        'Vous pouvez modifier et resoumettre une nouvelle version de votre manuscrit.',
      askedToRevise:
        'Il vous a été demandé de <strong>réviser</strong> votre manuscrit ; consultez les évaluations et la décision ci-dessous. Vous pouvez modifier et resoumettre une nouvelle version de votre manuscrit.',
      'Submitted info': 'Informations soumises',
      Reviews: 'Avis',
      'No reviews to show': 'Aucun avis à afficher.',
      'No completed reviews': 'Aucun avis terminé.',
      Metadata: 'Métadonnées',
    },
    chat: {
      'Your message here...': 'Votre message ici...',
      Send: 'Envoyer',
      noDiscussion:
        'Aucune discussion pour ce manuscrit pour le moment. Commencez par taper un message ci-dessous.',
      'Unread messages': 'Messages non lus',
      'Admin discussion': "Discussion d'administration",
      'Group Manager discussion': 'Discussion du gestionnaire de groupe',
      'Show admin discussion': "Afficher la discussion d'administration",
      'Show group manager discussion':
        'Afficher la discussion du gestionnaire de groupe',
      'Hide Chat': 'Masquer le chat',
      'Discussion with author': "Discussion avec l'auteur",
      'Editorial discussion': 'Discussion éditoriale',
      edit: 'Modifier',
      delete: 'Supprimer',
      Edited: 'Modifié',
      'Open video chat': 'Ouvrir le chat vidéo',
      Formatting: 'Mise en forme',
      'Hide formatting': 'Masquer la mise en forme',
    },
    taskManager: {
      list: {
        'Add your first task...': 'Ajoutez votre première tâche...',
        'Add a new task': 'Ajouter une nouvelle tâche',
        Title: 'Titre',
        Assignee: 'Attributaire',
        'Duration in days': 'Durée en jours',
        'Duration/Due Date': "Durée/Date d'échéance",
        'Unregistered User': 'Utilisateur non enregistré',
        'User Roles': 'Rôles des utilisateurs',
        'Registered Users': 'Utilisateurs enregistrés',
        userRoles: {
          Reviewer: 'Évaluateur',
          Editor: 'Éditeur',
          Author: 'Auteur',
        },
      },
      task: {
        durationDaysNone: 'Aucun',
        selectAssignee: 'Sélectionner...',
        'Give your task a name': 'Donnez un nom à votre tâche...',
        Edit: 'Modifier',
        Delete: 'Supprimer',
        'Click to mark as done': 'Cliquez pour marquer comme terminé',
        statuses: {
          Paused: 'En pause',
          Pause: 'Pause',
          'In progress': 'En cours',
          Continue: 'Continuer',
          Done: 'Terminé',
          Start: 'Commencer',
        },
        unregisteredUser: {
          Email: 'Email',
          Name: 'Nom',
        },
      },
    },
    tasksPage: {
      'Task Template Builder': 'Créateur de modèle de tâche',
    },
    usersTable: {
      Users: 'Utilisateurs',
      Name: 'Nom',
      Created: 'Créé',
      'Last Online': 'Dernière connexion',
      Roles: 'Rôles',
      Delete: 'Supprimer',
      Yes: 'Oui',
      Cancel: 'Annuler',
      None: 'Aucun',
    },
    modals: {
      inviteDeclined: {
        'Invitation Decline': "Refus de l'invitation de {{name}}",
        Declined: 'Refusé : {{dateString}}',
        Reviewer: 'Évaluateur :',
        Status: 'Statut',
        declinedBadge: 'Refusé',
        'Opted Out': 'Opté pour sortir',
        'Declined Reason': 'Raison du refus',
        'No reason provided': 'Aucune raison fournie.',
      },
      reviewReport: {
        'Review Report': "Rapport d'évaluation de {{name}}",
        'Last Updated': 'Dernière mise à jour : {{dateString}}',
        Reviewer: 'Évaluateur :',
        Status: 'Statut',
        reviewNotCompleted: "L'évaluation n'a pas encore été terminée",
        Delete: 'Supprimer',
        Shared: 'Partagé',
        Recommendation: 'Recommandation',
        'Hide Review': "Masquer l'évaluation",
        'Hide Reviewer Name': "Masquer le nom de l'évaluateur",
      },
      inviteReviewer: {
        'Invite Reviewer': 'Inviter un évaluateur',
        Shared: 'Partagé',
        'Email Notification': 'Notification par email',
        Cancel: 'Annuler',
        Invite: 'Inviter',
      },
      deleteReviewer: {
        'Delete this reviewer': 'Supprimer cet évaluateur ?',
        Reviewer: 'Évaluateur :',
        Ok: 'Ok',
        Cancel: 'Annuler',
      },
      taskDelete: {
        permanentlyDelete: 'Supprimer définitivement cette tâche ?',
        Ok: 'Ok',
        Cancel: 'Annuler',
      },
      taskEdit: {
        'Task details': 'Détails de la tâche',
        'Task title': 'Titre de la tâche',
        Save: 'Enregistrer',
        'Give your task a name': 'Donnez un nom à votre tâche...',
        Assignee: 'Attributaire',
        'Due date': "Date d'échéance",
        'Duration in days': 'Durée en jours',
        'Add Notification Recipient': 'Ajouter un destinataire de notification',
        Recipient: 'Destinataire',
        'Select a recipient': 'Sélectionner un destinataire',
        'Select email template': "Sélectionner un modèle d'email",
        'Send notification': 'Envoyer une notification',
        Send: 'Envoyer',
        days: 'jours',
        before: 'avant',
        after: 'après',
        'due date': "date d'échéance",
        'Send Now': 'Envoyer maintenant',
        'Show all notifications sent':
          'Afficher toutes les notifications envoyées ({{count}})',
        'Hide all notifications sent':
          'Masquer toutes les notifications envoyées ({{count}})',
      },
      deleteField: {
        'Permanently delete this field': 'Supprimer définitivement ce champ ?',
        Ok: 'Ok',
        Cancel: 'Annuler',
      },
      deleteForm: {
        'Permanently delete this form':
          'Supprimer définitivement ce formulaire ?',
        Ok: 'Ok',
        Cancel: 'Annuler',
      },
      assignUserRole: {
        text:
          "Souhaitez-vous attribuer le rôle de <strong>{{role}}</strong> à l'utilisateur {{user}} ?",
      },
      removeUserRole: {
        text:
          "Souhaitez-vous retirer le rôle de <strong>{{role}}</strong> à l'utilisateur {{user}} ?",
      },
      deleteUser: {
        'Permanently delete user':
          "Supprimer définitivement l'utilisateur {{userName}} ?",
        Delete: 'Supprimer',
        Cancel: 'Annuler',
      },
      cmsPageDelete: {
        Cancel: 'Annuler',
        Delete: 'Supprimer',
        permanentlyDelete: 'Supprimer définitivement la page {{pageName}} ?',
      },
      deleteMessage: {
        'Are you sure you want to delete this message?':
          'Êtes-vous sûr de vouloir supprimer ce message ?',
      },
      editMessage: {
        'Edit message': 'Éditer le message',
        save: 'Sauvegarder',
        cancel: 'Annuler',
      },
      publishError: {
        'Some targets failed to publish':
          'Échec de la publication de certaines cibles.',
        'Publishing error': 'Erreur de publication',
      },
    },

    newSubmission: {
      'New submission': 'Nouvelle soumission',
      'Submission created': 'Soumission créée',
      'Upload Manuscript': 'Télécharger le manuscrit',
      dragNDrop: 'Glisser-déposer ou cliquer pour sélectionner un fichier',
      acceptedFiletypes:
        'Types de fichiers acceptés : pdf, epub, zip, docx, latex',
      converting:
        "Votre manuscrit est en train d'être converti en une version directement éditable. Cela peut prendre quelques secondes.",
      'Submit a URL instead': 'Soumettre une URL à la place',
      errorUploading: '{{error}}',
    },
    formBuilder: {
      'New Form': 'Nouveau formulaire',
      'Create Form': 'Créer un formulaire',
      'Update Form': 'Mettre à jour le formulaire',
      'Form purpose identifier': 'Identifiant du but du formulaire',
      'Form Name': 'Nom du formulaire',
      Description: 'Description',
      'Submit on Popup': 'Soumettre dans une popup',
      submitYes: 'Oui',
      submitNo: 'Non',
      'Popup Title': 'Titre de la popup',
      'Field Properties': 'Propriétés du champ',
      'Field type': 'Type de champ',
      'Field title': 'Titre du champ',
      'Field name': 'Nom (nom de champ interne)',
      'Field placeholder': 'Espace réservé du champ',
      internalNameDescription:
        'Utilisez soit "submission.votreNomDeChampIci", soit l\'un des suivants : "meta.title" pour le titre du manuscrit, "meta.abstract" pour le résumé, "fileName" pour les fichiers supplémentaires, "visualAbstract" pour un résumé visuel, ou "manuscriptFile" pour un fichier de manuscrit.',
      'Field description': 'Description du champ',
      'Field options': 'Options du champ',
      'Field shortDescription':
        'Titre court (facultatif — utilisé dans les listes concises)',
      'Field validate': 'Options de validation',
      'Field hideFromReviewers': 'Masquer des évaluateurs ?',
      'Field hideFromAuthors': 'Masquer des auteurs ?',
      'Field permitPublishing':
        'Inclure lors du partage ou de la publication ?',
      'Field publishingTag': 'Tag Hypothesis',
      'FieldDescription publishingTag':
        "Vous pouvez spécifier une étiquette à utiliser lors du partage de ce champ en tant qu'annotation Hypothesis.",
      'Label to display': 'Étiquette à afficher',
      'Color label': 'Étiquette de couleur',
      'Enter label': 'Entrer une étiquette...',
      'Internal name': 'Nom interne',
      'Enter name': 'Entrer un nom...',
      'Add another option': 'Ajouter une autre option',
      'Delete this option': 'Supprimer cette option',
      validateInputPlaceholder: 'Sélectionner...',
      'Field parse': 'Analyse spéciale',
      'Field format': 'Formatage spécial',
      'Field doiValidation': 'Valider comme un DOI ?',
      'Field doiUniqueSuffixValidation':
        "Valider comme un suffixe DOI et s'assurer qu'il est unique ?",
      'Update Field': 'Mettre à jour le champ',
      'Correct invalid values before updating':
        'Corriger les valeurs invalides avant la mise à jour',
      'Add Field': 'Ajouter un champ',
      'New Field': 'Nouveau champ',
      'Field inline': 'Champ en ligne',
      'Field sectioncss': 'CSS de la section du champ',
      typeOptions: {
        Select: 'Sélection',
        ManuscriptFile: 'Fichier du manuscrit',
        SupplementaryFiles: 'Pièces jointes',
        VisualAbstract: 'Pièce jointe image unique',
        AuthorsInput: 'Liste des contributeurs',
        LinksInput: 'Liste de liens (URIs)',
        AbstractEditor: 'Texte enrichi',
        TextField: 'Texte',
        CheckboxGroup: 'Cases à cocher',
        RadioGroup: 'Boutons radio',
        undefined: '',
        ThreadedDiscussion: 'Discussion',
      },
      submission: {
        title: 'Créateur de formulaire de soumission',
      },
      review: {
        title: 'Créateur de formulaire de revue',
      },
      decision: {
        title: 'Créateur de formulaire de décision',
      },
    },
    fields: {
      hideFromReviewers: {
        true: 'Oui',
        false: 'Non',
      },
      hideFromAuthors: {
        true: 'Oui',
        false: 'Non',
      },
      permitPublishing: {
        false: 'Jamais',
        true:
          "Ad hoc (l'éditeur décide au moment du partage/de la publication)",
        always: 'Toujours',
      },
      validate: {
        required: 'Requis',
        minChars: 'Nombre minimal de caractères',
        maxChars: 'Nombre maximal de caractères',
        minSize: "Nombre minimal d'éléments",
        labels: {
          minChars: 'Valeur du nombre minimal de caractères',
          maxChars: 'Valeur du nombre maximal de caractères',
          minSize: "Valeur du nombre minimal d'éléments",
        },
      },
      parse: {
        false: 'Aucun',
        split: 'Diviser aux virgules',
      },
      format: {
        false: 'Aucun',
        join: 'Joindre avec des virgules',
      },
      doiValidation: {
        true: 'Oui',
        false: 'Non',
      },
      doiUniqueSuffixValidation: {
        true: 'Oui',
        false: 'Non',
      },
      inline: {
        true: 'Oui',
        false: 'Non',
      },
    },
  },
}

export default fr
