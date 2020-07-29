import request from '@/utils/request'

export function findChannelMonthly(data) {
  return request({
    url: '/wash/channelMonth/findChannelMonthly',
    method: 'post',
    data
  })
}

export function findServiceOrderByMonth(data) {
    return request({
      url: '/wash/channelMonth/findServiceOrderByMonth',
      method: 'post',
      data
    })
}

export function modifyServicerMonthlyRemark(data) {
  return request({
    url: '/wash/channelMonth/modifyServicerMonthlyRemark',
    method: 'post',
    data
  })
}

export function modifySoRemarks(data) {
  return request({
    url: '/wash/channelMonth/modifySoRemarks',
    method: 'post',
    data
  })
}
