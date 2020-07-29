import request from '@/utils/request'

export function listStationsNameInfos(data) {
  return request({
    url: '/wash/station/listStationsNameInfos',
    method: 'post',
    data
  })
}

export function delStationsNameInfo(data) {
    return request({
      url: '/wash/station/delStationsNameInfo',
      method: 'post',
      data
    })
}

export function findYuyueProvinces(data) {
    return request({
      url: '/wash/findYuyueProvinces',
      method: 'get',
      params: data
    })
}

export function findYuyueCityByProvinceid(data) {
    return request({
      url: '/wash/findYuyueCityByProvinceid',
      method: 'get',
      params: data
    })
}

export function updateYuyueStationInfo(data) {
    return request({
      url: '/wash/station/updateYuyueStationInfo',
      method: 'post',
      data: data
    })
}

export function saveYuyueStationInfo(data) {
    return request({
      url: '/wash/station/saveYuyueStationInfo',
      method: 'post',
      data: data
    })
}

export function findStationsByIds(data) {
  return request({
    url: '/wash/station/findStationsByIds',
    method: 'post',
    data: data
  })
}

export function delYuyueStations(data) {
  return request({
    url: '/wash/station/delYuyueStations',
    method: 'post',
    data: data
  })
}

export function findHallService(data) {
  return request({
    url: '/wash/station/findHallService',
    method: 'post',
    data: data
  })
}

export function updateYuyueStations(data) {
  return request({
    url: '/wash/station/updateYuyueStations',
    method: 'post',
    data: data
  })
}

export function saveYuyueStations(data) {
  return request({
    url: '/wash/station/saveYuyueStations',
    method: 'post',
    data: data
  })
}