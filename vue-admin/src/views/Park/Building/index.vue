<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="doSearch" />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="addBuilding">添加楼宇</el-button>
      <el-button style="margin-left: 10px;" @click="exportToExcel">导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="buildingList"
      >
        <el-table-column
          type="index"
          label="序号"
        />
        <el-table-column
          label="楼宇名称"
          width="180"
          prop="name"
        />
        <el-table-column
          label="层数"
          prop="floors"
        />
        <el-table-column
          label="在管面积(m²)"
          width="120"
          prop="area"
        />
        <el-table-column
          label="物业费(元/m²)"
          width="120"
          prop="propertyFeePrice"
        />
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            {{ formatStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="edit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="confirmDel(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <!-- 分页器 -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>

    <!-- 添加/编辑楼宇弹框 -->
    <el-dialog
      title="添加楼宇"
      :visible="dialogVisible"
      width="580px"
      @close="closeDialog"
    >
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="top">
          <el-form-item label="楼宇名称" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="楼宇层数" prop="floors">
            <el-input v-model="addForm.floors" />
          </el-form-item>
          <el-form-item label="在管面积" prop="area">
            <el-input v-model="addForm.area" />
          </el-form-item>
          <el-form-item label="物业费" prop="propertyFeePrice">
            <el-input v-model="addForm.propertyFeePrice" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>

</template>

<script>
import { utils, writeFileXLSX } from 'xlsx'
import { getBuildingListAPI, createBuildingListAPI, editBuildingListAPI, delBuildingListAPI } from '@/api/building'
export default {
  name: 'Building',
  data() {
    return {
      buildingList: [], // table列表
      params: { // 请求参数
        page: 1,
        pageSize: 10,
        name: ''
      },
      total: 0,
      dialogVisible: false,
      addForm: {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入楼宇名称', trigger: 'blur' }
        ],
        floors: [
          { required: true, message: '请输入楼宇层数', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入楼宇面积', trigger: 'blur' }
        ],
        propertyFeePrice: [
          { required: true, message: '请输入楼宇物业费', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getBuildingList()
  },
  methods: {
    async getBuildingList() {
      const res = await getBuildingListAPI(this.params)
      this.buildingList = res.data.rows
      this.total = res.data.total
    },
    // 状态文案映射 0: 租赁中 1: 闲置中
    formatStatus(status) {
      const statusMap = {
        0: '租赁中',
        1: '闲置中'
      }
      return statusMap[status]
    },
    pageChange(page) {
      this.params.page = page
      this.getBuildingList()
    },
    doSearch() {
      this.params.page = 1
      this.getBuildingList()
    },
    addBuilding() {
      this.dialogVisible = true
      // 重置表单
      if (this.$refs.addForm) this.$refs.addForm.resetFields()
      this.addForm = {
        name: '',
        floors: null,
        area: null,
        propertyFeePrice: null
      }
    },
    closeDialog() {
      this.dialogVisible = false
    },
    // 编辑，使用本行数据回填
    edit(row) {
      this.dialogVisible = true
      const { id, area, floors, name, propertyFeePrice } = row
      this.addForm = { id, area, floors, name, propertyFeePrice }
    },
    // 新增/编辑提交
    confirmAdd() {
      this.$refs.addForm.validate(async(valid) => {
        if (valid) {
          if (this.addForm.id) {
            await editBuildingListAPI(this.addForm)
          } else {
            await createBuildingListAPI(this.addForm)
          }
          this.getBuildingList()
          this.dialogVisible = false
        }
      })
    },
    // 删除
    async confirmDel(id) {
      this.$confirm('确认删除当前楼宇吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delBuildingListAPI(id)
        this.getBuildingList()
      }).catch(() => {})
    },
    // 导出Excel
    async exportToExcel() {
      const res = await getBuildingListAPI(this.params)
      const tableHeaderKeys = ['name', 'floors', 'area', 'propertyFeePrice', 'status']
      const sheetData = res.data.rows.map((item) => {
        const obj = {}
        tableHeaderKeys.forEach((key) => {
          obj[key] = item[key]
        })
        // 将状态码转换为文案
        obj.status = this.formatStatus(item.status)
        return obj
      })
      const worksheet = utils.json_to_sheet(sheetData)
      const workbook = utils.book_new()
      utils.book_append_sheet(workbook, worksheet, 'Data')
      utils.sheet_add_aoa(worksheet, [['楼宇名称', '层数', '在管面积(㎡)', '物业费(元/㎡)', '状态']], { origin: 'A1' })
      writeFileXLSX(workbook, '楼宇管理.xlsx')
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container{
  padding:10px;
}
.search-container{
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237,237,237,.9);
  padding-bottom: 20px;
  .search-label{
    width:100px;
  }
  .search-main{
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>
