import request from '@/utils/request';

/**
 * 获取验证码
 * 返回结构: { uuid: "...", img: "base64字符串..." }
 */
export const getCaptchaImage = () => {
  return request({
    url: '/captchaImage', // 对应后端验证码
    method: 'get'
  })
}

/**
 * 管理员登录
 * Data结构: { username, password}
 */
export const login = (data) => {
  try {
    return request({
    url: '/admin/login', 
    method: 'post',
    data: data
  })
  } catch (error) {
    return error;
  }
}

//查询管理员信息
export const getAdmin = () => {
  return request.get('/admin');
}


/**
 * 修改密码
 * @param {Object} data { adminId, oldPassword, newPassword }
 */
export const updatePassword = (data) => {
  return request({
    url: '/admin/editPassword',
    method: 'put',
    data
  })
}

// 分页条件查询管理员
export const getAdminList = (params) => {
  return request({
    url: '/admin/query',
    method: 'get',
    params
  })
}

// 新增管理员
export const addAdmin = (data) => {
  return request({
    url: '/admin',
    method: 'post',
    data
  })
}

//  根据ID获取管理员详情 (回显用)
export const getAdminById = (id) => {
  return request({
    url: `/admin/${id}`,
    method: 'get'
  })
}

//  更新管理员信息
export const updateAdmin = (data) => {
  return request({
    url: '/admin',
    method: 'put',
    data
  })
}

//  启用/禁用管理员
// 接口: /admin/status/{status}?id={id}
export const changeAdminStatus = (status, id) => {
  return request({
    url: `/admin/status/${status}`,
    method: 'post',
    params: { id }
  })
}