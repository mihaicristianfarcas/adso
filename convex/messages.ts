import { mutation } from './_generated/server'
import { v } from 'convex/values'

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
