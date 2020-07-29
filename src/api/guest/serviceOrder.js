import request from '@/utils/request'

export function findYyOrderytdetail(data) {
  return request({
    url: '/wash/orderytdetail/findYyOrderytdetail',
    method: 'post',
    data
  })
}

export function delYyOrderytdetailById(data) {
  return request({
    url: '/wash/orderytdetail/delYyOrderytdetailById',
    method: 'post',
    data
  })
}