<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.orderNo"
          placeholder="请输入订单号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.phone"
          placeholder="请输入用户手机号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.username"
          placeholder="请输入购买用户"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
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
          ></el-date-picker>
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
      @selection-change="handleSelectionChange"
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column
        align="center"
        type="selection"
        width="50">
     </el-table-column>
      <el-table-column width="80" label="ID" prop="id" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNo" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道" prop="channelNames" align="center">
        <template slot-scope="scope">
          <!-- <div v-for="(ditch,idx) in scope.row.channelNames" :key="idx">{{ditch}}</div> -->
          <span>{{ scope.row.cname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买用户" prop="username" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买用户手机号" prop="phone" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="购买时间" prop="purchaseTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.purchaseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品价格" prop="price" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际支付金额" prop="payAmount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠金额" prop="money" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券使用状态" prop="money" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type == 0? "未使用优惠劵": "已使用优惠劵"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" prop="status" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statusCopy }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="180" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
           <el-button size="mini" type="primary" @click="lookOver(scope.row)">查看</el-button>
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
    <!-- 查看 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editDialog"
      width="60%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">订单信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="订单号：" prop="orderno" style="width: 100%">
                  <el-input v-model="itemObj.orderno" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="悦途订单号：" prop="orderno" style="width: 100%">
                  <el-input v-model="itemObj.orderno" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="购买用户：" prop="bindMemName" style="width: 100%">
                  <el-input v-model="itemObj.bindMemName" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="手机号：" prop="bindMemPhone" style="width: 100%">
                  <el-input v-model="itemObj.bindMemPhone" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="下单时间：" prop="dateline" style="width: 100%">
                  <el-input v-model="itemObj.dateline" style="width:50%" disabled></el-input>
              </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="title">订单商品</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <el-table
              :data="[itemObj]"
              border
              stripe
              fit
              :row-class-name="tableRowClassName"
              style="width: 100%;">
              <el-table-column label="商品信息" prop="ordername" fixed align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.ordername }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" prop="status" fixed align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.statusCopy }}</span>
                </template>
              </el-table-column>
              <el-table-column label="金额" prop="money" fixed align="center" width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.money }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量" prop="no" fixed align="center" width="120">
                <template slot-scope="scope">
                  <span>{{ scope.row.no }}</span>
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
import { findUserPurchaseProductOrder , delProductOrderByOrderNo } from '@/api/guest/ditchOrder'
import Pagination from "@/components/Pagination"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      editDialog: false,
      dialogTitle: "查看",
      loading: false,
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
        time: ["" , ""],
        status: null,
        name: null,
        username: null,
        phone: null,
        orderNo: null
      },
      statusList: [
        {
          name: "未支付",
          value: 0
        },
        {
          name: "已支付",
          value: 1
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
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
          arr.push(v.orderNo)
        })
        this.open('确定批量删除？' , arr)
      }else{
        this.open('确定删除？' , [item.orderNo])
      }
    },
    open(text,orderNo) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          delProductOrderByOrderNo({orderNos: orderNo}).then(res=>{
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
      if (queryList.orderNo) {
        data.orderno = queryList.orderNo
      }
      if (queryList.phone) {
        data.phone = queryList.phone
      }
      if (queryList.username) {
        data.username = queryList.username
      }
      if (queryList.name) {
        data.name = queryList.name
      }
      if(!(queryList.status == null)){
        data.status = queryList.status
      }
      if (queryList.time[0] && queryList.time[1]) {
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
      findUserPurchaseProductOrder(data).then(res=>{
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
            if(v.status == 0){
              v.statusCopy = "未支付"
            }else if(v.status == 1){
              v.statusCopy = "已支付"
            }else if(v.status == 2){
              v.statusCopy = "已完成"
            }else if(v.status == 3){
              v.statusCopy = "未完成"
            }else if(v.status == 4){
              v.statusCopy = "已退单"
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
      this.itemID = null
      this.imageUrl = ""
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        orderno: null,
        bindMemPhone: null,
        status: null
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
  width: 360px;
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
