const { pickBy } = require('lodash')

class XpubCollabraMode {
  /**
   * Creates a new instance of XpubCollabraMode
   *
   * @param {string} userId A user's UUID
   * @param {string} operation The operation you're authorizing for
   * @param {any} object The object of authorization
   * @param {any} context Context for authorization, e.g. database access
   * @returns {string}
   */
  constructor(userId, operation, object, context) {
    this.userId = userId
    this.operation = XpubCollabraMode.mapOperation(operation)
    this.object = object
    this.context = context
  }

  /**
   * Maps operations from HTTP verbs to semantic verbs
   *
   * @param {any} operation
   * @returns {string}
   */
  static mapOperation(operation) {
    const operationMap = {
      GET: 'read',
      POST: 'create',
      PATCH: 'update',
      DELETE: 'delete',
    }

    return operationMap[operation] ? operationMap[operation] : operation
  }

  /**
   * Checks if user is a member of a team of a certain type for a certain object
   *
   * @param {any} user
   * @param {any} teamType
   * @param {any} object
   * @returns {boolean}
   */
  async isTeamMember(teamType, object) {
    if (!this.user || !Array.isArray(this.user.teams)) {
      return false
    }

    let membershipCondition
    if (object) {
      // We're asking if a user is a member of a team for a specific object
      membershipCondition = team =>
        team.teamType === teamType &&
        team.object &&
        team.object.id === object.id
    } else {
      // We're asking if a user is a member of a global team
      membershipCondition = team => team.teamType === teamType && !team.object
    }

    const memberships = await Promise.all(
      this.user.teams.map(async teamId => {
        const team = await this.context.models.Team.find(teamId)
        return membershipCondition(team)
      }),
    )

    return memberships.includes(true)
  }

  /**
   * Returns permissions for unauthenticated users
   *
   * @param {any} operation
   * @param {any} object
   * @returns {boolean}
   */
  unauthenticatedUser(object) {
    return this.operation === 'something public'
  }

  /**
   * Checks if the user is an author, as represented with the owners
   * relationship
   *
   * @param {any} object
   * @returns {boolean}
   */
  isAuthor(object) {
    if (!object || !object.owners || !this.user) {
      return false
    }
    return object.owners.includes(this.user.id)
  }

  /**
   * Checks if the user is an author, as represented with the owners
   * relationship
   *
   * @returns {boolean}
   */
  isAdmin() {
    return this.user && this.user.admin
  }

  /**
   * Checks if user is a handling editor (member of a team of type handling editor) for an object
   *
   * @returns {boolean}
   */
  isAssignedHandlingEditor(object) {
    return this.isTeamMember('handlingEditor', object)
  }

  /**
   * Checks if user is a senior editor (member of a team of type senior editor) for an object
   *
   * @returns {boolean}
   */
  isAssignedSeniorEditor(object) {
    return this.isTeamMember('seniorEditor', object)
  }

  /**
   * Checks if user is a senior editor (member of a team of type senior editor) for an object
   *
   * @returns {boolean}
   */
  isManagingEditor() {
    return this.isTeamMember('managingEditor')
  }

  /**
   * Checks if userId is present, indicating an authenticated user
   *
   * @param {any} userId
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.userId
  }

  /**
   * Checks if a user can create a collection.
   *
   * @returns {boolean}
   */
  canCreateCollection() {
    return this.isAuthenticated()
  }

  /**
   * Checks if a user can read a specific collection
   *
   * @returns {boolean}
   *
   */
  async canReadCollection() {
    if (!this.isAuthenticated()) {
      return false
    }

    this.user = await this.context.models.User.find(this.userId)

    if (await this.isManagingEditor()) {
      return true
    }

    const collection = await this.context.models.Collection.find(this.object.id)

    const permission =
      this.isAuthor(collection) ||
      (await this.isAssignedHandlingEditor(collection)) ||
      (await this.isAssignedSeniorEditor(collection))

    return permission
  }

  /**
   * Checks if a user can list users
   *
   * @returns {boolean}
   */
  async canListUsers() {
    if (!this.isAuthenticated()) {
      return false
    }

    this.user = await this.context.models.User.find(this.userId)

    return true
  }

  /**
   * Checks if a user can read a specific user
   *
   * @returns {boolean}
   */
  async canReadUser() {
    if (!this.isAuthenticated()) {
      return false
    }

    this.user = await this.context.models.User.find(this.userId)

    if (this.user.id === this.object.id) {
      return true
    }
    return {
      filter: user =>
        pickBy(user, (_, key) => ['id', 'username', 'type'].includes(key)),
    }
  }

  /**
   * Checks if a user can read a fragment
   *
   * @returns {boolean}
   */
  async canReadFragment() {
    if (!this.isAuthenticated()) {
      return false
    }

    // Caveat: this means every logged-in user can read every fragment (but needs its UUID)
    // Ideally we'd check if the fragment (version) belongs to a collection (project)
    // where the user is a member of a team with the appropriate rights. However there is no
    // link from a fragment back to a collection at this point. Something to keep in mind!
    return true
  }

  /**
   * Checks if a user can list collections
   *
   * @returns {boolean}
   */
  async canListCollections() {
    if (!this.isAuthenticated()) {
      return false
    }
    this.user = await this.context.models.User.find(this.userId)

    if (await this.isManagingEditor()) {
      return true
    }

    return {
      filter: async collections => {
        const filteredCollections = await Promise.all(
          collections.map(async collection => {
            const condition =
              this.isAuthor(collection) ||
              (await this.isAssignedHandlingEditor(collection)) || // eslint-disable-line
              (await this.isAssignedSeniorEditor(collection)) // eslint-disable-line
            return condition ? collection : undefined // eslint-disable-line
          }, this),
        )

        return filteredCollections.filter(collection => collection)
      },
    }
  }

