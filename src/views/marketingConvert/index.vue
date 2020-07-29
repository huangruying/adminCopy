<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <!-- <el-input
          v-model="queryList.cardno"
          placeholder="请输入卡号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.usetypeid" @change="getData" class="input fl" placeholder="请选择用途">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.usetypeid"
              :key="item.usetypeid"
            ></el-option>
          </el-select> -->
       </div> 
       <div class="btn_box">
         <div>
           <!-- <el-button type="danger" @click="remove(2)">批量删除</el-button> -->
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div>
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
      style="width: 100%;">
      <!-- 删除待定 -->
      <!-- <el-table-column
        align="center"
        type="selection"
        width="50">
     </el-table-column> -->
      <el-table-column label="ID" prop="id" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道" prop="channels" align="center">
        <template slot-scope="scope">
          <div v-for="(v,i) in scope.row.channels" :key="i">{{v.channelName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="name">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="price" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="dateline" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dateline }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品组合" prop="combinations" align="center">
        <template slot-scope="scope">
          <div v-for="(l,t) in scope.row.combinations" :key="t">{{l}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="management(scope.row)">管理券码</el-button>
          <!-- <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页，只需要2条数据，后期需求请打开v-if -->
    <pagination
      v-show="data.total>0"
      v-if="false"
      :total="data.total"
      :page.sync="data.current_page"
      :limit.sync="data.per_page"
      @pagination="getPageData"
    />
    <el-dialog
      :title="text"
      :close-on-click-modal="false"
      :visible.sync="visibleCode"
      width="90%"
      @close="close2"
      center>
      <!--上传文件的弹窗-->
      <el-dialog center width="50%" @close="close3" :close-on-click-modal="false" :visible.sync="uploaddialogVisible" append-to-body title="导入数据" :before-close="handleClose">
        <el-date-picker
          v-if="number === 1"
          v-model="valueDate"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="请选择过期日期">
        </el-date-picker>
        <div style="margin: 0 auto;">
          <el-upload ref="upload" :auto-upload="false" :multiple="false" :on-change="handleChange" :on-remove="removeFile"
            :limit="1" action="" drag class="upload-demo">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose2">返 回</el-button>
          <el-button type="primary" :loading="loadingUpload" @click="submitImportExcel">确 定</el-button>
        </span>
      </el-dialog>
      <el-divider content-position="left"><span class="title">查询</span></el-divider>
        <div class="query">
          <div class="input_box">
              <el-select v-model="dialogList.state" @change="apiCodeState()" class="input fl" placeholder="请选择核销状态">
                <el-option
                  v-for="item in dialogStateList"
                  :label="item.name"
                  :value="item.usetypeid"
                  :key="item.usetypeid"
                ></el-option>
              </el-select>
              <el-input
                v-model="dialogList.code"
                placeholder="请输入兑换码"
                class="input fl"
                @keyup.enter.native="apiCodeState"/>
                <el-button type="primary" icon="el-icon-refresh" @click="refurbish" class="refurbish"></el-button>
          </div> 
          <div class="btn_box">
            <div>
              <el-button type="danger" @click="remove(2)">批量删除</el-button>
              <el-button type="info" @click="exportData">下载导入模板</el-button>
              <el-button type="info" @click="exportData2">下载导入兑换编号核销不记名卡模板</el-button>
            </div>
            <div>
              <el-button type="primary" @click="uploadDV(1)">导入不记名卡</el-button>
              <el-button type="primary" @click="uploadDV(2)">导入兑换编号核销不记名卡</el-button>
            </div>
          </div>
        </div>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-table
            v-loading="codeLoading"
            :data="codeData.data"
            border
            stripe
            fit
            @selection-change="handleSelectionChange"
            class="itemTable">
            <el-table-column
                align="center"
                type="selection"
                width="50">
            </el-table-column> 
            <el-table-column label="ID" prop="id" width="80" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属渠道" prop="channelName" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.channelName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="兑换状态" prop="status" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.status}}</span>
              </template>
            </el-table-column>
            <el-table-column label="兑换码编号" prop="code" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.code}}</span>
              </template>
            </el-table-column>
            <el-table-column label="领取时间" prop="getdate" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.getdate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="导入时间" prop="importTime" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.importTime}}</span>
              </template>
            </el-table-column>
            <el-table-column label="过期时间" prop="pirationTime" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.pirationTime}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="兑换账号" prop="exchangeuser" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.exchangeuser}}</span>
              </template>
            </el-table-column>
            <el-table-column label="兑换大厅" prop="exchangehall" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.exchangehall}}</span>
              </template>
            </el-table-column>
            <el-table-column label="兑换日期" prop="exchangedate" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.exchangedate}}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="核销日期" prop="exchangedate" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.exchangedate}}</span>
              </template>
            </el-table-column>
            <el-table-column label="核销状态" prop="state" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.stateCopy}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120" prop="audit_status" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
                <el-button size="mini" type="primary" @click="codeCompile(scope.row)" v-if="scope.row.state == 1" style="margin-top: 10px;">核销券码</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="codeData.total>0"
            :total="codeData.total"
            :page.sync="codeData.current_page"
            :limit.sync="codeData.per_page"
            @pagination="getPageData2"
          />
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleCode = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBootm" @click="visibleCode = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findYyProductBearercardor , findYyBearercardByPid , delYyBearercardById , updateYyBearercardByState , importYyBearercardByCode , importYyBearercardByState } from '@/api/guest/marketingConvert'
import Pagination from "@/components/Pagination"
import formatTime from "@/utils/formatTime"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      loadingUpload: false,
      uploaddialogVisible: false,
      loadingBootm: false,
      codeLoading: false,
      valueDate: "",
      text: "",
      visibleCode: false,
      loading: false,
      codeId: null,
      itemArr: [],
      codeData: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 50,
        total: 0,
        link: ""
      },
      dialogList:{
        state: null,
        code: null
      },
      queryList: {
        cardno: null,
      },
      dialogStateList:[
        {
          name: "未核销",
          usetypeid: 1
        },
        {
          name: "未领取",
          usetypeid: 0
        },
        {
          name: "已核销",
          usetypeid: 2
        },
        {
          name: "已注销",
          usetypeid: 3
        },
        {
          name: "已过期",
          usetypeid: 4
        }
      ],
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
      fileList: "",
      number: null
    }
  },
  created() {
    this.getData()
  },
  methods: {
    exportData(){
      window.location.href = `https://dot-bucket.oss-cn-shenzhen.aliyuncs.com/mode/bearercard.xlsx`
    },
    exportData2(){
      window.location.href = `https://dot-bucket.oss-cn-shenzhen.aliyuncs.com/mode/Destruction.xlsx`
    },
    handleClose(done) {
      if(this.loadingBootm){
        this.$confirm('关闭后进程仍会在后台处理。', '你有进程在处理中，确认关闭？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done();
        }).catch(() => {
                   
        });
      }else{
        done();
      }
    },
    handleClose2(){
      if(this.loadingBootm){
        this.$confirm('关闭后进程仍会在后台处理。', '你有进程在处理中，确认关闭？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.uploaddialogVisible = false
        }).catch(() => {
                   
        });
      }else{
        this.uploaddialogVisible = false
      }
    },
    uploadDV(num){
      this.number = num
      this.uploaddialogVisible = true
    },
    apiCodeState(){
     this.apiCode(this.codeId)
    },
    refurbish(){
      this.dialogList = {
        state: null,
        code: null
      },
      this.apiCode(this.codeId)
    },
    submitImportExcel() {
      if(this.number == 1){
        if(!this.valueDate){
          this.$message({
            message: '请选择过期日期!'
          })
          return
        }
         this.loadingUpload = true
        if (this.fileList) {
          var formData = new FormData()
          formData.append('file', this.fileList[0].raw)
          formData.append('id', this.codeId)
          formData.append('pirationTime', this.valueDate)
          importYyBearercardByCode(formData).then(res => {
            this.loadingUpload = false
            if(res.code == 200){
              this.uploaddialogVisible = false
              this.apiCode(this.codeId)
              this.$message({
                type: 'success',
                message: res.msg
              })
            }else{
              this.$message({
                type: "info",
                message: res.msg
              })
            }
          })
        } else {
          this.loadingUpload = false
          this.$message({
            message: '请选择Excle文件!'
          })
        }
      }else{
         this.loadingUpload = true
        if (this.fileList) {
          var formData = new FormData()
          formData.append('file', this.fileList[0].raw)
          // formData.append('id', this.facilitatorId)
          importYyBearercardByState(formData).then(res => {
            this.loadingUpload = false
            if(res.code == 200){
              this.uploaddialogVisible = false
              this.apiCode(this.codeId)
              this.$message({
                type: 'success',
                message: res.msg
              })
            }else{
              this.$message({
                type: "info",
                message: res.msg
              })
            }
          })
        } else {
          this.$message({
            message: '请选择Excle文件!'
          })
        }
      }
    },
    removeFile(file, fileList) {
        this.fileList = null
    },
    handleChange(file, fileList) {
        this.fileList = fileList
    },
    codeCompile(item){
      this.codeOpen("确定核销该券码？", item.id)
    },
    codeOpen(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.codeLoading = true
          updateYyBearercardByState({id: id}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.apiCode(this.codeId)
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
          this.codeLoading = true
          delYyBearercardById({ids: id}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.apiCode(this.codeId)
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
    management(item){
      this.visibleCode = true
      this.text = item.name
      this.codeId = item.id
      this.apiCode(item.id)
    },
    apiCode(id,filter){
      this.codeLoading = true
      let data = {}
      // data.pid = id
      if(!(this.dialogList.state == null)){
        data.state = this.dialogList.state
      }
      if(this.dialogList.code){
        data.code = this.dialogList.code
      }
      if (filter && this.codeData.current_page > 1) {
        data.page = this.codeData.current_page;
      } else {
        this.codeData.current_page = 1;
      }
      data.pageNum = this.codeData.current_page
      data.pageSize = this.codeData.per_page
      findYyBearercardByPid(data).then(res=>{
          this.codeLoading = false;
          if (!res.data || res.data.length <= 0) {
            this.$message("暂无数据~")
            this.codeData.data = []
            this.codeData.total = 0
          }
          if( res.data && res.data.length > 0){
            this.codeData = res;
            this.codeData.current_page = res.pageNum
            this.codeData.per_page = res.pageSize
            this.codeData.total = res.total
            this.codeData.data.forEach(v=>{
              if(v.state == 0){
                v.stateCopy = "未领取"
              }else if(v.state == 1){
                v.stateCopy = "未核销"
              }else if(v.state == 2){
                v.stateCopy = "已核销"
              }else if(v.state == 3){
                v.stateCopy = "已注销"
              }else{
                v.stateCopy = "已过期"
              }
              if( v.getdate && v.getdate != 0){
                v.getdate = formatTime(v.getdate*1000,'yyyy-mm-dd hh:mm:ss')
              }else{
                v.getdate = ""
              }
              if( v.exchangedate && v.exchangedate != 0){
                v.exchangedate = formatTime(v.exchangedate*1000,'yyyy-mm-dd hh:mm:ss')
              }else{
                v.exchangedate = ""
              }
            })
          }
      })
    },
    getData(filter){
      this.loading = true
      let data = {}
      // var queryList = this.queryList
      // if (queryList.cardno) {
      //   data.cardno = queryList.cardno
      // }
      // if(!(queryList.usetypeid == null)){
      //   data.usetypeid = queryList.usetypeid
      // }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findYyProductBearercardor(data).then(res=>{
        this.loading = false;
        if (!res.data || res.data.length <= 0) {
          this.$message("暂无数据~")
          this.data = {
            current_page: 1,
            data: [],
            last_page: 1,
            per_page: 50,
            total: 0,
            link: ""
          }
          this.data.total = 0
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
          })
          // 只留下id为7和23的数据留下，后期需求请删除过滤器
         const arrDate = this.data.data.filter(i=>{
            return i.id == 7 || i.id == 23
          })
         this.data.data = arrDate
         
        }
      })
    },
    close(){
      this.itemObj = {}
      this.itemID = null
      this.imageUrl = ""
      this.loadingBootm = false
    },
    close2(){
      this.codeData = {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      }
    },
    close3(){
      this.number = null
      this.fileList = ""
      this.valueDate = ""
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    getPageData2(e) {
      this.apiCode(this.codeId , "page");
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
.refurbish{
  margin-left: 100px;
}
.upload-demo {
    text-align: center;
    padding: 0 100px;
  }
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
