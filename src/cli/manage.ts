import { program } from 'commander'

import * as readline from 'node:readline'

import { userService } from '@/server/services/user-service'

function readInput({ prompt }: { prompt: string }) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  let value = ''

  rl.question(prompt, name => {
    value = name
    rl.close()
  })
  return value
}

program.version('1.0.0').description('Workout Management CLI')

program
  .command('createuser <username>')
  .description('Create a new user')
  .action(async username => {
    console.log(`Creating user ${username} with password`)
    // const user = await userService.getUserByEmail(username)
    const user = await userService.createUser({
      email: username,
      name: username,
    })
    console.log('user', user)
  })

program
  .command('setpassword <username>')
  .description('Change user password')
  .action(async username => {
    console.log(`Changing password for user ${username}`)
    const user = await userService.getUserByEmail(username)
    if (!user) {
      program.error('error: User not found')
    }
    const userId = user.id
    const password = readInput({ prompt: 'Enter new password: ' })
    await userService.setPassword({ userId, password })
  })

program.parse(process.argv)
