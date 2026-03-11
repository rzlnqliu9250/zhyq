import request from '@/utils/request'

export function getBuildingListAPI(params) {
  return request({
    url: '/park/building',
    params
  })
}

export function getBuildingRentListAPI() {
  return request({
    url: '/park/rent/building'
  })
}

/**
 * 添加楼宇
 * @param {*} data
 * @returns
 */
export function createBuildingListAPI(data) {
  return request({
    url: '/park/building',
    method: 'POST',
    data
  })
}

/**
 * 编辑楼宇
 * @param {*} data
 * @returns
 */
export function editBuildingListAPI(data) {
  return request({
    url: '/park/building',
    method: 'PUT',
    data
  })
}

/**
 * 删除楼宇
 * @param {*} id
 * @returns
 */
export function delBuildingListAPI(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'DELETE'
  })
}
