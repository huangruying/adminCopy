<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.name"
          placeholder="请输入产品名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.otherName"
          placeholder="请输入商品别称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.usetypeid" @change="getData" class="input fl" placeholder="请选择用途">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.usetypeid"
              :key="item.usetypeid"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.typeid" @change="getData" class="input fl" placeholder="请选择次数">
            <el-option
              v-for="item in statusList2"
              :label="item.name"
              :value="item.typeid"
              :key="item.typeid"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.examine" @change="getData" class="input fl" placeholder="审核是否通过">
            <el-option
              v-for="item in auditList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="danger" @click="remove(2)">批量删除</el-button>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div>
           <el-button type="primary" @click="newlyIncreased">新增</el-button>
           <el-button type="primary" icon="el-icon-refresh" @click="resetGetData"></el-button>
         </div>
       </div>
    </div>
    <el-table
      v-loading="loading"
      :data="data.data"
      border
      stripe
      fit
      @selection-change="handleSelectionChange"
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column
        align="center"
        type="selection"
        width="50">
     </el-table-column>
      <el-table-column label="ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="副标题" prop="otherName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.otherName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="price" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用途" prop="usetypeid" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.usetypeid == 1? "高铁" : "空铁" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="来源" prop="channelName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="次数" prop="typeid" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeidCopy}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="产品内容" prop="content" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" prop="dateline" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dateline }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核是否通过" prop="examine" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examine == 0 ? "未审核" : "审核已通过" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <div style="width: 100%;margin-bottom: 7px;" v-if="scope.row.examine == 0"><el-button size="mini" type="success" @click="audit(scope.row)">审核通过</el-button></div>
          <div style="width: 100%;margin-bottom: 7px;"><el-button size="mini" type="primary" @click="compile(scope.row)">编辑</el-button></div>
          <div style="width: 100%;"><el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button></div>
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
    <!-- 查看 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editDialog"
      :close-on-click-modal="false"
      width="80%"
      @close="close"
      center>
      <!-- 产品管理 -->
        <el-divider content-position="left"><span class="title">产品管理</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="产品名称：" prop="name" style="width: 100%">
                  <el-input v-model="itemObj.name" style="width:50%" placeholder="请输入产品名称"></el-input>
              </el-form-item>
              <el-form-item label="副标题：" prop="otherName" style="width: 100%">
                  <el-input v-model="itemObj.otherName" style="width:50%" placeholder="请输入副标题"></el-input>
              </el-form-item>
              <el-form-item label="产品价格：" prop="price" style="width: 100%">
                  <el-input v-model="itemObj.price" style="width:50%" placeholder="请输入产品价格"></el-input>
              </el-form-item>
              <el-form-item label="商品编号：" prop="commodityCode" style="width: 100%">
                  <el-input v-model="itemObj.commodityCode" style="width:50%" placeholder="请输入悦途商品编号" :disabled="alterDisabled"></el-input>
              </el-form-item>
              <el-form-item label="简介：" prop="desc" style="width: 100%">
                  <el-input type="textarea" v-model="itemObj.desc" style="width:50%" autosize maxlength="300" show-word-limit placeholder="请输入产品简介"></el-input>
              </el-form-item>
              <el-form-item label="用途：" style="width: 100%">
                <el-radio-group v-model="itemObj.usetypeid">
                  <el-radio label="1">高铁</el-radio>
                  <el-radio label="2">空铁</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="会员卡类型：" style="width: 100%">
                <el-radio-group v-model="itemObj.typeid">
                  <el-radio label="1">次卡</el-radio>
                  <el-radio label="2">周卡</el-radio>
                  <el-radio label="3">月卡</el-radio>
                  <el-radio label="4">季卡</el-radio>
                  <el-radio label="5">半年卡</el-radio>
                  <el-radio label="6">年卡</el-radio>
                  <el-radio label="7">2年卡</el-radio>
                  <el-radio label="8">3年卡</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="产品图片：" style="width: 100%">
                <el-upload
                  action=""
                  :auto-upload="false"
                  :show-file-list="false"
                  list-type="picture-card"
                  :on-change="handleChange">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-button size="mini" type="danger" @click="imageUrl = ''" style="margin-left: 45px;">删除</el-button>
              </el-form-item>
              <el-form-item label="产品内容：">
                <div class="editorBox">
                    <!-- 调用富文本编辑器 -->
                    <quill-editor ref="myText" v-model="itemObj.content" :config='editorOption' class="editor">
                    </quill-editor>
                </div>
              </el-form-item>
          </el-form>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
       <el-button type="primary" :loading="loadingBootm" @click="itemEditDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findYuyueIproduct , deleteYuyueIproductById , updateYuyueIproduct , saveYuyueIproduct , getChannelName , updateExamine } from '@/api/guest/serviceProduct'