  /**
   * Checks if a user can create fragments
   *
   * @returns {boolean}
   */
  canCreateFragment() {
    if (!this.isAuthenticated()) {
      return false
    }
    return true
  }

  /**
   * Checks if a user can create a fragment in a specific collection
   *
   * @returns {boolean}
   */
  async canCreateFragmentInACollection() {
    if (!this.isAuthenticated()) {
      return false
    }

    this.user = await this.context.models.User.find(this.userId)

    const { collection } = this.object
    if (collection) {
      const permission =
        this.isAuthor(collection) ||
        (await this.isAssignedHandlingEditor(collection)) ||
        (await this.isAssignedSeniorEditor(collection))

      return permission
    }

    return false
  }

  /**
   * Checks if a user can be created
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line
  canCreateUser() {
    return true
  }

  /**
   * Checks if a user can create a team
   *
   * @returns {boolean}
   * @memberof XpubCollabraMode
   */
  canCreateTeam() {
    if (!this.isAuthenticated()) {
      return false
    }
    return true
  }

  /**
   * Checks if a user can delete a collection
   *
   * @returns {boolean}
   */
  async canDeleteCollection() {
    this.user = await this.context.models.User.find(this.userId)
    return this.isAuthor(this.object)
  }

  /**
   * Checks if a user can read a team
   *
   * @returns {boolean}
   */
  // eslint-disable-next-line
  async canReadTeam() {
    return true
  }
}

module.exports = {
  // This runs before all other authorization queries and is used here
  // to allow admin to do everything
  before: async (userId, operation, object, context) => {
    const user = await context.models.User.find(userId)
    return user.admin
  },
  GET: (userId, operation, object, context) => {
    const mode = new XpubCollabraMode(userId, operation, object, context)

    // GET /api/collections
    if (object && object.path === '/collections') {
      return mode.canListCollections()
    }

    // GET /api/users
    if (object && object.path === '/users') {
      return mode.canListUsers()
    }

    // GET /api/fragments
    if (object && object.path === '/fragments') {
      return mode.canListFragments()
    }

    // GET /api/teams
    if (object && object.path === '/teams') {
      return mode.canListTeams()
    }

    // GET /api/collection
    if (object && object.type === 'collection') {
      return mode.canReadCollection()
    }

    // GET /api/fragment
    if (object && object.type === 'fragment') {
      return mode.canReadFragment()
    }

    // GET /api/team
    if (object && object.type === 'team') {
      return mode.canReadTeam()
    }

    // GET /api/user
    if (object && object.type === 'user') {
      return mode.canReadUser()
    }

    return false
  },
  POST: (userId, operation, object, context) => {
    const mode = new XpubCollabraMode(userId, operation, object, context)

    // POST /api/collections
    if (object && object.path === '/collections') {
      return mode.canCreateCollection()
    }

    // POST /api/users
    if (object && object.path === '/users') {
      return mode.canCreateUser()
    }

    // POST /api/fragments
    if (object && object.path === '/fragments') {
      return mode.canCreateFragment()
    }

    // POST /api/collections/:collectionId/fragments
    if (object && object.path === '/collections/:collectionId/fragments') {
      return mode.canCreateFragmentInACollection()
    }

    // POST /api/teams
    if (object && object.path === '/teams') {
      return mode.canCreateTeam()
    }

    return false
  },
  PATCH: (userId, operation, object, context) => {
    const mode = new XpubCollabraMode(userId, operation, object, context)

    // PATCH /api/collections/:id
    if (object && object.type === 'collection') {
      return mode.canUpdateCollection()
    }

    // PATCH /api/users/:id
    if (object && object.type === 'user') {
      return mode.canUpdateUser()
    }

    // PATCH /api/fragments/:id
    if (object && object.type === 'fragment') {
      return mode.canUpdateFragment()
    }

    // PATCH /api/teams/:id
    if (object && object.type === 'team') {
      return mode.canUpdateTeam()
    }

    return false
  },
  DELETE: (userId, operation, object, context) => {
    const mode = new XpubCollabraMode(userId, operation, object, context)

    // DELETE /api/collections/:id
    if (object && object.type === 'collection') {
      return mode.canDeleteCollection()
    }

    // DELETE /api/users/:id
    if (object && object.type === 'users') {
      return mode.canDeleteUser()
    }

    // DELETE /api/fragments/:id
    if (object && object.type === 'fragments') {
      return mode.canDeleteFragment()
    }

    // DELETE /api/teams/:id
    if (object && object.type === 'teams') {
      return mode.canDeleteTeam()
    }

    return false
  },
  // Example of a specific authorization query. Notice how easy it is to respond to this.
  'list collections': (userId, operation, object, context) => {
    const mode = new XpubCollabraMode(userId, operation, object, context)
    return mode.canListCollections()
  },
  create: (userId, operation, object, context) => {
    const mode = new XpubCollabraMode(userId, operation, object, context)

    if (object === 'collections' || object.type === 'collection') {
      return mode.canCreateCollection()
    }

    return false
  },
  read: (userId, operation, object, context) => {
    const mode = new XpubCollabraMode(userId, operation, object, context)

    if (object === 'collections') {
      return mode.canListCollections()
    }

    if (object.type === 'collection') {
      return mode.canReadCollection()
    }

    if (object === 'users') {
      return mode.canListUsers()
    }

    if (object.type === 'user') {
      return mode.canReadUser()
    }

    return false
  },
}
