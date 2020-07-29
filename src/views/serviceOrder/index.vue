<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
         <el-input
          v-model="queryList.orderno"
          placeholder="请输入订单号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
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
          </el-select>
          <el-select v-model="queryList.typeid" @change="getData" class="input fl" placeholder="请选择次数">
            <el-option
              v-for="item in statusList2"
              :label="item.name"
              :value="item.typeid"
              :key="item.typeid"
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
           <el-button type="primary" @click="exportData">导出</el-button>
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
      <el-table-column label="ID" prop="id" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="totalOrderno" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalOrderno }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" prop="bindMemName" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bindMemName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户电话" prop="bindMemPhone" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bindMemPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="ytgoodsname" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ytgoodsname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡号" prop="cardno" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cardno }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类型" prop="typeid" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeid == 1? "次卡" : "年卡" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用途" prop="usetypeid" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.usetypeid == 1? "高铁" : "空铁" }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="所属渠道商" prop="channelName" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="statusCopy" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statusCopy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="dateline" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dateline }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失效时间" prop="cardInvTime" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cardInvTime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="90" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <pagination
      v-show="data.total>0"
      :total="data.total"
      :page.sync="data.current_page"
      :limit.sync="data.per_page"
      @pagination="getPageData"
    />
  </div>
</template>

<script>
import { findYyOrderytdetail , delYyOrderytdetailById } from '@/api/guest/serviceOrder'
import Pagination from "@/components/Pagination"
import formatTime from "@/utils/formatTime"
import { baseUrl } from '@/utils/baseUrl'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      loading: false,
      itemArr: [],
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        cardno: null,
        usetypeid: null,
        typeid: null,
        orderno: null
      },
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
          name: "年卡",
          typeid: 2
        }
      ],
    }
  },
  created() {
    this.getData()
  },
  methods: {
    exportData(){
      if(this.data.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var { cardno,usetypeid,typeid,orderno } = this.queryList
          window.location.href = `${baseUrl}/wash/orderytdetail/orderytdetailExport?cardno=${cardno}&usetypeid=${usetypeid}&typeid=${typeid}&orderno=${orderno}`
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
          this.loading = true
          delYyOrderytdetailById({ids: id}).then(res=>{
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
      if (queryList.cardno) {
        data.cardno = queryList.cardno
      }
      if (queryList.orderno) {
        data.orderno = queryList.orderno
      }
      if(!(queryList.usetypeid == null)){
        data.usetypeid = queryList.usetypeid
      }
      if(!(queryList.typeid == null)){
        data.typeid = queryList.typeid
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findYyOrderytdetail(data).then(res=>{
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
          // console.log(res);
          this.data = res;
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          this.data.data.forEach(v=>{
            if( v.dateline){
              v.dateline = formatTime(v.dateline*1000,'yyyy-mm-dd hh:mm:ss')
            }
            if(v.status == 1){
              v.statusCopy = "未支付"
            }else if(v.status == 2){
              v.statusCopy = "待使用"
            }else if(v.status == 3){
              v.statusCopy = "已核销"
            }else{
              v.statusCopy = "已退单"
            }
            if( v.cardInvTime){
              v.cardInvTime = formatTime(v.cardInvTime*1000,'yyyy-mm-dd hh:mm:ss')
            }
          })
        }
      })
    },
    close(){
      this.itemObj = {}
      this.itemID = null
      this.imageUrl = ""
      this.loadingBootm = false
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
