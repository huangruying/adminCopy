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
          v-model="queryList.couponCode"
          placeholder="请输入券码号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.companyName"
          placeholder="请输入服务商名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.dotName"
          placeholder="请输入网点名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.phone"
          placeholder="请输入手机号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.licensePlate"
          placeholder="请输入车牌号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.province"
          placeholder="请输入省份"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.city"
          placeholder="请输入市"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.region"
          placeholder="请输入区"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-date-picker
            class="input fl"
            style="width:360px"
            v-model="queryList.time"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getData"
          ></el-date-picker>
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
           <el-button type="primary" @click="exportData">导出</el-button>
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
      <!-- fit highlight-current-row -->
      <el-table-column label="订单号" prop="orderNo" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="券码号" prop="couponCode" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.couponCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网点名称" prop="dotName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务商" prop="companyName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.companyName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="couponMoney" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.couponMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="phone" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车牌号" prop="licensePlate" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.licensePlate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核销时间" prop="destructionTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.destructionTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属省" prop="province" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属市" prop="city" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属区" prop="region" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.region }}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" prop="dotAddress" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotAddress }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="compile(scope.row)" v-if="scope.row.reconciliation==0">修改对账</el-button>
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
import { findWriteoffOrderHx } from '@/api/audit'
import Pagination from "@/components/Pagination"
import { baseUrl } from '@/utils/baseUrl'
export default {
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
      dotCode: "",
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
      itemObj: {
        openingBank: false
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
        orderNo: null,
        couponCode: null,
        companyName: null,
        dotName: null,
        phone: null,
        licensePlate: null,
        province: null,
        city: null,
        region: null,
        time: ["", ""],
      }
    }
  },
  created() {
    // console.log(baseUrl)
    this.getData()
    this.thishostName = `${location.protocol}//${location.hostname}`
  },
  methods: {
    exportData(){
      if(this.data.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var {orderNo,couponCode,companyName,dotName,phone,licensePlate,time} = this.queryList
          var startTime = time[0]
          var endTime = time[1]
          // console.log(orderNo,couponCode,companyName,dotName,phone,licensePlate,startTime,endTime);
          window.location.href = `${baseUrl}/wash/writeoffOrderHxExport?pageNum=${this.data.current_page}&pageSize=${this.data.per_page}
          &orderNo=${orderNo}&couponCode=${couponCode}&companyName=${companyName}&dotName=${dotName}&phone=${phone}&licensePlate=${licensePlate}&startTime=${startTime}&endTime=${endTime}`
      }
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.orderNo) {
        data.orderNo = queryList.orderNo
      }
      if (queryList.couponCode) {
        data.couponCode = queryList.couponCode   
      }
      if (queryList.companyName) {
        data.companyName = queryList.companyName   
      }
      if (queryList.dotName) {
        data.dotName = queryList.dotName   
      }
      if (queryList.phone) {
        data.phone = queryList.phone   
      }
      if (queryList.licensePlate) {
        data.licensePlate = queryList.licensePlate   
      }
      if (queryList.province) {
        data.province = queryList.province   
      }
      if (queryList.city) {
        data.city = queryList.city   
      }
      if (queryList.region) {
        data.region = queryList.region   
      }
      if (queryList.time[0] && queryList.time[1]) {
        data.startTime = queryList.time[0]
        data.endTime = queryList.time[1]
      }
      if (filter && this.data.current_page > 1) {
        this.data.current_page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findWriteoffOrderHx(data).then(res=>{
        // console.log(res);
        this.data = res;
        this.loading = false;
        if (res.msg == "暂无数据") {
          this.$message("暂无数据~")
          this.data = {
              current_page: 1,
              data: [],
              last_page: 1,
              per_page: 10,
              total: 0,
              link: ""
            }
        }
        if( res.data && res.data.length > 0){
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          // this.data.data.forEach(v=>{
          // })
        }
      })
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        orderNo: null,
        couponCode: null,
        companyName: null,
        dotName: null,
        phone: null,
        licensePlate: null,
        province: null,
        city: null,
        region: null,
        time: ["", ""],
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
