import { exec } from 'child_process'
import util from 'util'
import { mkdir } from 'fs/promises'
import { unlink } from 'fs/promises'

export default async function setup() {
  const num = `${Math.floor(Math.random() * 10000)}`.padStart(5, '0')
  const baseDbName = `__testdb__/testbase_${num}.sqlite3`
  process.env.TESTBASE_DB_FILE_NAME = `${baseDbName}`

  await mkdir('__testdb__', { recursive: true })

  const execPromise = util.promisify(exec)

  const start = Date.now()
  const p = await execPromise(
    `npx drizzle-kit push --dialect sqlite --schema "./src/server/db/schema.ts" --url "file:${process.env.TESTBASE_DB_FILE_NAME}"`,
  )
  const latency = Date.now() - start
  console.log(p)

  console.log(`db_setup latency=${latency}ms`)

  return () => {
    console.log('teardown', baseDbName)
    unlink(baseDbName)
      .then(() => {
        console.log(`Deleted test database: ${baseDbName}`)
      })
      .catch(err => {
        console.error(`Error deleting test database: ${baseDbName}`, err)
      })
  }
}
