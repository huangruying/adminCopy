import request from '@/utils/request'

export function findWeiXinMenuInfos(data) {
  return request({
    url: '/wash/wxmenu/findWeiXinMenuInfos',
    method: 'post',
    data
  })
}

export function updateWxMenu(data) {
  return request({
    url: '/wash/wxmenu/updateWxMenu',
    method: 'post',
    data
  })
}

export function saveWxMenu(data) {
  return request({
    url: '/wash/wxmenu/saveWxMenu',
    method: 'post',
    data
  })
}