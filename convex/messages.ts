import { v } from 'convex/values'
import { mutation } from './_generated/server'

export const create = mutation({
  args: {
    documentId: v.id('documents'),
    content: v.string(),
    role: v.union(v.literal('user'), v.literal('assistant')),
    metadata: v.optional(v.any())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const message = await ctx.db.insert('messages', {
      documentId: args.documentId,
      userId,
      content: args.content,
      role: args.role,
      metadata: args.metadata
    })

    return message
  }
})

export const getConversationHistory = mutation({
  args: {
    documentId: v.id('documents')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      throw new Error('Not authenticated')
    }

    const userId = identity.subject

    const document = await ctx.db.get(args.documentId)

    if (!document) {
      throw new Error('Document not found')
    }

    if (document.userId !== userId) {
      throw new Error('Unauthorized')
    }

    const conversationHistory = await ctx.db
      .query('messages')
      .withIndex('by_document', q => q.eq('documentId', args.documentId))
      .collect()

    return conversationHistory.sort((a, b) => a._creationTime - b._creationTime)
  }
})
