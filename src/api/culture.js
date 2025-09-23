import request from '@/utils/request';

//分页请求查询所有文化
export const listAllCulture = (title, page, pageSize) => {
  return request.get(`/cultures?title=${title}&page=${page}&pageSize=${pageSize}`);
}

//新增文化
export const addCulture = (culture) => {
  return request.post('/cultures', culture);
}

//根据id查询
export const getCulture = (id) => {
  return request.get(`/cultures/${id}`);
}

//修改数据
export const updateCulture = (culture) => {
  return request.put('/cultures', culture);
}

//删除文化
export const deleteCultureById = (ids) => {
  return request.delete(`/cultures/${ids}`);
}