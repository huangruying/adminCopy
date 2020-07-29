<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.name"
          placeholder="请输入渠道名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.bindMemPhone"
          placeholder="请输入手机号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.goodsname"
          placeholder="请输入商品名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.code"
          placeholder="请输入券码号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.status" @change="getData" class="input fl" placeholder="请选择订单状态">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-date-picker
            class="input fl"
            style="width:360px"
            v-model="queryList.time"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getData"
          ></el-date-picker>
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="danger" @click="remove(2)">批量删除</el-button>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div class="btn_top">
            <div class="btns" :class="btnss == 2? 'click' : ''" @click="btn(2)">不收费</div>
            <div class="btn" :class="btnss == 1? 'click' : ''" @click="btn(1)">收费</div>
         </div>
         <div>
           <el-button type="primary" @click="exportFile">导出</el-button>
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
      <el-table-column width="70" label="ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" width="220" prop="goodsname" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道商" width="170" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" width="190" prop="orderCode" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="第三方平台订单号" width="220" prop="orderId" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="券码" prop="code" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发放机构ID" width="190" prop="belongOrg" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.belongOrg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发放系统" width="170" prop="belongSys" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.belongSys }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" width="190" prop="dateline" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dateline }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户ID" prop="customerId" width="160" align="center">
        <template slot-scope="scope">
           <span>{{ scope.row.customerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" width="180" prop="bindMemName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bindMemName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="170" prop="bindMemPhone" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.bindMemPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生效时间" width="190" prop="cardEffTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cardEffTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失效时间" width="190" prop="cardInvTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cardInvTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单价格" width="120" prop="orderprice" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderprice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="120" prop="status" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statusCopy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
           <el-button size="mini" type="primary" @click="lookOver(scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
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
      :close-on-click-modal="false"
      :visible.sync="editDialog"
      width="60%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="订单号：" prop="orderCode" style="width: 100%">
                  <el-input v-model="itemObj.orderCode" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="第三方平台订单号：" prop="orderId" style="width: 100%">
                  <el-input v-model="itemObj.orderId" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="发放机构ID：" prop="belongOrg" style="width: 100%">
                  <el-input v-model="itemObj.belongOrg" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="客户ID：" prop="customerId" style="width: 100%">
                  <el-input v-model="itemObj.customerId" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="真实姓名：" prop="bindMemName" style="width: 100%">
                  <el-input v-model="itemObj.bindMemName" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="下单时间：" prop="dateline" style="width: 100%">
                  <el-input v-model="itemObj.dateline" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="生效时间：" prop="cardEffTime" style="width: 100%">
                  <el-input v-model="itemObj.cardEffTime" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="失效时间：" prop="cardInvTime" style="width: 100%">
                  <el-input v-model="itemObj.cardInvTime" style="width:50%" disabled></el-input>
              </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="title">商品详情</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <el-table
              :data="[itemObj]"
              border
              stripe
              fit
              :row-class-name="tableRowClassName"
              style="width: 100%;">
              <el-table-column label="商品名称" prop="goodsname" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.goodsname }}</span>
                </template>
              </el-table-column>
              <el-table-column label="渠道商" prop="name" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="券码" prop="code" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.code }}</span>
                </template>
              </el-table-column>
              <el-table-column label="发放系统" prop="belongSys" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.belongSys }}</span>
                </template>
              </el-table-column>
              <el-table-column label="订单价格" prop="orderprice" align="center" width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.orderprice }}</span>
                </template>
              </el-table-column>
              <el-table-column label="订单状态" prop="status" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.statusCopy }}</span>
                </template>
              </el-table-column>
            </el-table>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialog = false">返 回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findYyBearercardorderInfos , delYyBearercardorderById , yyBearercardorderExpor } from '@/api/guest/marketingOrder'
import Pagination from "@/components/Pagination"
import formatTime from "@/utils/formatTime"
import { baseUrl } from '@/utils/baseUrl'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      editDialog: false,
      dialogTitle: "查看",
      loading: false,
      btnss: 1,
      itemArr: [],
      itemObj: {},
      data: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        goodsname: null,
        name: null,
        status: null,
        bindMemPhone: null,
        time: "",
        code: null
      },
      statusList: [
        {
          name: "待支付",
          value: 1
        },
        {
          name: "已支付",
          value: 2
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    exportFile(){
      if(this.data.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var { goodsname,name,status,bindMemPhone,code } = this.queryList
          window.location.href = `${baseUrl}/wash/bearercard/yyBearercardorderExport?goodsname=${goodsname}&code=${code}&name=${name}&status=${status}&bindMemPhone=${bindMemPhone}`
      }
    },
    btn(index){
      this.btnss = index
      if(index == 2){
        this.$router.push({name: "marketingOrderCharge"})
      }else{
        this.$router.push({name: "marketingOrder"})
      }
    },
    tableRowClassName({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'warning-row';
        } else if (rowIndex === 1) {
          return 'success-row';
        }
        return '';
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
          delYyBearercardorderById({ids: id}).then(res=>{
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
      if (queryList.goodsname) {
        data.goodsname = queryList.goodsname
      }
      if (queryList.name) {
        data.name = queryList.name
      }
      if (queryList.code) {
        data.code = queryList.code
      }
      if (queryList.bindMemPhone) {
        data.bindMemPhone = queryList.bindMemPhone
      }
      if(!(queryList.status == null)){
        data.status = queryList.status
      }
      if (queryList.time && queryList.time[0] && queryList.time[1]) {
        data.startTime = queryList.time[0]
        data.endTime = queryList.time[1]
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findYyBearercardorderInfos(data).then(res=>{
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
            if(v.status == 1){
              v.statusCopy = "待支付"
            }else if(v.status == 2){
              v.statusCopy = "已支付"
            }else if(v.status == 3){
              v.statusCopy = "无需支付"
            }
            if( v.dateline){
              v.dateline = formatTime(v.dateline*1000,'yyyy-mm-dd hh:mm:ss')
            }
            if( v.cardEffTime){
              v.cardEffTime = formatTime(v.cardEffTime*1000,'yyyy-mm-dd hh:mm:ss')
            }
            if( v.cardInvTime){
              v.cardInvTime = formatTime(v.cardInvTime*1000,'yyyy-mm-dd hh:mm:ss')
            }
          })
        }
      })
    },
    lookOver(item){
      this.itemObj = item
      this.editDialog = true
    },
    close(){
      this.itemObj = {}
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        goodsname: null,
        name: null,
        status: null,
        bindMemPhone: null,
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
/deep/.el-date-editor .el-range-input{
  width: auto;
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
.btn_top{
  display: flex;
  margin-bottom: 30px;
  .btn,.btns{
    width: 100px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    background: #fff;
    border: 1px solid #ccc;
    margin-left: 10px;
    border-radius: 5px;
    font-size: 17px;
    cursor: pointer;
    &.click{
      background: #409eff;
      color: #fff;
    }
  }
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
