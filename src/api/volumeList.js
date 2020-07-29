import request from '@/utils/request'

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

export function findGeneralCoupon(data) {
  return request({
    url: '/wash/findGeneralCoupon',
    method: 'post',
    data: data
  })
}

export function batchCouponcodeImport(data) {
    return request({
      url: '/wash/batchCouponcodeImport',
      method: 'post',
      data: data
    })
}

export function findCompanyInfos(data) {
  return request({
    url: '/wash/findCompanyInfos',
    method: 'post',
    data: data
  })
}

export function delGeneralCouponById(data) {
  return request({
    url: '/wash/delGeneralCouponById',
    method: 'post',
    data: data
  })
}

export function saveGeneralCoupon(data) {
  return request({
    url: '/wash/saveGeneralCoupon',
    method: 'post',
    data: data
  })
}

export function modifyGeneralCouponById(data) {
  return request({
    url: '/wash/modifyGeneralCouponById',
    method: 'post',
    data: data
  })
}

export function findCarwashType(data) {
  return request({
    url: '/wash/findCarwashType',
    method: 'post',
    data: data
  })
}

export function generateGeneralCouponcode(data) {
  return request({
    url: '/wash/generateGeneralCouponcode',
    method: 'post',
    data: data
  })
}

export function findCarwashsTypeById(data) {
  return request({
    url: '/wash/findCarwashsTypeById',
    method: 'post',
    data: data
  })
}

export function finGeneralCouponcode(data) {
  return request({
    url: '/wash/finGeneralCouponcode',
    method: 'post',
    data: data
  })
}

export function delGeneralCouponcodeById(data) {
  return request({
    url: '/wash/delGeneralCouponcodeById',
    method: 'post',
    data: data
  })
}

export function findChannelName(data) {
  return request({
    url: '/wash/findChannelName',
    method: 'post',
    data
  })
}

export function findGeneralLogBygeneralId(data) {
  return request({
    url: '/wash/generalLog/findGeneralLogBygeneralId',
    method: 'post',
    data
  })
}

export function findCodeDetailByLogId(data) {
  return request({
    url: '/wash/generalLog/findCodeDetailByLogId',
    method: 'post',
    data
  })
}