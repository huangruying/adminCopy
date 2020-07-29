import request from '@/utils/request'

export function findYyUsercouponsInfos(data) {
  return request({
    url: '/wash/coupon/findYyUsercouponsInfos',
    method: 'post',
    data
  })
}

export function delYyUsercouponsById(data) {
    return request({
      url: '/wash/coupon/delYyUsercouponsById',
      method: 'post',
      data
    })
  }