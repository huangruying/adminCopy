<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <!-- <el-input
          v-model="queryList.name"
          placeholder="请输入产品名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.status" @change="getData" class="input fl" placeholder="请选择支付状态">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-date-picker
          class="picker fl"
            v-model="queryList.time"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd hh:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getData"
          ></el-date-picker> -->
       </div> 
       <div class="btn_box">
         <div>
           <!-- <el-button type="danger" @click="remove(2)">批量删除</el-button> -->
           <!-- <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button> -->
         </div>
         <div>
           <el-button type="primary" @click="newly">新 增</el-button>
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
      <!-- <el-table-column
        align="center"
        type="selection"
        width="50">
     </el-table-column> -->
      <el-table-column width="90" label="1级菜单ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dtId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务项图标" prop="washPic" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.washPic" alt="" style="width: 70px;height: 70px;" v-if="scope.row.washPic">
          <span v-else>暂无图标</span>
        </template>
      </el-table-column>
      <el-table-column label="服务项名称" prop="dotType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务内容" prop="carwashsTypes" align="center">
        <template slot-scope="scope">
          <div v-for="item in scope.row.carwashsTypes" :key="item.ids">{{ item.dotsType }}</div>
        </template>
      </el-table-column>
      <el-table-column label="是否上线" prop="isOnline" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isOnline == 0?'否': '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
          <el-button size="mini" type="primary" @click="lookOver(scope.row)">编辑</el-button>
          <el-button size="mini" type="success" @click="popUpOnline(scope.row)" style="margin-top: 10px;">修改上线状态</el-button>
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
    <!-- 编辑，新增 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editDialog"
      width="70%"
      @close="close"
      center>
      <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
      <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
      <el-form :model="itemObj" label-position="right" ref="ruleForm" label-width="180px" class="clearFix">
        <el-form-item label="服务项名称：" prop="dotType" :rules="{required: true, message: '服务项名称不能为空', trigger: 'blur'}" style="width: 100%">
            <el-input v-model="itemObj.dotType" placeholder="请输入服务项名称" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="服务项图标：" prop="washPic" style="width: 100%">
            <el-upload
              action=""
              :auto-upload="false"
              :show-file-list="false"
              list-type="picture-card"
              :on-change="handleChange"
              :on-remove="handleRemove">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-button size="mini" type="danger" @click="imageUrl = ''" style="margin-left: 45px;">删除</el-button>
        </el-form-item>
      </el-form>
      </div>
      <el-divider content-position="left"><span class="title">服务内容</span></el-divider>
      <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;padding-left:30px;">
          <div v-for="(value,index) in itemObj.carwashsTypes" :key="index" class="value_dialog_for">
              <el-input v-model="value.dotsType" style="width:190px" placeholder="请输入服务名称" @input="input"></el-input>
              <el-button type="primary" @click="addition(index)">+添加</el-button>
              <el-button type="danger" @click="removeDialog(index)">删除</el-button>
              <div v-if="value.id" class="value_dialog">
                 <el-button size="mini" type="success" @click="popDialog(value)">修改上线状态</el-button>
                 <div class="val_dia">{{ value.isOnline == 0?'已下线': '上线中' }}</div>
              </div>
              <div class="popStatus" v-else>新增默认是下线状态</div>
          </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm()">确 定</el-button>
        <el-button @click="editDialog = false">返 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findCarwashTypes , delCarwashsType , updateCarwashsType , saveCarwashsType , goOnlineBydtId , goOnline , findCarwashTypesBydtId } from '@/api/nodeService'
