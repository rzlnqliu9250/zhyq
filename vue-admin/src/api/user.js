import request from '@/utils/request'

// 登录函数
/**
 * @description: 登录函数
  * @param {*} data { username,password }
 * @return {*} promise
 */
export function loginAPI(data) {
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}
/**
 *
 * @param {*} params{ name,page,pageSize}
 * @returns
 */
export function getEnterPriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    method: 'GET',
    params
  })
}
/**
 *
 * @param {*} id string
 * @returns
 */
export function gdelEnterPriseAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE'
  })
}

/**
 * @description: 获取用户信息
 * @param {*} data {}
 * @return {*} promise
 */
export function getProfileAPI() {
  return request({
    url: '/park/user/profile',
    method: 'GET'
  })
}
