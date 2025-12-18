import request from '@/utils/request'

export const getServerInfo = () => {
  return request({
    url: '/admin/monitor/server',
    method: 'get'
  })
}