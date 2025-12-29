import request from '@/utils/request'

const BASE_URL = '/admin/report'

// 1. 获取核心指标数据 (DashboardVO)
export const getDashboardMetrics = () => {
    return request({
        url: `${BASE_URL}/dashboard`,
        method: 'get'
    })
}

// 2. 景点人气 Top (ChartDataVO List)
export const getAttractionPopular = () => {
    return request({
        url: `${BASE_URL}/attraction/popular`,
        method: 'get'
    })
}

// 3. 用户注册趋势
export const getUserGrowthTrend = () => {
    return request({
        url: `${BASE_URL}/user/trend`,
        method: 'get'
    })
}

// 4. 用户状态分布
export const getUserStatusDistribution = () => {
    return request({
        url: `${BASE_URL}/user/status`,
        method: 'get'
    })
}

// 5. 特产价格分布
export const getSpecialtyPriceDistribution = () => {
    return request({
        url: `${BASE_URL}/specialty/price-dist`,
        method: 'get'
    })
}

// 6.获取最近7天访问数据
export const getVisitStats = () => {
  return request({
    url: '/dailyVisit/stats',
    method: 'get'
  })
}

// 7. 获取用户地域分布 
export const getUserRegionStats = () => {
  return request({
    url: `${BASE_URL}/userRegion`,
    method: 'get'
  })
}