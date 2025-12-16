import axios from 'axios'

//创建axios实例对象
const request = axios.create({
  baseURL: '/api',
  timeout: 600000
})

//axios的响应 response 拦截器
request.interceptors.request.use(
  (config) => {
    // 1. 获取本地存储的 token
    const token = localStorage.getItem('token')
    
    // 2. 如果 token 存在，把它放到请求头中
    if (token) {
      config.headers['token'] = token
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


request.interceptors.response.use(
  (response) => {
    // 成功回调：虽然 HTTP 状态码是 200，但还需要判断业务状态码 code
    const res = response.data

    // 假设后端 Result 结构是 { code: 1, msg: '...', data: ... }
    if (res.code === 1) {
      // 业务成功，直接返回后端给的完整数据对象（或者只返回 res.data，看你习惯）
      return res
    } else {
      // 业务失败（比如账号密码错误），弹出后端返回的错误信息
      ElMessage.error(res.msg || '系统错误')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  (error) => {
    // 失败回调：处理 HTTP 状态码非 2xx 的情况
    console.log('err' + error) 
    
    // 1. 处理 401 未授权/Token过期
    if (error.response && error.response.status === 401) {
      ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清理本地缓存
        localStorage.removeItem('token')
        localStorage.removeItem('adminInfo')
        // 跳转回登录页
        router.push('/login')
      }).catch(() => {})
      
      return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
    }
    
    // 2. 处理其他错误
    ElMessage.error(error.message || '网络请求失败')
    return Promise.reject(error)
  }
)

export default request