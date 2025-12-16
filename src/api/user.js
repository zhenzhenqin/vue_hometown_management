import request from '@/utils/request';

//查询用户信息
export const getUser = () => {
  return request.get('/user');
}

//根据id回显用户信息
export const getUserById = (id) => {
  return request.get(`/users/${id}`);
}

//修改用户
export const updateUser = (user) => {
  return request.put('/user', user);
}

// 分页条件查询用户
export const getUserPage = (params) => {
  return request({
    url: '/user/query',
    method: 'get',
    params
  })
}

// 启用/禁用用户 (拉黑/解除拉黑)
// 后端接口: POST /user/status/{status}?id={id}
export const startOrStopUser = (status, id) => {
  return request({
    url: `/user/status/${status}`,
    method: 'post',
    params: { id }
  })
}