import request from '@/utils/request'

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function findWeixinUserInfos(data) {
  return request({
    url: '/wash/user/findWeixinUserInfos',
    method: 'post',
    data: data
  })
}