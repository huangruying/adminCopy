<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.dotAbbreviation"
          placeholder="请输入网点简称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.dotName"
          placeholder="请输入网点名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
           <el-input
          v-model="queryList.storePhone"
          placeholder="请输入店长手机号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.status" @change="getData" class="input fl" placeholder="状态">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.dotType" @change="getData" class="input fl" placeholder="类型">
            <el-option
              v-for="item in nodeTypesList"
              :label="item.type"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div>
           <el-button type="primary" icon="el-icon-refresh" @click="resetGetData"></el-button>
            <el-button type="primary" @click="newly">新增</el-button>
         </div>
       </div>
    </div>
    <el-table
      v-loading="loading"
      :data="data.data"
      border
      stripe
      fit
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column label="ID" prop="id" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网点简称" prop="dotAbbreviation" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotAbbreviation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网点名称" prop="dotName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="店长手机号" prop="storePhone" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.storePhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 1?"已审核": "未审核" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="dotType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotType == 1? "代办机构": "车行" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="compile(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="data.total>0"
      :total="data.total"
      :page.sync="data.current_page"
      :limit.sync="data.per_page"
      @pagination="getPageData"
    />
    <!-- 弹窗编辑新增 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editDialog"
      :close-on-click-modal="false"
      width="40%"
      @close="close"
      center>
      <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
           <!-- <span class="title">账号信息</span> -->
           <el-form-item label="网点名称:" prop="dotName" style="width:100%">
              <el-input v-model="itemObj.dotName" style="width:210px"></el-input>
           </el-form-item>
           <el-form-item label="店长手机号:" prop="storePhone" style="width:100%">
              <el-input v-model="itemObj.storePhone" style="width:210px"></el-input>
           </el-form-item>
           <el-form-item label="状态:" prop="status" style="width:100%">
             <el-switch
              v-model="itemObj.status"
              active-color="#13ce66">
            </el-switch>
           </el-form-item>
           <el-form-item label="网点简称:" prop="dotAbbreviation" style="width:100%">
              <el-input v-model="itemObj.dotAbbreviation" style="width:210px" :disabled="inputDisabled"></el-input>
           </el-form-item>
           <el-form-item label="类型:" prop="dotType" style="width:100%">
              <el-select v-model="itemObj.dotType" @change="getData" tyle="width:210px" placeholder="类型" :disabled="inputDisabled">
                <el-option
                  v-for="item in nodeTypesList2"
                  :label="item.type"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
           </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBootm" @click="editDialogVisible">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findDotUserInfos , saveDotUser , findCarwashTypeInfos , updateDotUserById} from '@/api/account'
