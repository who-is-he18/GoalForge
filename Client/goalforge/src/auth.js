// Save JWT token in localStorage
export function saveToken(token) {
  localStorage.setItem('access_token', token)
}

// Get JWT token from localStorage
export function getToken() {
  return localStorage.getItem('access_token')
}

// Remove token (on logout)
export function clearToken() {
  localStorage.removeItem('access_token')
}

// Check if logged in
export function isLoggedIn() {
  return !!getToken()
}
