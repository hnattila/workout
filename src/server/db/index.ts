import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'
import { createClient } from '@libsql/client'

// export const client = createClient({ url: process.env.DB_FILE_NAME! })
// export const db = drizzle({ client, schema })

export const db = drizzle(process.env.DB_FILE_NAME!, { schema })
