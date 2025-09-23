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