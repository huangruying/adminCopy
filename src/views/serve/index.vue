<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <!-- <el-input
          v-model="queryList.name"
          placeholder="请输入姓名"
          class="input fl"
          @keyup.enter.native="handleFilter"/> -->
          <el-input
          v-model="queryList.phone "
          placeholder="请输入手机号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.licensePlate"
          placeholder="请输入车牌号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.code"
          placeholder="请输入劵码号"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.dotAbbreviation"
          placeholder="请输入网点简称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <!-- <el-input
          v-model="queryList.dotName"
          placeholder="请输入网点名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/> -->
          <el-input
          v-model="queryList.channelName"
          placeholder="请输入渠道名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.province" @change="getDataProvince" class="input fl" placeholder="请选择省份">
            <el-option
              v-for="item in areaJson"
              :label="item.province"
              :value="item.provinceid"
              :key="item.provinceid"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.city" @change="getDataCity" class="input fl" placeholder="请选择城市">
            <el-option
              v-for="item in cityListJson"
              :label="item.city"
              :value="item.cityid"
              :key="item.cityid"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.region" @change="getData" class="input fl" placeholder="请选择区/县">
            <el-option
              v-for="item in regionListJson"
              :label="item.area"
              :value="item.areaid"
              :key="item.areaid"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.carwashId" @change="menuTwoList" class="input fl" placeholder="请选择服务类型">
            <el-option
              v-for="item in menuList"
              :label="item.dotType"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.carwashsId" @change="handleFilter" class="input fl" placeholder="请选择服务名称">
            <el-option
              v-for="item in menu2List"
              :label="item.dotsType"
              :value="item.ids"
              :key="item.ids"
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
          ></el-date-picker>
       </div> 
       <div class="btn_box">
         <div>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
           <!-- <el-button type="primary" @click="exportData">导出</el-button> -->
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
      <el-table-column label="订单号" prop="orderNo" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderNo }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="服务内容" prop="dotsType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotsType }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="网点简称" prop="dotAbbreviation" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotAbbreviation }}</span>
        </template>
      </el-table-column>
      <el-table-column label="劵码号" prop="couponCode" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.couponCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
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
      <el-table-column label="下单时间" prop="placeTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.placeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道价格" prop="channelMoney" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台价格" prop="servicerMoney" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.servicerMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remarks" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="success" @click="reconciliation(scope.row)" v-if="scope.row.reconciliation == 0? true : false">对账</el-button> -->
          <el-button size="mini" type="primary" @click="compile(scope.row)">查 询</el-button>
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
      width="50%"
      @close="close"
      center>
      <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
           <!-- <span class="title">账号信息</span> -->
           <el-form-item label="订单号:" prop="orderNo" style="width:50%">
              <el-input v-model="itemObj.orderNo" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="网点名称:" prop="dotName" style="width:50%">
              <el-input v-model="itemObj.dotName" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="网点简称:" prop="dotAbbreviation" style="width:50%">
              <el-input v-model="itemObj.dotAbbreviation" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="姓名:" prop="name" style="width:50%">
              <el-input v-model="itemObj.name" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="手机号:" prop="phone" style="width:50%">
              <el-input v-model="itemObj.phone" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="车牌号:" prop="licensePlate" style="width:50%">
              <el-input v-model="itemObj.licensePlate" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="劵码号:" prop="couponCode" style="width:50%">
              <el-input v-model="itemObj.couponCode" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="省:" prop="province" style="width:50%">
              <el-input v-model="itemObj.province" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="市:" prop="city" style="width:50%">
              <el-input v-model="itemObj.city" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="区:" prop="area" style="width:50%">
              <el-input v-model="itemObj.area" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="渠道名称:" prop="channelName" style="width:50%">
              <el-input v-model="itemObj.channelName" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="服务名称:" prop="dotType" style="width:50%">
              <el-input v-model="itemObj.dotType" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="服务内容:" prop="dotsType" style="width:50%">
              <el-input v-model="itemObj.dotsType" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="下单时间:" prop="placeTime" style="width:50%">
              <el-input v-model="itemObj.placeTime" style="width:80%" disabled></el-input>
           </el-form-item>
           <el-form-item label="备注:" prop="remarks" style="width:50%">
              <el-input v-model="itemObj.remarks" style="width:80%" disabled></el-input>
           </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBootm" @click="editDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findServiceOrderInfos , updateReconciliationByOrderNo } from '@/api/serve'
