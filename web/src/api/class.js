import request from '@/utils/request'

export function classDataR(data) {
  return request({
    url: '/class/data',
    method: 'get',
    params: data
  })
}

export function classAdd(data) {
  return request({
    url: '/class/add',
    method: 'post',
    data: data
  })
}

export function classDelete(data) {
  return request({
    url: '/class/delete',
    method: 'get',
    params: data
  })
}

export function classModify(data) {
  return request({
    url: '/class/modify',
    method: 'post',
    data: data
  })
}

export function classDetails(data) {
  return request({
    url: '/class/details',
    method: 'get',
    params: data
  })
}

export function exportExcel(data) {
  return request({
    url: '/export/log',
    method: 'post',
    data: data
  })
}
