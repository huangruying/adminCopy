import request from '@/utils/request'

export function findDotUserInfos(data) {
  return request({
    url: '/wash/findDotUserInfos',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
// 添加
export function saveDotUser(data) {
    return request({
      url: '/wash/saveDotUser',
      method: 'post',
      data
    })
  }
// 修改
export function updateDotUserById(data) {
    return request({
      url: '/wash/updateDotUserById',
      method: 'post',
      data
    })
}

export function findCarwashTypeInfos(data) {
  return request({
    url: '/wash/findCarwashTypeInfos',
    method: 'post',
    data
  })
}
