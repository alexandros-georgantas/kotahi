const { pubsubManager } = require('@coko/server')

const { getPubsub } = pubsubManager

// Fires immediately when the message is created
const MESSAGE_CREATED = 'MESSAGE_CREATED'
const MESSAGE_UPDATED = 'MESSAGE_UPDATED'
const MESSAGE_DELETED = 'MESSAGE_DELETED'

const Message = require('../../../models/message/message.model')
const ChannelMember = require('../../../models/channelMember/channelMember.model')

const {
  getChannelMemberByChannel,
  addUsersToChatChannel,
} = require('../../model-channel/src/channelCommsUtils')

const {
  notify,
} = require('../../model-notification/src/notificationCommsUtils')

const resolvers = {
  Query: {
    message: async (_, { messageId }) => {
      Message.find(messageId)
    },
    messages: async (_, { channelId, first = 20, before }, context) => {
      let messagesQuery = Message.query()
        .where({ channelId })
        .withGraphJoined('user')
        .limit(first)
        .orderBy('messages.created', 'desc')

      if (before) {
        const firstMessage = await Message.query().findById(before)
        messagesQuery = messagesQuery.where(
          'messages.created',
          '<',
          firstMessage.created,
        )
      }

      const messages = (await messagesQuery).reverse()
      const total = await messagesQuery.resultSize()

      const channelMember = await getChannelMemberByChannel({
        channelId,
        userId: context.user,
      })

      let unreadMessagesCount = [{ count: 0 }]
      let firstUnreadMessage = null

      if (channelMember) {
        unreadMessagesCount = await Message.query()
          .where({ channelId })
          .where('created', '>', channelMember.lastViewed)
          .count()

        firstUnreadMessage = await Message.query()
          .select('id')
          .where({ channelId })
          .where('created', '>', channelMember.lastViewed)
          .orderBy('created', 'asc')
          .first()
      }

      return {
        edges: messages,
        pageInfo: {
          startCursor: messages[0] && messages[0].id,
          hasPreviousPage: total > first,
        },
        unreadMessagesCount: unreadMessagesCount[0].count,
        firstUnreadMessageId: firstUnreadMessage?.id,
      }
    },
    // Calculates the total number of unread  messages count from more then one channels for the current user.
    unreadMessagesCount: async (_, { channelIds }, context) => {
      const promises = channelIds.map(async channelId => {
        const channelMember = await getChannelMemberByChannel({
          channelId,
          userId: context.user,
        })

        if (channelMember) {
          const unreadMessagesCount = await Message.query()
            .where({ channelId })
            .where('created', '>', channelMember.lastViewed)
            .count()

          return parseInt(unreadMessagesCount[0].count, 10)
        }

        return 0
      })

      const unreadCounts = await Promise.all(promises)

      const totalUnreadMessagesCount = unreadCounts.reduce(
        (acc, count) => acc + count,
        0,
      )

      return totalUnreadMessagesCount
    },
  },
  Mutation: {
    createMessage: async (_, { content, channelId }, context) => {
      const pubsub = await getPubsub()
      const currentUserId = context.user

      const savedMessage = await new Message({
        content,
        userId: currentUserId,
        channelId,
      }).save()

      const message = await Message.query()
        .findById(savedMessage.id)
        .withGraphJoined('[user, channel]')

      pubsub.publish(`${MESSAGE_CREATED}.${channelId}`, message.id)

      // using Set() to avoid having duplicate user ids
      const taggedUserIds = new Set()

      const taggedRegex =
        /<span class="mention-tag" id="([^"]+)">@([^<]+)<\/span>/g

      let match

      // eslint-disable-next-line no-cond-assign
      while ((match = taggedRegex.exec(content))) {
        const taggedUserId = match[1]
        taggedUserIds.add(taggedUserId)
      }

      const channelMembers = await ChannelMember.query()
        .where({
          channelId: message.channelId,
        })
        .whereNot({ userId: message.userId })

      await addUsersToChatChannel(channelId, [...taggedUserIds, context.user])

      // Notify non-mentioned users
      notify(['chat', message.channelId], {
        time: message.created,
        context: { messageId: message.id },
        users: channelMembers
          .filter(member => !taggedUserIds.has(member.userId))
          .map(member => member.userId),
        groupId: message.channel.groupId,
      })

      // Notify mentioned users
      notify(['chat', message.channelId], {
        time: message.created,
        context: { messageId: message.id, isMentioned: true },
        users: [...taggedUserIds],
        groupId: message.channel.groupId,
        currentUserId,
      })

      return message
    },
    updateMessage: async (_, { messageId, content }) => {
      const updatedMessage = await Message.query().patchAndFetchById(
        messageId,
        { content },
      )

      const pubsub = await getPubsub()
      pubsub.publish(
        `${MESSAGE_UPDATED}.${updatedMessage.channelId}`,
        updatedMessage.id,
      )

      return updatedMessage
    },
    deleteMessage: async (_, { messageId }) => {
      const deleteMessage = await Message.query().findById(messageId).first()

      if (!deleteMessage) {
        throw new Error('Message not found')
      }

      const pubsub = await getPubsub()

      await Message.query().deleteById(messageId)

      pubsub.publish(
        `${MESSAGE_DELETED}.${deleteMessage.channelId}`,
        deleteMessage,
      )

      return deleteMessage
    },
  },
  Subscription: {
    messageCreated: {
      resolve: async (messageId, _, context) => {
        const message = await Message.query()
          .findById(messageId)
          .withGraphJoined('user')

        return message
      },
      subscribe: async (_, vars, context) => {
        const pubsub = await getPubsub()
        return pubsub.asyncIterator(`${MESSAGE_CREATED}.${vars.channelId}`)
      },
    },
    messageUpdated: {
      resolve: async (messageId, _, context) => {
        const message = await Message.query()
          .findById(messageId)
          .withGraphJoined('user')

        return message
      },
      subscribe: async (_, vars, context) => {
        const pubsub = await getPubsub()
        return pubsub.asyncIterator(`${MESSAGE_UPDATED}.${vars.channelId}`)
      },
    },
    messageDeleted: {
      resolve: async (deletedMessage, _, context) => {
        return deletedMessage
      },
      subscribe: async (_, vars) => {
        const pubsub = await getPubsub()
        return pubsub.asyncIterator(`${MESSAGE_DELETED}.${vars.channelId}`)
      },
    },
  },
}

const typeDefs = `
  type Message {
    content: String
    user: User
    id: String
    created: DateTime
    updated: DateTime
  }

  type PageInfo {
    startCursor: String
    hasPreviousPage: Boolean
    hasNextPage: Boolean
  }

  type MessagesRelay {
    edges: [Message]
    pageInfo: PageInfo
    unreadMessagesCount: Int!
    firstUnreadMessageId: ID
  }

  extend type Query {
    message(messageId: ID): Message
    messages(channelId: ID, first: Int, after: String, before: String): MessagesRelay
    unreadMessagesCount(channelIds: [ID!]!): Int!
  }

  extend type Mutation {
    createMessage(content: String, channelId: String, userId: String): Message
    deleteMessage(messageId: ID!): Message!
    updateMessage(messageId: ID!, content: String!): Message!
  }

  extend type Subscription {
    messageCreated(channelId: ID!): Message!
    messageUpdated(channelId: ID!): Message!
    messageDeleted(channelId: ID!): Message!
  }
`

module.exports = { typeDefs, resolvers }
