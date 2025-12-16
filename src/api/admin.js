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

//根据id回显管理员信息
export const getAdminById = (id) => {
  return request.get(`/admin/${id}`);
}

//修改管理员
export const updateAdmin = (admin) => {
  return request.put('/admin', admin);
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