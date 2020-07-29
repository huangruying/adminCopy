import request from '@/utils/request'

export function findServiceOrderInfos(data) {
  return request({
    url: '/wash/findServiceOrderInfos',
    method: 'post',
    data
  })
}

export function updateReconciliationByOrderNo(data) {
  return request({
    url: '/wash/updateReconciliationByOrderNo',
    method: 'post',
    data: data
  })
}