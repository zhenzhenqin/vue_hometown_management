import request from '@/utils/request';

// 分页查询景区列表
export const listAllAttractions = (name, location, score, page, pageSize) => {
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (location) params.append('location', location);
  if (score !== null && score !== undefined) params.append('score', score);
  params.append('page', page);
  params.append('pageSize', pageSize);
  return request.get(`/attractions?${params.toString()}`);
};

// 新增景区
export const addAttraction = (attraction) => {
  return request.post('/attractions', attraction);
};

// 根据id查询景区
export const getAttraction = (id) => {
  return request.get(`/attractions/${id}`);
};

// 修改景区
export const updateAttraction = (attraction) => {
  return request.put('/attractions', attraction);
};

// 批量删除景区
export const deleteAttractionById = (ids) => {
  return request.delete(`/attractions/${ids}`);
};