import { dotOssUpload } from '@/api/nodeList'
import Pagination from "@/components/Pagination"
import { quillEditor } from 'vue-quill-editor'
import formatTime from "@/utils/formatTime"
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  components: {
    Pagination,
    quillEditor
  },
  data() {
    return {
      editorOption: {
        placeholder: '请输入...',
        // 编辑器的配置
        // something config
        theme: "bubble"
      },
      imageUrl: "",
      dialogTitle: "",
      thishostName: '',
      alterDisabled: false,
      loadingBootm: false,
      loading: false,
      editDialog: false,
      itemID: null,
      itemObj: {},
      rules: {
          username: [
            { required: true, message: '不能为空', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
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
        name: null,
        otherName: null,
        usetypeid: null,
        typeid: null,
        examine: null
      },
      itemArr: [],
      statusList: [
        {
          name: "高铁",
          usetypeid: 1
        },
        {
          name: "空铁",
          usetypeid: 2
        }
      ],
      statusList2: [
        {
          name: "次卡",
          typeid: 1
        },
        {
          name: "周卡",
          typeid: 2
        },
        {
          name: "月卡",
          typeid: 3
        },
        {
          name: "季卡",
          typeid: 4
        },
        {
          name: "半年卡",
          typeid: 5
        },
        {
          name: "年卡",
          typeid: 6
        },
        {
          name: "2年卡",
          typeid: 7
        },
        {
          name: "3年卡",
          typeid: 8
        }
      ],
      auditList: [
        {
          name: '已通过',
          value: 1
        },
        {
          name: '未通过',
          value: 0
        }
      ],
      nameList: []
    }
  },
  created() {
    this.getData()
    this.apiGetChannelName()
  },
  methods: {
    audit(item){
      this.open2('确定审核通过？' , item.id)
    },
    open2(text,id) {
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateExamine({id}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getData()
            }else{
              this.$message({
                type: 'info',
                message: res.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    apiGetChannelName(){
      getChannelName().then(res=>{
        // console.log(res);
      })
    },
    itemEditDialog(){
      this.loadingBootm = true
      this.itemObj.picfilepath = this.imageUrl
      this.itemObj.id = this.itemID
      // delete this.itemObj.dateline
      if(this.itemID){
        updateYuyueIproduct(this.itemObj).then(res=>{
          this.loadingBootm = false
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.editDialog = false
          }else{
            this.$message({
              type: 'error',
              message: res.data
            })
          }
        })
      }else{  
        saveYuyueIproduct(this.itemObj).then(res=>{
          this.loadingBootm = false
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.editDialog = false
          }else{
            this.$message({
              type: 'error',
              message: res.data
            })
          }
        })
      }
    },
    apiUploadImg(formData){
      dotOssUpload(formData).then(res => {
        if(res.code == 200){
          this.imageUrl = res.data
          this.$message({
            type: 'success',
            message: '上传成功！'
          })
        }else{
          this.$message.error('上传失败！');
        }
      })
    },
    handleChange(file, fileList){
      if (fileList) {
            var formData = new FormData()
          // formData.append('dotCode', this.dotCode)
            formData.append('file', file.raw)
           this.apiUploadImg(formData)
          } else {
          this.$message({ message: '请上传图片!' })
      }
    },
    handleSelectionChange(val) {
        this.itemArr = val
    },
    remove(item){
      if(item === 2){
        if(this.itemArr.length == 0){
          this.$message({
            type: 'info',
            message: '请选择数据！'
          })
          return
        }
        var arr = []
        this.itemArr.forEach(v=>{
          arr.push(v.id)
        })
        this.open('确定批量删除？' , arr)
      }else{
        this.open('确定删除？' , [item.id])
      }
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteYuyueIproductById({ids: id}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getData()
            }else{
              this.$message({
                type: 'info',
                message: res.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.name) {
        data.name = queryList.name
      }
      if(!(queryList.otherName == null)){
        data.otherName = queryList.otherName
      }
      if(!(queryList.usetypeid == null)){
        data.usetypeid = queryList.usetypeid
      }
      if(!(queryList.typeid == null)){
        data.typeid = queryList.typeid
      }
      if(!(queryList.examine == null)){
        data.examine = queryList.examine
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      // data.username = this.$store.state.user.name
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findYuyueIproduct(data).then(res=>{
        // this.data = res;
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
        if( res.data && res.data.length > 0){
          this.data = res;
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          this.data.data.forEach(v=>{
              if( v.dateline){
                v.dateline = formatTime(v.dateline*1000,'yyyy-mm-dd hh:mm:ss')
              }
              if(v.typeid == 1){
                v.typeidCopy = "次卡"
              }else if(v.typeid == 2){
                v.typeidCopy = "周卡"
              }else if(v.typeid == 3){
                v.typeidCopy = "月卡"
              }else if(v.typeid == 4){
                v.typeidCopy = "季卡"
              }else if(v.typeid == 5){
                v.typeidCopy = "半年卡"
              }else if(v.typeid == 6){
                v.typeidCopy = "年卡"
              }else if(v.typeid == 7){
                v.typeidCopy = "2年卡"
              }else if(v.typeid == 8){
                v.typeidCopy = "3年卡"
              }
          })
        }
      })
    },
    compile(item){
      this.alterDisabled = true
      this.itemObj = item
      this.editDialog = true
      this.dialogTitle = "编辑"
      this.itemID = item.id
    },
    newlyIncreased(){
      this.itemObj = {}
      this.alterDisabled = false
      this.editDialog = true
      this.dialogTitle = "新增"
    },
    close(){
      this.itemObj = {}
      this.itemID = null
      this.imageUrl = ""
      this.loadingBootm = false
      this.getData()
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        name: null,
        otherName: null,
        usetypeid: null,
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
.avatar {
   width: 148px;
   height: 148px;
   border-radius: 4px;
   cursor: pointer;
 }
</style>
