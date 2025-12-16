const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'admin_info'

// 1. Token 相关操作
// 获取 Token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

// 存储 Token
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token)
}

// 移除 Token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}


// 2. 用户信息（ID, Username等）相关操作
// 存储用户信息 (对象会自动转 JSON 字符串)
export const setUserInfo = (info) => {
  if (info) {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(info))
  }
}

// 获取用户信息 
export const getUserInfo = () => {
  const info = localStorage.getItem(USER_INFO_KEY)
  try {
    return info ? JSON.parse(info) : null
  } catch (err) {
    return null
  }
}

// 直接获取用户 ID
export const getUserId = () => {
  const info = getUserInfo()
  return info ? info.id : null
}

// 移除用户信息
export const removeUserInfo = () => {
  localStorage.removeItem(USER_INFO_KEY)
}

// 3. 清除所有（退出登录用）
export const clearAuth = () => {
  removeToken()
  removeUserInfo()
}