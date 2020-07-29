import request from '@/utils/request'

export function findYuyueProductInfo(data) {
  return request({
    url: '/wash/product/findYuyueProductInfo',
    method: 'post',
    data
  })
}

export function deleteYuyueProduct(data) {
  return request({
    url: '/wash/product/delYuyueProduct',
    method: 'post',
    data
  })
}

export function getChannelName(data) {
  return request({
    url: '/wash/product/getChannelName',
    method: 'post',
    data
  })
}

export function findIproductInfos(data) {
  return request({
    url: '/wash/product/findIproductInfos',
    method: 'post',
    data
  })
}

export function updateYuyueProductInfo(data) {
  return request({
    url: '/wash/product/updateYuyueProductInfo',
    method: 'post',
    data
  })
}

export function saveYuyueProduct(data) {
  return request({
    url: '/wash/product/saveYuyueProduct',
    method: 'post',
    data
  })
}

export function getYyProductById(data) {
  return request({
    url: '/wash/product/getYyProductById',
    method: 'post',
    data
  })
}

export function updateExamine(data) {
  return request({
    url: '/wash/product/updateExamine',
    method: 'post',
    data
  })
}