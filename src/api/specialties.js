import request from '@/utils/request';

// 分页查询特产列表
export const listAllSpecialties = (name, price, page, pageSize) => {
  return request.get(`/specialties?name=${name}&price=${price}&page=${page}&pageSize=${pageSize}`);
}

// 新增特产
export const addSpecialty = (specialty) => {
  return request.post('/specialties', specialty);
}

// 根据id查询特产
export const getSpecialty = (id) => {
  return request.get(`/specialties/${id}`);
}

// 修改特产
export const updateSpecialty = (specialty) => {
  return request.put('/specialties', specialty);
}

// 批量删除特产
export const deleteSpecialtyById = (ids) => {
  return request.delete(`/specialties/${ids}`);
}