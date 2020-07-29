import request from '@/utils/request'

export function findVehicleServicePrice(data) {
    return request({
      url: '/wash/vsp/findVehicleServicePrice',
      method: 'post',
      data
    })
  }

  export function delVehicleServicePriceById(data) {
    return request({
      url: '/wash/vsp/delVehicleServicePriceById',
      method: 'post',
      data
    })
  }

  export function modifyVehicleServicePrice(data) {
    return request({
      url: '/wash/vsp/modifyVehicleServicePrice',
      method: 'post',
      data
    })
  }

  export function saveVehicleServicePrice(data) {
    return request({
      url: '/wash/vsp/saveVehicleServicePrice',
      method: 'post',
      data
    })
  }