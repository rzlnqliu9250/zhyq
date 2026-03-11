import {  ref } from 'vue'
import { getParkInfoAPI } from '@/api/index'
function useParkInfo(){
  //放置所有的业务逻辑
  //获取园区概况数据
const parkInfo = ref({})
async function getUserInfo() {
  //1.调用接口
  const res = await getParkInfoAPI()
  //2.响应式覆盖
  parkInfo.value = res.data
}
return{
  getUserInfo,
  parkInfo
}
}
export {useParkInfo}
