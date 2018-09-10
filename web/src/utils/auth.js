import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  // return Cookies.get(TokenKey)
  return localStorage.sg_token
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
