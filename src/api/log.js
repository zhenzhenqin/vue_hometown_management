import request from '@/utils/request';

// 分页查询操作日志
export const getLogList = (params) => {
  return request({
    url: '/log/list',
    method: 'get',
    params // 会自动拼接成 ?page=1&pageSize=10&username=...
  })
}