import request from '@/utils/request'

export function findYuyueCoupons(data) {
  return request({
    url: '/wash/coupon/findYuyueCoupons',
    method: 'post',
    data
  })
}

export function deleteYuyueCouponsById(data) {
    return request({
      url: '/wash/coupon/deleteYuyueCouponsById',
      method: 'post',
      data
    })
}

export function saveYuyueCoupons(data) {
  return request({
    url: '/wash/coupon/saveYuyueCoupons',
    method: 'post',
    data
  })
}

export function updateYuyueCoupons(data) {
  return request({
    url: '/wash/coupon/updateYuyueCoupons',
    method: 'post',
    data
  })
}

export function saveYuyueCouponscode(data) {
  return request({
    url: '/wash/coupon/saveYuyueCouponscode',
    method: 'post',
    data
  })
}

export function getYuyueCouponscodeByCid(data) {
  return request({
    url: '/wash/coupon/getYuyueCouponscodeByCid',
    method: 'post',
    data
  })
}

export function deleteYuyueCouponscode(data) {
  return request({
    url: '/wash/coupon/deleteYuyueCouponscode',
    method: 'post',
    data
  })
}