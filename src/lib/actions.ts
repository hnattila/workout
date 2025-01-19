'use server'

import { userService } from '@/server/services/user-service'

export async function signUp() {
  // Call an API to sign up a user
  console.log('signup')
  return true
}

export async function login({
  email,
  password,
}: {
  email: string
  password: string
}) {
  console.log('logging in!', email, password)
  const user = await userService.authenticate({ email, password })
  if (!user) {
    console.log('Invalid email or password')
    return false
  }
  return true
}
