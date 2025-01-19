import { drizzle } from 'drizzle-orm/libsql'
import { copyFile } from 'fs/promises'
import { beforeEach, afterEach, vi } from 'vitest'

import * as schema from '@/server/db/schema'

vi.mock('server-only', () => {
  return {
    // mock server-only module
  }
})

beforeEach(async () => {
  // process.env.DB_FILE_NAME = `file:${dbName}`

  if (process.env.DB_FILE_NAME && process.env.TESTBASE_DB_FILE_NAME) {
    if (process.env.DB_FILE_NAME.indexOf('test') >= 0) {
      const _dbName = process.env.DB_FILE_NAME.replace('file:', '')
      await copyFile(process.env.TESTBASE_DB_FILE_NAME, _dbName)
    }
  }

  vi.resetAllMocks()
  vi.resetModules()

  vi.mock('@/server/db', async importOriginal => {
    const _getDb = async () => {
      const baseDbName = process.env.TESTBASE_DB_FILE_NAME
      if (
        baseDbName === undefined ||
        baseDbName === null ||
        baseDbName === ''
      ) {
        throw new Error('TESTBASE_DB_FILE_NAME not set')
      }

      const num = `${Math.floor(Math.random() * 10000)}`.padStart(5, '0')
      const dbName = `__testdb__/test_${num}.sqlite3`

      await copyFile(baseDbName, dbName)

      vi.stubEnv('DB_FILE_NAME', `file:${dbName}`)
      process.env.DB_FILE_NAME = `file:${dbName}`
      return dbName
    }
    const __dbName = `file:${await _getDb()}`

    const db = drizzle(__dbName, { schema })
    return {
      ...(await importOriginal<typeof import('@/server/db')>()),
      db,
      __dbName,
    }
  })
})