import { findYuyueProvinces , findYuyueCityByProvinceid , findYuyueAreasByCityid } from '@/api/nodeList' // 省市区接口
import { findCarwashsTypeById, findCarwashType } from '@/api/volumeList' // 服务项接口
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
      itemObj: {},
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
            { required: true, message: '不能为空', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          phone: [
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
        name: null,
        phone: null,
        licensePlate: null,
        code: null,
        dotAbbreviation: null,
        dotName: null,
        channelName: null,
        province: null,
        city: null,
        region: null,
        carwashId: null,
        carwashsId: null,
        time: ["", ""],
      },
      indentStateList: [
        {
          name: '未支付',
          id: 0
        },
        {
          name: '已支付',
          id: 1
        }
      ],
      sourceList: [
        {
          name: '全部',
          id: 0
        }
      ],
      statusList: [
        {
          name: '启用',
          value: 1
        },
        {
          name: '禁用',
          value: 0
        },
      ],
      areaJson: [],
      cityListJson: [],
      regionListJson: [],
      menu2List: [],
      menuList: []
    }
  },
  created() {
    this.getData()
    this.thishostName = `${location.protocol}//${location.hostname}`
    // 省市区
    this.ApiAreaJson()
    // 服务项数据
    this.apiFindCarwashType()
  },
  methods: {
    ApiAreaJson(){
      findYuyueProvinces().then(res=>{
        this.areaJson = res.data
      })
    },
    getDataProvince(){
      findYuyueCityByProvinceid({provinceid: this.queryList.province}).then(res=>{
        this.cityListJson = res.data
      })
      this.queryList.city = null
      this.queryList.region = null
      this.getData()
    },
    getDataCity(){
      findYuyueAreasByCityid({cityid: this.queryList.city}).then(res=>{
        this.regionListJson = res.data
      })
      this.queryList.region = null
      this.getData()
    },
    menuTwoList(){
      findCarwashsTypeById({carwashId: this.queryList.carwashId}).then(res=>{
        if(res.code == 200){
          this.menu2List = res.data
          this.queryList.carwashsId = null
          this.getData()
        }else{
          this.$message("服务器数据格出了小问题哦！")
        }
      })
    },
    apiFindCarwashType(){
      findCarwashType().then(res=>{
        if(res.code == 200){
          this.menuList = res.data
        }else{
          this.$message("服务器数据格出了小问题哦！")
        }
      })
    },
    reconciliation(item){
       this.open(item.orderNo)
    },
    open(orderNo) {
        this.$confirm('确定对账?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateReconciliationByOrderNo({orderNo}).then(res=>{
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
    exportData(){
            // console.log(this.data.data);
      if(this.data.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var {licensePlate,phone,garageName,orderSource,time} = this.queryList
          var startTime = time[0]
          var endTime = time[1]
          window.location.href = `${baseUrl}/wash/serviceOrderExport?pageNum=${this.data.current_page}&pageSize=${this.data.per_page}&licensePlate=${licensePlate}&phone=${phone}&dotName=${garageName}&orderSource=${orderSource}&startTime=${startTime}&endTime=${endTime}`
      }
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.name) {
        data.name = queryList.name
      }
      if (queryList.phone) {
        data.phone = queryList.phone   
      }
      if (queryList.licensePlate) {
        data.licensePlate = queryList.licensePlate   
      }
      if (queryList.code) {
        data.code = queryList.code   
      }
      if (queryList.dotAbbreviation) {
        data.dotAbbreviation = queryList.dotAbbreviation   
      }
      if (queryList.dotName) {
        data.dotName = queryList.dotName   
      }
      if (queryList.channelName) {
        data.channelName = queryList.channelName   
      }
      if (!(queryList.province == null)) {
        data.provinceId = queryList.province   
      }
      if (!(queryList.city == null)) {
        data.cityId = queryList.city   
      }
      if (!(queryList.region == null)) {
        data.regionId = queryList.region   
      }
      if (!(queryList.carwashId == null)) {
        data.carwashId = queryList.carwashId   
      }
      if (!(queryList.carwashsId == null)) {
        data.carwashsId = queryList.carwashsId   
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
      // data.username = this.$store.state.user.name
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findServiceOrderInfos(data).then(res=>{
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
            
          })
        }
      })
    },
    compile(item){
      this.dialogTitle = "查看"
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
        name: null,
        phone: null,
        licensePlate: null,
        code: null,
        dotAbbreviation: null,
        dotName: null,
        channelName: null,
        province: null,
        city: null,
        region: null,
        carwashId: null,
        carwashsId: null,
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
