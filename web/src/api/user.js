import request from '@/utils/request'

export function userClass() {
  return request({
    url: '/user/class',
    method: 'get'
  })
}

export function userAdd(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data: data
  })
}

export function userDataRequest(data) {
  return request({
    url: '/user/data',
    method: 'get',
    params: data
  })
}

export function userModify(data) {
  return request({
    url: '/user/modify',
    method: 'post',
    data: data
  })
}

export function userDelete(data) {
  return request({
    url: '/user/delete',
    method: 'get',
    params: data
  })
}

export function userModifyPwd(data) {
  return request({
    url: '/user/modifyPwd',
    method: 'post',
    data: data
  })
}
