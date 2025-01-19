import 'server-only'

import { db } from '@/server/db'
import { InsertUser, passwords, SelectUser, users } from '@/server/db/schema'
import { isDefined, isNotEmpty } from '@/lib/utils'

import { eq } from 'drizzle-orm'
import * as argon2 from 'argon2'

export class UserService {
  async authenticate({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<SelectUser | undefined> {
    console.log('authenticating user', email)
    const user = await this.getUserByEmail(email)
    if (!isDefined(user)) {
      return undefined
    }

    const pw = await db.query.passwords.findFirst({
      where: (pw, { eq }) => eq(pw.userId, user.id),
    })

    if (!isDefined(pw) || !pw.hash) {
      return undefined
    }

    const isOk = await argon2.verify(pw.hash, password)
    if (!isOk) {
      return undefined
    }

    return user
  }

  async createUser(data: Omit<InsertUser, 'createdAt' | 'updatedAt'>) {
    const createdAt = Date.now()
    const values: InsertUser = {
      ...data,
      createdAt,
      updatedAt: createdAt,
    }

    const result = await db.insert(users).values(values).returning()
    console.log('result', result)
    return result[0]
  }

  async checkPassword({
    userId,
    password,
  }: {
    userId: number
    password: string
  }) {
    const result = await db
      .select({
        userId: passwords.userId,
        hash: passwords.hash,
      })
      .from(passwords)
      .where(eq(passwords.userId, userId))
      .limit(1)

    if (!isNotEmpty(result)) {
      return false
    }
    if (!isNotEmpty(result[0].hash)) {
      return false
    }

    const isOk = await argon2.verify(result[0].hash, password)
    return isOk
  }

  async setPassword({
    userId,
    password,
  }: {
    userId: number
    password: string
  }) {
    const hash = await argon2.hash(password)
    const createdAt = Date.now()
    const updatedAt = createdAt
    await db.transaction(async tx => {
      const pw = await tx
        .select()
        .from(passwords)
        .where(eq(passwords.userId, userId))
      if (isDefined(pw)) {
        tx.update(passwords)
          .set({
            hash,
            updatedAt,
          })
          .where(eq(passwords.userId, userId))
      } else {
        tx.insert(passwords).values({
          userId,
          hash,
          createdAt,
          updatedAt,
        })
      }
    })
  }

  async getUserByEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    })
    return user
  }
}

export const userService = new UserService()
