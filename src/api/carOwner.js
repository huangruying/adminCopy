import request from '@/utils/request'

export function findVehicleUserInfos(data) {
  return request({
    url: '/wash/findVehicleUserInfos',
    method: 'post',
    data
  })
}

