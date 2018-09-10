import request from '@/utils/request'

export function homeData(data) {
  return request({
    url: '/home/data',
    method: 'get',
    params: data
  })
}