import { dotOssUpload } from '@/api/nodeList'
import Pagination from "@/components/Pagination"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      imageUrl: "",
      editDialog: false,
      dialogTitle: "查看",
      loading: false,
      itemArr: [],
      itemObj: {},
      fileList: [],
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        // time: ["" , ""],
        // status: null,
      },
      statusList: [
       
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    apiFindCarwashTypesBydtId(dtId){
      findCarwashTypesBydtId({dtId}).then(res=>{
        if(res.code == 200){
          this.lookOver(res.data)
        }else{
          this.$message({
            type: 'info',
            message: res.msg
          })
        }
      })
    },
    popDialog(item){
     if(item.isOnline == 0){
        this.popDialogOpen("确定修改为 上线？", item.id, item.isOnline)
      }else{
        this.popDialogOpen("确定修改为 下线？", item.id, item.isOnline)
      }
    },
    popDialogOpen(text,id,isOnline){
      this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          goOnline({id: id,isOnline}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.apiFindCarwashTypesBydtId(this.itemID) 
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
    popUpOnline(item){
      if(item.isOnline == 0){
        this.openPop("确定修改为 上线？", item.dtId, item.isOnline)
      }else{
        this.openPop("确定修改为 下线？", item.dtId, item.isOnline)
      }
    },
    openPop(text,id,isOnline) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          goOnlineBydtId({dtId: id,isOnline}).then(res=>{
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
    addition(index){
        var obj = {
          dotsType: ""
        }
        this.itemObj.carwashsTypes.splice(index+1,0,obj)
        this.$forceUpdate()
    },
    removeDialog(index){
        if(this.itemObj.carwashsTypes.length <= 1){
          this.$message({
            type: "info",
            message: "再删就没数据啦！"
          })
          return
        }
        this.itemObj.carwashsTypes.splice(index,1)
        this.$forceUpdate()
    },
    input(){
        this.$forceUpdate()
    },
    tableRowClassName({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'warning-row';
        } else if (rowIndex === 1) {
          return 'success-row';
        }
        return '';
    },
    handleChange(file, fileList){
      if(fileList.length>0){
         this.fileList = [fileList[fileList.length - 1]] //展示最后一次选择文件
        //  this.storeImagess = URL.createObjectURL(file.raw);
      }
      if (this.fileList) {
            var formData = new FormData()
          // formData.append('dotCode', this.dotCode)
            formData.append('file', file.raw)
           this.apiUploadImg(formData)
          } else {
          this.$message({ message: '请上传图片!' })
      }
    },
    handleRemove(){
      this.fileList = []
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
    handleSelectionChange(val) {
        this.itemArr = val
    },
    remove(item){
        this.open('确定删除？' , item.dtId)
        //   if(item === 2){
        //     if(this.itemArr.length == 0){
        //       this.$message({
        //         type: 'info',
        //         message: '请选择数据！'
        //       })
        //       return
        //     }
        //     var arr = []
        //     this.itemArr.forEach(v=>{
        //       arr.push(v.id)
        //     })
        //     this.open('确定批量删除？' , arr)
        //   }else{
        //     this.open('确定删除？' , [item.id])
        //   }
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          delCarwashsType({id: id}).then(res=>{
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
        //   if (queryList.orderNo) {
        //     data.orderNo = queryList.orderNo
        //   }
        //   if(!(queryList.status == null)){
        //     data.status = queryList.status
        //   }
        //   if (queryList.time[0] && queryList.time[1]) {
        //     data.startTime = queryList.time[0]
        //     data.endTime = queryList.time[1]
        //   }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findCarwashTypes(data).then(res=>{
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
            
          })
        }
      })
    },
    lookOver(item){
      this.itemObj = item
      this.editDialog = true
      this.dialogTitle = "编辑"
      this.itemID = item.dtId
      if(item.washPic){
          this.imageUrl = item.washPic
      }
    },
    newly(){
        this.editDialog = true
        this.dialogTitle = "新增"
        var obj = {
          dotsType: ""
        }
        this.itemObj.carwashsTypes = [obj]
    },
    confirm(){
        if(this.itemID){
            updateCarwashsType({
                dotType: this.itemObj.dotType,
                id: this.itemID,
                washPic: this.imageUrl,
                dotTypes: this.itemObj.carwashsTypes
            }).then(res=>{
                if(res.code == 200){
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    });
                    this.apiFindCarwashTypesBydtId(this.itemID) 
                }else{
                    this.$message(res.msg)
                }
            })
        }else{
            saveCarwashsType({ 
                dotType: this.itemObj.dotType,
                washPic: this.imageUrl,
                dotTypes: this.itemObj.carwashsTypes
            }).then(res=>{
                if(res.code == 200){
                    this.editDialog = false
                    this.$message({
                        type: 'success',
                        message: '操作成功!'
                    })
                }else{
                    this.$message(res.msg)
                }
            })
        }
    },
    close(){
      this.itemObj = {}
      this.itemID = null
      this.imageUrl = ""
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
.popStatus{
  color: #f00;
  margin-left: 14px;
}
.value_dialog_for{
  margin-bottom: 9px;
  display: flex;
  .value_dialog{
    display: flex;
    align-items: center;
    margin-left: 14px;
    .val_dia{
      color: #409eff;
      margin-left: 8px;
    }
  }
}
.el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
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
