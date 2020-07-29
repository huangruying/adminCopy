import request from '@/utils/request'

export function findServicerMonthly(data) {
  return request({
    url: '/wash/servicerMonth/findServicerMonthly',
    method: 'post',
    data
  })
}

export function findServiceOrderByMonth(data) {
  return request({
    url: '/wash/servicerMonth/findServiceOrderByMonth',
    method: 'post',
    data
  })
}

export function modifyServicerMonthlyRemark(data) {
  return request({
    url: '/wash/servicerMonth/modifyServicerMonthlyRemark',
    method: 'post',
    data
  })
}

export function modifySoRemarks(data) {
  return request({
    url: '/wash/servicerMonth/modifySoRemarks',
    method: 'post',
    data
  })
}

export function serviceOrderMonthExports(data) {
  return request({
    url: '/wash/servicerMonth/serviceOrderMonthExports',
    method: 'post',
    data
  })
}