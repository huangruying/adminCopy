import request from '@/utils/request'

export function findYyChannelInfos(data) {
  return request({
    url: '/wash/channe/findYyChannelInfos',
    method: 'post',
    data
  })
}

export function delYyChannelById(data) {
    return request({
      url: '/wash/channe/delYyChannelById',
      method: 'post',
      data
    })
}

export function updateYyChannel(data) {
    return request({
      url: '/wash/channe/updateYyChannel',
      method: 'post',
      data
    })
}

export function saveYyChannel(data) {
    return request({
      url: '/wash/channe/saveYyChannel',
      method: 'post',
      data
    })
}

export function updateExamine(data) {
    return request({
      url: '/wash/channe/updateExamine',
      method: 'post',
      data
    })
}