import request from '@/utils/request'

export function findYyProductGoonLine(data) {
  return request({
    url: '/wash/product/findYyProductGoonLine',
    method: 'post',
    data
  })
}

export function updateYyProductGoonLine(data) {
    return request({
      url: '/wash/product/updateYyProductGoonLine',
      method: 'post',
      data
    })
}