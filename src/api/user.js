import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/wash/washAdminLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '/wash/washAdminLoginOut',
    method: 'post',
    data
  })
}
