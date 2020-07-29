import request from '@/utils/request'

export function findYyProductData(data) {
  return request({
    url: '/wash/product/findYyProductData',
    method: 'post',
    data
  })
}

export function giveCard(data) {
  return request({
    url: '/wash/giveCard',
    method: 'post',
    data: data
  })
}