import Pagination from "@/components/Pagination"
// import areaJson from '@/utils/city_data'
export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'gray',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  components: {
    Pagination
  },
  data() {
    var storePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('不能为空！'));
        } else {
          let reg = /^1[0-9]{10}$/
          if (!reg.test(value)) {
            callback(new Error('请输入正确的手机号！'));
          }else{
            callback();
          } 
        }
    };
    return {
      dialogTitle: "",
      thishostName: '',
      loadingBootm: false,
      urlBl: false,
      alterDisabled: false,
      inputDisabled: false,
      passRadio: null,
      loading: false,
      passDialog: false,
      editDialog: false,
      // areaJson:areaJson,
      itemObj: {
        openingBank: false
      },
      rules: {
          username: [
            { required: true, message: '不能为空', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
          ],
          dotType: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          dotName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          storePhone: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { validator: storePhone, trigger: 'blur' }
          ]
      },
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        dotAbbreviation: null,
        status: null,
        dotName: null,
        storePhone: null,
        dotType: null
      },
      statusList: [
        {
          name: '已审核',
          value: 1
        },
        {
          name: '未审核',
          value: 0
        },
      ],
      nodeTypesList: [
        {
          type: '车行',
          id: 0
        },
        {
          type: '代办机构',
          id: 1
        }
      ],
      nodeTypesList2: [
        {
          type: '车行',
          id: '0'
        },
        {
          type: '代办机构',
          id: '1'
        }
      ]
    }
  },
  created() {
    this.getData()
    // this.apiTypeInfos()
    this.thishostName = `${location.protocol}//${location.hostname}`
  },
  methods: {
    apiTypeInfos(){
      findCarwashTypeInfos().then(res=>{
        // console.log(res);
        this.nodeTypesList = res.data
      })
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.dotAbbreviation) {
        data.dotAbbreviation = queryList.dotAbbreviation
      }
      if (!(queryList.status == null)) {
        data.status = queryList.status
      }
      if (queryList.dotName) {
        data.dotName = queryList.dotName
      }
      if (queryList.storePhone) {
        data.storePhone = queryList.storePhone   
      }
      if (!(queryList.dotType == null)) {
        data.dotType = queryList.dotType
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      // data.username = this.$store.state.user.name
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      // console.log(data);
      findDotUserInfos(data).then(res=>{
        this.loading = false;
        if (!res.data || res.data.length <= 0) {
          this.$message("暂无数据~")
          this.data = {
             current_page: 1,
            data: [],
            last_page: 1,
            per_page: 15,
            total: 0,
            link: ""
          }
        }
        if(res.data && res.data.length > 0){
          this.data = res;
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          this.data.data.forEach(v=>{
            
          })
        }
      })
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    compile(item){
      this.editDialog = true
      this.dialogTitle = "编辑"
      this.itemObj = item
      this.inputDisabled = true
      if(item.status == 1){
        this.itemObj.status = true
      }else{
        this.itemObj.status = false
      }
    },
    newly(){
      this.editDialog = true
      this.dialogTitle = "新增"
      this.inputDisabled = false
      this.urlBl = true
    },
    editDialogVisible(){
      // 使用ES6的Object.keys()方法,是ES6的新方法, 返回值也是对象中属性名组成的数组
      // var data = this.itemObj
      // var arr = Object.keys(data);
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.loadingBootm = true
            if(this.itemObj.status){
              this.itemObj.status = 1
            }else{
              this.itemObj.status = 2
            }
            if(this.urlBl){
              saveDotUser(this.itemObj).then(res=>{
                this.loadingBootm = false
                if(res.code == 200){
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.editDialog = false
                }else{
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
                // console.log(res);
              })
            }else{
              updateDotUserById(this.itemObj).then(res=>{
                this.loadingBootm = false
                if(res.code == 200){
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.editDialog = false
                }else{
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
      });
    },
    close(){
      this.itemObj = {}
      this.getData()
      this.urlBl = false
    },
    reset(){
      this.queryList = {
        dotAbbreviation: null,
        status: null,
        dotName: null,
        storePhone: null,
        dotType: null
      }
    },
    resetGetData(){
      this.reset()
      this.getData()
    },
  }
}
</script>

<style lang="less" scoped>
.title{
  font-size: 18px;
  font-weight: 600;
}
/deep/.el-dialog__header{
  background: #f8f8f8;
}
/deep/.el-divider--horizontal{
  margin: 0;
}
.query{
  width: 100%;
  border: 1px solid #DCDFE6;
  border-top: none;
  padding-top: 10px;
  padding-bottom: 20px;
}
.input{
  width: 200px;
  margin-left:20px;
  margin-top: 10px;
}
.picker{
  width: 250px;
  margin-left:20px;
  margin-top: 10px;
}
.btn_box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 0;
}
/deep/.el-table .warning-row {
    background: oldlace;
  }

/deep/.el-table .success-row {
    background: #f0f9eb;
}
.center{
  display: block;
  align-items: center;
  display: flex;
  justify-content: center;
}
// .fl{
//   float: left;
//   }
// .fr{
//   float: right;
//   }
/deep/.el-form-item{
  float: left;
}
.clearFix::before,
.clearFix::after{
      content: "";
      display: block;
      visibility: hidden;
      height: 0;
      line-height: 0;
      clear: both;
}
.boxUpload{   
    .textUp{
      position: relative;
      float: left;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 4.5%;
      margin-top: 3%;
      margin-left: 3%;
      .uploadTransparency{
          display: block;
          width: 150px;
          height: 100px;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 999;
        }
      .text{
        margin-top: 5px;
      }
      .btn{
        margin-top: 3px;
      }
    }
}
.avatar-uploader .el-upload:hover {
   border-color: #409EFF;
 }
 .avatar-uploader-icon {
   border: 1px dashed #DFDFDF;
   border-radius: 6px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
   font-size: 12px;
   color: #8c939d;
   width: 150px;
   height: 100px;
   line-height: 100px;
   text-align: center;
 }
 .avatar {
   width: 150px;
   height: 100px;
   display: block;
 }
</style>
