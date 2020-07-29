import request from '@/utils/request'

export function findWriteoffOrderHx(data) {
  return request({
    url: '/wash/findWriteoffOrderHx',
    method: 'post',
    data
  })
}

