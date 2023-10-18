import { getCookie } from '@/assets/js/cookies'
const tokenCookieName = 'token'

export function isAuthenticated () {
  return getCookie(tokenCookieName) !== undefined
}

export function authenticationToken () {
  return getCookie(tokenCookieName)?.value
}

export default tokenCookieName
