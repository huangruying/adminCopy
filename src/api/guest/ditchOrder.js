import request from '@/utils/request'

export function findUserPurchaseProductOrder(data) {
  return request({
    url: '/wash/userPurchase/findUserPurchaseProductOrder',
    method: 'post',
    data
  })
}

export function delProductOrderByOrderNo(data) {
    return request({
      url: '/wash/userPurchase/delProductOrderByOrderNo',
      method: 'post',
      data
    })
}