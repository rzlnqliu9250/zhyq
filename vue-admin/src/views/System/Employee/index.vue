<template>
  <div class="employee-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">员工姓名：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="doSearch" />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="addEmployee">添加员工</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="employeeList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="员工姓名" width="180" prop="name" />
        <el-table-column label="登录账号" width="180" prop="userName" />
        <el-table-column label="联系方式" width="120" prop="phonenumber" />
        <el-table-column label="角色" width="120" prop="roleName" />
        <el-table-column label="状态">
          <template #default="scope">
            {{ formatStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="添加时间" prop="createTime" />
        <el-table-column label="操作" fixed="right" width="240">
          <template #default="scope">
            <el-button size="mini" type="text" @click="editEmployee(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="delEmployee(getRowId(scope.row))">删除</el-button>
            <el-button size="mini" type="text" @click="resetPassword(getRowId(scope.row))">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :page-size="params.pageSize"
        :total="total"
        @current-change="pageChange"
      />
    </div>
    <!-- 添加员工 -->
    <el-dialog
      :title="addForm.id ? '编辑员工' : '添加员工'"
      :visible="dialogVisible"
      width="480px"
      @close="closeDialog"
      @open="openDialog"
    >
      <div class="form-container">
        <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="addForm.name" />
          </el-form-item>
          <el-form-item label="登录账号" prop="userName">
            <el-input v-model="addForm.userName" />
          </el-form-item>
          <el-form-item label="联系方式" prop="phonenumber">
            <el-input v-model="addForm.phonenumber" />
          </el-form-item>
          <el-form-item label="分配角色" prop="roleId">
            <el-select v-model="addForm.roleId" placeholder="请选择角色">
              <el-option
                v-for="item in roleList"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="员工状态" prop="status">
            <el-radio-group v-model="addForm.status">
              <el-radio :label="0">禁用</el-radio>
              <el-radio :label="1">启用</el-radio>
            </el-radio-group>
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
import { getEmployeeListAPI, getRoleListAPI, createEmployeeAPI, delEmployeeAPI, resetPasswordAPI, updateEmployeeAPI } from '@/api/employee'
export default {
  name: 'Employee',
  data() {
    return {
      employeeList: [],
      total: 0,
      params: {
        page: 1,
        pageSize: 10,
        name: ''
      },
      dialogVisible: false,
      roleList: [],
      addForm: {
        id: undefined,
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      },
      addFormRules: {
        name: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请分配角色', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择员工状态', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      const res = await getEmployeeListAPI(this.params)
      this.employeeList = res.data.rows
      this.total = res.data.total
    },
    pageChange(page) {
      this.params.page = page
      this.getEmployeeList()
    },
    doSearch() {
      this.params.page = 1
      this.getEmployeeList()
    },
    addEmployee() {
      this.dialogVisible = true
      if (this.$refs.addForm) this.$refs.addForm.resetFields()
      this.addForm = {
        id: undefined,
        name: '',
        phonenumber: '',
        roleId: '',
        status: 1,
        userName: ''
      }
    },
    editEmployee(row) {
      this.dialogVisible = true
      const id = this.getRowId(row)
      this.addForm = {
        id,
        name: row.name,
        phonenumber: row.phonenumber,
        roleId: row.roleId,
        status: row.status,
        userName: row.userName
      }
    },
    async openDialog() {
      const res = await getRoleListAPI()
      const list = Array.isArray(res.data) ? res.data : (res.data?.rows || [])
      this.roleList = list.map(item => ({
        roleId: item.roleId || item.id,
        roleName: item.roleName || item.name
      }))
    },
    closeDialog() {
      this.dialogVisible = false
    },
    async confirmAdd() {
      if (this.addForm.id) {
        await updateEmployeeAPI({
          id: this.addForm.id,
          name: this.addForm.name,
          userName: this.addForm.userName,
          roleId: this.addForm.roleId,
          status: this.addForm.status,
          phonenumber: this.addForm.phonenumber
        })
      } else {
        await createEmployeeAPI(this.addForm)
      }
      this.dialogVisible = false
      this.getEmployeeList()
    },
    delEmployee(id) {
      this.$confirm('删除员工后将不可登录，确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delEmployeeAPI(id)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getEmployeeList()
      })
    },
    async resetPassword(id) {
      await resetPasswordAPI(id)
      this.$message({ type: 'success', message: '密码已重置为 123456' })
    },
    getRowId(row) {
      return row.userId || row.id
    },
    formatStatus(status) {
      return status === 1 ? '启用' : '禁用'
    }
  }
}
</script>

<style lang="scss" scoped>
.employee-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
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
