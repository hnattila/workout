import { describe, test, expect } from 'vitest'
import { userService } from './user-service'
import { db } from '@/server/db'
describe('UserService', () => {
  test('hello', () => {
    expect(userService).toBeDefined()
  })

  test('createUser', async () => {
    const email = 'heikki@localhost.local'
    const name = 'Heikki'
    const user = await userService.createUser({ email, name })
    expect(user).toBeDefined()
    expect(user.email).toBe(email)
    expect(user.name).toBe(name)
  })

  test('empty db', async () => {
    const result = await db.query.users.findMany()
    expect(result?.length).toBe(0)
  })

  test('db', async () => {
    // console.log('db', db)
    expect(db).toBeDefined()
  })

  test('setPassword', async () => {})
})
