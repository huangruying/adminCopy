import request from '@/utils/request'

export function findVehicleChannelPrice(data) {
  return request({
    url: '/wash/vcp/findVehicleChannelPrice',
    method: 'post',
    data
  })
}

export function modifyVehicleChannelPrice(data) {
    return request({
      url: '/wash/vcp/modifyVehicleChannelPrice',
      method: 'post',
      data
    })
  }

  export function saveVehicleChannelPrice(data) {
    return request({
      url: '/wash/vcp/saveVehicleChannelPrice',
      method: 'post',
      data
    })
  }

  export function delVehicleChannelPriceById(data) {
    return request({
      url: '/wash/vcp/delVehicleChannelPriceById',
      method: 'post',
      data
    })
  }