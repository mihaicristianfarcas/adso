import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id('documents')),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    // tags: v.optional(v.array(v.string())),
    // createdAt: v.timestamp(),
    isPublished: v.boolean()
  })
    .index('by_user', ['userId'])
    .index('by_user_parent', ['userId', 'parentDocument']),

  messages: defineTable({
    documentId: v.id('documents'),
    userId: v.string(),
    content: v.string(),
    role: v.union(v.literal('user'), v.literal('assistant')),
    metadata: v.optional(v.any())
  })
    .index('by_document', ['documentId'])
    .index('by_user', ['userId'])
})
