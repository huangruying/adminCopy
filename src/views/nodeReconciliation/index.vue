<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.dotName"
          placeholder="请输入网点名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.remark"
          placeholder="请输入备注信息"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-date-picker
            class="input fl"
            v-model="queryList.time"
            value-format="yyyy-MM"
            @change="getData"
            type="month"
            placeholder="选择月份">
          </el-date-picker>
          <!-- <el-select v-model="queryList.reconciliation" @change="getData" class="input fl" placeholder="是否对账">
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
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getData"
          ></el-date-picker> -->
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
           <el-button type="primary" @click="exportData">批量导出</el-button>
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
      style="width: 100%;"
      @selection-change="handleSelectionChange">
      <!-- fit highlight-current-row -->
      <el-table-column
        align="center"
        type="selection"
        width="50">
     </el-table-column>
      <el-table-column label="ID" prop="id" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月份" prop="month" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.month }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网点名称" prop="dotName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网点简称" prop="dotAbbreviation" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotAbbreviation }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="网点详细地址" prop="dotAddress" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotAddress }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="省" prop="province" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市" prop="city" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区" prop="area" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单总数" prop="totalOrder" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算总金额" prop="totalAmount" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.totalAmount }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.status == 0? "未结算": "已结算" }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="创建时间" prop="createTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="updateTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="备注" prop="remark" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="compile(scope.row)">详 情</el-button>
          <el-button size="mini" type="primary" @click="modification(scope.row)">修改备注</el-button>
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

    <!-- 详情 -->
    <el-dialog
      :title="text"
      :visible.sync="visibleLobby"
      :close-on-click-modal="false"
      width="80%"
      @close="close2"
      center>
      <div class="input_box">
        <el-input
          v-model="queryList2.orderNo"
          placeholder="请输入订单号"
          class="input fl"
          @keyup.enter.native="handleFilter2"/>
          <el-input
          v-model="queryList2.licensePlate"
          placeholder="请输入车牌号"
          class="input fl"
          @keyup.enter.native="handleFilter2"/>
          <el-input
          v-model="queryList2.couponCode"
          placeholder="请输入劵码号"
          class="input fl"
          @keyup.enter.native="handleFilter2"/>
          <!-- <el-select v-model="queryList2.reconciliation" @change="getList" class="input fl" placeholder="是否对账">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select> -->
      </div>
       <div class="btn_box" style="margin-bottom:10px;">
           <div></div>
           <div>
             <el-button type="primary" @click="deriveData">导出</el-button>
             <el-button type="primary" icon="el-icon-refresh" @click="resetGetData2"></el-button>
           </div>
       </div>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-table
            v-loading="dialogLoading"
            :data="lobbyData.data"
            border
            stripe
            fit
            class="itemTable">
            <el-table-column label="渠道名称" prop="channelName" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.channelName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="服务名称" prop="dotType" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.dotType }}</span>
              </template>
            </el-table-column>
            <el-table-column label="项目名称" prop="dotsType" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.dotsType }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单号" prop="orderNo" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.orderNo }}</span>
              </template>
            </el-table-column>
            <el-table-column label="车牌号" prop="licensePlate" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.licensePlate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="客户名称" prop="name" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="客户手机号" prop="phone" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.phone }}</span>
              </template>
            </el-table-column>
            <el-table-column label="劵码号" prop="couponCode" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.couponCode }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="预约时间" prop="appointmentTime" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.appointmentTime }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="下单时间" prop="placeTime" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.placeTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="订单状态" prop="orderStatus" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.orderStatus==0?"未支付":"已支付" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remarks" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.remarks }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="是否对账" prop="reconciliation" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.reconciliation==0?"未对账":"已对账" }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" fixed="right" prop="audit_status" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="modification2(scope.row)">修改备注</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="lobbyData.total>0"
            :total="lobbyData.total"
            :page.sync="lobbyData.current_page"
            :limit.sync="lobbyData.per_page"
            @pagination="getPageData2"
          />
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleLobby = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBootm" @click="visibleLobby = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findServicerMonthly , findServiceOrderByMonth , modifyServicerMonthlyRemark , modifySoRemarks , serviceOrderMonthExports } from '@/api/nodeReconciliation'
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
      month: "",
      id: "",
      text: "",
      dotCode: "",
      dialogTitle: "",
      thishostName: '',
      loadingBootm: false,
      urlBl: false,
      alterDisabled: false,
      inputDisabled: false,
      passRadio: null,
      loading: false,
      dialogLoading: false,
      passDialog: false,
      editDialog: false,
      visibleLobby: false,
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
      lobbyData:{
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        dotName: null,
        remark: null,
        time: ""
      },
      queryList2: {
        orderNo: null,
        licensePlate: null,
        couponCode: null,
      },
      statusList: [
        {
          name: '未对账',
          value: 0
        },
        {
          name: '已对账',
          value: 1
        },
      ],
      itemArr: []
    }
  },
  created() {
    this.getData()
    this.thishostName = `${location.protocol}//${location.hostname}`
  },
  methods: {
    exportData(){
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
        var arrs = JSON.stringify(arr)
        this.open3('确定批量导出？' , arrs)
    },
    handleSelectionChange(val) {
        this.itemArr = val
    },
    deriveData(){
      // console.log(this.lobbyData.data);
      if(this.lobbyData.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var {orderNo,licensePlate,couponCode} = this.queryList2
          // window.location.href = `${baseUrl}/wash/servicerMonth/serviceOrderMonthExport?pageNum=${this.lobbyData.current_page}&pageSize=${this.lobbyData.per_page}
          // &orderNo=${orderNo}&couponCode=${couponCode}&licensePlate=${licensePlate}`
          window.location.href = `${baseUrl}/wash/servicerMonth/serviceOrderMonthExport?pageNum=${this.lobbyData.current_page}&pageSize=${this.lobbyData.per_page}&orderNo=${orderNo}&couponCode=${couponCode}&licensePlate=${licensePlate}&dotId=${this.id}&month=${this.month}`
      }
    },
    open3(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          window.location.href = `${baseUrl}/wash/servicerMonth/serviceOrderMonthExports?monthIds=${id}`
          // window.location.href = `${baseUrl}/wash/servicerMonth/serviceOrderMonthExports?monthIds=${id}`
          this.getData()
          // serviceOrderMonthExports({monthIds: id}).then(res=>{
          //   // this.down(`${this.thishostName}${res.url}`)
          // })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    down(url) {
      var a = document.createElement('a')
      a.href = url // 文件地址
      document.body.appendChild(a)
      a.click()
    },
    open(id,remark) {
        this.$prompt('请输入备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: remark,
          inputPlaceholder: "请输入备注"
        }).then(({ value }) => {
          modifyServicerMonthlyRemark({id,remark: value}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功！'
              });
              this.getData()
            }else{
                this.$message({
                  type: 'info',
                  message: res.msg
                }); 
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });       
        });
    },
    open2(id,remark) {
        this.$prompt('请输入备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: remark,
          inputPlaceholder: "请输入备注"
        }).then(({ value }) => {
          modifySoRemarks({id,remark: value}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功！'
              });
              this.getList()
            }else{
                this.$message({
                  type: 'info',
                  message: res.msg
                }); 
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });       
        });
    },
    modification2(item){
      this.open2(item.id,item.remarks)
    },
    modification(item){
      this.open(item.id,item.remark)
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.dotName) {
        data.dotName = queryList.dotName
      } 
      if (queryList.remark) {
        data.remark = queryList.remark
      }
      if (queryList.time) {
        data.month = queryList.time
      }
      // if(!(queryList.reconciliation == null)){
      //   data.reconciliation = queryList.reconciliation
      // }
      // if (queryList.time[0] && queryList.time[1]) {
      //   data.startTime = queryList.time[0]
      //   data.endTime = queryList.time[1]
      // }
      if (filter && this.data.current_page > 1) {
        this.data.current_page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      // data.username = this.$store.state.user.name
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findServicerMonthly(data).then(res=>{
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
    handleFilter2(){
      this.getList()
    },
    getPageData(e) {
      this.getData("page");
    },
    getPageData2(){
      this.getList("page");
    },
    compile(item){
      this.id = item.servicerId
      this.month = item.month
      // this.month = item.createTime.trim().split(/\s+/)[0]
      this.text = item.dotName + "信息"
      this.visibleLobby = true
      this.getList()
    },
    getList(filter){
      this.dialogLoading = true
      var data = {}
      if (filter && this.lobbyData.current_page > 1) {
        data.page = this.lobbyData.current_page;
      } else {
        this.lobbyData.current_page = 1;
      }
      var queryList2 = this.queryList2
      if (queryList2.orderNo) {
        data.orderNo = queryList2.orderNo
      }
      if (queryList2.licensePlate) {
        data.licensePlate = queryList2.licensePlate
      }
      if (queryList2.couponCode) {
        data.couponCode = queryList2.couponCode
      }
      if(!(queryList2.reconciliation == null)){
        data.reconciliation = queryList2.reconciliation
      }
      data.pageNum = this.lobbyData.current_page
      data.pageSize = this.lobbyData.per_page
      data.dotId = this.id
      data.month = this.month
      findServiceOrderByMonth(data).then(res=>{
        // console.log(res);
         this.dialogLoading = false;
        if (!res.data || res.data.length <= 0) {
          this.$message("暂无数据~")
          this.lobbyData = {
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
          this.lobbyData = res;
          this.lobbyData.current_page = res.pageNum
          this.lobbyData.per_page = res.pageSize
          this.lobbyData.total = res.total
          this.lobbyData.data.forEach(v=>{
            
          })
        }
      })
    },
    close2(){
      
    },
    reset(){
      this.queryList = {
        dotName: null,
        remark: null,
        time: ""
      }
    },
    reset2(){
      this.queryList2 = {
        orderNo: null,
        licensePlate: null,
        couponCode: null,
        reconciliation: null
      }
    },
    resetGetData(){
      this.reset()
      this.getData()
    },
    resetGetData2(){
      this.reset2()
      this.getList()
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
