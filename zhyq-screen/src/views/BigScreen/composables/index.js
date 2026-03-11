//模块的统一导出
//先把三个子模块统一导入然后再统一导出
import { useParkInfo } from './useParkInfo'
import { useInitBarChart } from './useInitBarChart'
import { useInitPieChart } from './useInitPieChart'
export{
  useParkInfo,
  useInitBarChart,
  useInitPieChart
}
