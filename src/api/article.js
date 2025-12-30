import request from '@/utils/request'

// 1. 获取文章列表 (支持分页、搜索、作者筛选)
export function getArticleList(params) {
  return request({
    url: '/articles',
    method: 'get',
    params
  })
}

// 2. 获取文章详情
export function getArticleDetail(id) {
  return request({
    url: `/articles/${id}`,
    method: 'get'
  })
}

// 3. 发布文章 (新增)
export function addArticle(data) {
  return request({
    url: '/articles',
    method: 'post',
    data
  })
}

// 4. 修改文章
export function updateArticle(data) {
  return request({
    url: '/articles',
    method: 'put',
    data
  })
}

// 5. 删除文章 (支持批量)
export function deleteArticle(ids) {
  return request({
    url: `/articles/${ids}`,
    method: 'delete'
  })
}

// 6. 获取管理员列表 (用于筛选作者下拉框)
export function getAuthorList() {
  return request({
    url: '/admin/simple-list', 
    method: 'get'
  })
}

// 7：文章图片上传
export function uploadArticleImage(formdata) {
  return request({
    url: '/common/upload', 
    method: 'post',
    data: formdata,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}