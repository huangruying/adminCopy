import request from '@/utils/request'

export function findYuyueIproduct(data) {
  return request({
    url: '/wash/iproduct/findYuyueIproduct',
    method: 'post',
    data
  })
}

export function deleteYuyueIproductById(data) {
  return request({
    url: '/wash/iproduct/deleteYuyueIproductById',
    method: 'post',
    data
  })
}

export function updateYuyueIproduct(data) {
  return request({
    url: '/wash/iproduct/updateYuyueIproduct',
    method: 'post',
    data
  })
}

export function saveYuyueIproduct(data) {
  return request({
    url: '/wash/iproduct/saveYuyueIproduct',
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

export function updateExamine(data) {
  return request({
    url: '/wash/iproduct/updateExamine',
    method: 'post',
    data
  })
}