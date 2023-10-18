export function setCookie (name, value, duration) {
  document.cookie = `${name}=${value};expires=${new Date(Date.now() + duration)};path=/`
}

export function getCookies () {
  return document.cookie.split(';').map(p => {
    const split = p.split('=')
    return {
      name: split[0],
      value: split[1]
    }
  })
}

export function getCookie (name) {
  return getCookies().filter(c => c.name === name)[0]
}

export function deleteCookie (name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}
