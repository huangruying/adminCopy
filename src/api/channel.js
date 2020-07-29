import request from '@/utils/request'

export function findWashChannel(data) {
  return request({
    url: '/wash/washChannel/findWashChannel',
    method: 'post',
    data
  })
}

export function updateExamine(data) {
    return request({
      url: '/wash/washChannel/updateExamine',
      method: 'post',
      data
    })
  }

  export function delWashChannel(data) {
    return request({
      url: '/wash/washChannel/delWashChannel',
      method: 'post',
      data
    })
  }

  export function updateWashChannel(data) {
    return request({
      url: '/wash/washChannel/updateWashChannel',
      method: 'post',
      data
    })
  }

  export function saveWashChannel(data) {
    return request({
      url: '/wash/washChannel/saveWashChannel',
      method: 'post',
      data
    })
  }