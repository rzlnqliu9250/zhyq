import request from '@/utils/request'

/**
 * 获取员工列表
 * @param {*} params { page, pageSize, name }
 * @returns
 */
export function getEmployeeListAPI(params) {
  return request({
    url: '/park/sys/user',
    params
  })
}

/**
 * 获取角色列表
 * @returns
 */
export function getRoleListAPI() {
  return request({
    url: '/park/sys/role'
  })
}

/**
 * 新增员工
 * @param {*} data
 * @returns
 */
export function createEmployeeAPI(data) {
  return request({
    url: '/park/sys/user',
    method: 'POST',
    data
  })
}

/**
 * 删除员工
 * @param {*} id
 * @returns
 */
export function delEmployeeAPI(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 * 重置密码（默认123456）
 * @param {*} id 用户id
 * @returns
 */
export function resetPasswordAPI(id) {
  return request({
    url: '/park/sys/user/resetPwd',
    method: 'PUT',
    data: { id }
  })
}

/**
 * 编辑用户
 * @param {*} data { id, name, userName, roleId, status, phonenumber }
 * @returns
 */
export function updateEmployeeAPI(data) {
  return request({
    url: '/park/sys/user',
    method: 'PUT',
    data
  })
}

