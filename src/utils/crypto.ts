import { createHash } from 'crypto'

function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_SECRET)
}

export function verifyPassword(inputPassword: string, storedHash: string) {
  const inputHash = hashPassword(inputPassword)
  return inputHash === storedHash
}
