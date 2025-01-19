import { int, sqliteTable, text, real } from 'drizzle-orm/sqlite-core'

const timestamps = {
  updatedAt: real(),
  createdAt: real().notNull(),
  deletedAt: real(),
}

export const users = sqliteTable('users', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
  ...timestamps,
})

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect

export const passwords = sqliteTable('passwords', {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int()
    .notNull()
    .references(() => users.id),
  hash: text(),
  ...timestamps,
})
