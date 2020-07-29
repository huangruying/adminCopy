import request from '@/utils/request'

export function findMechanismInfos(data) {
  return request({
    url: '/wash/mechanism/findMechanismInfos',
    method: 'post',
    data
  })
}

export function delMechanismById(data) {
  return request({
    url: '/wash/mechanism/delMechanismById',
    method: 'post',
    data
  })
}
// 修改所属机构列表
export function updateDotMechanismById(data) {
  return request({
    url: '/wash/mechanism/updateDotMechanismById',
    method: 'post',
    data
  })
}
// 新增所属机构列表
export function saveMechanism(data) {
  return request({
    url: '/wash/mechanism/saveMechanism',
    method: 'post',
    data
  })
}