import request from '@/utils/request'

export function customerData(data) {
  return request({
    url: '/customer/data',
    method: 'get',
    params: data
  })
}

export function customerADD(data) {
  return request({
    url: '/customer/add',
    method: 'post',
    data: data
  })
}

export function wximgData(data) {
  return request({
    url: '/wximg/data',
    method: 'get',
    params: data
  })
}

