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
          <!-- <el-date-picker
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
           <el-button type="danger" @click="remove(2)">批量删除</el-button>
           <el-button type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
           <el-button type="primary" @click="reset">重置</el-button>
         </div>
         <div>
           <el-button type="primary" @click="newly">新增</el-button>
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
      <el-table-column label="渠道名" prop="channelName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channelName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="别名" prop="alias" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.alias }}</span>
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
      <el-table-column label="服务类型" prop="dotType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="服务名称" prop="dotsType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotsType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠价" prop="price" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间" prop="fromTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.fromTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失效时间" prop="toTime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.toTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <div style="width: 50%;padding:0 0 7px 7px; float: left;"> <el-button size="mini" type="primary" @click="lookOver(scope.row)">查看</el-button> </div>
          <div style="width: 50%;padding:0 0 7px 0; float: left;"> <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button> </div>
          <div style="width: 50%;padding:0 0 7px 7px; float: left;"> <el-button size="mini" type="primary" @click="editTheNew(scope.row)">编辑</el-button> </div>
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
        <el-divider content-position="left"><span class="title">详细信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="ID：" prop="id" style="width: 100%">
                  <el-input v-model="itemObj.id" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="省：" prop="province" style="width: 100%">
                  <el-input v-model="itemObj.province" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="市：" prop="city" style="width: 100%">
                  <el-input v-model="itemObj.city" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="区：" prop="area" style="width: 100%">
                  <el-input v-model="itemObj.area" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="有效时间：" prop="fromTime" style="width: 100%">
                  <el-input v-model="itemObj.fromTime" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="失效时间：" prop="toTime" style="width: 100%">
                  <el-input v-model="itemObj.toTime" style="width:50%" disabled></el-input>
              </el-form-item>
              <el-form-item label="创建时间：" prop="createTime" style="width: 100%">
                  <el-input v-model="itemObj.createTime" style="width:50%" disabled></el-input>
              </el-form-item>
          </el-form>
        </div>
        <el-divider content-position="left"><span class="title">重要信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <el-table
              :data="[itemObj]"
              border
              stripe
              fit
              :row-class-name="tableRowClassName"
              style="width: 100%;">
              <el-table-column label="渠道名" prop="channelName" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.channelName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="服务类型" prop="dotType" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.dotType }}</span>
                </template>
              </el-table-column>
              <el-table-column label="服务名称" prop="dotsType" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.dotsType }}</span>
                </template>
              </el-table-column>
              <el-table-column label="优惠价" prop="price" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.price }}</span>
                </template>
              </el-table-column>
            </el-table>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editDialog = false">返 回</el-button>
      </span>
    </el-dialog>
    <!-- 新增编辑 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editTheNewDialog"
      width="50%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="渠道：" prop="channelId" style="width: 100%">
                  <el-select v-model="itemObj.channelId" style="width:50%" placeholder="请选择渠道">
                    <el-option
                    v-for="item in statusInfoList"
                    :label="item.name"
                    :value="item.id"
                    :key="item.id"
                    ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="省:" prop="provinceid" style="width:100%">
                <el-select v-model="itemObj.provinceid" placeholder="请选择省份" @change="changeCity(itemObj.provinceid)" :disabled="disabledCity">
                    <el-option v-for="(item, idx) in areaJson" :key="idx" :label="item.province" :value="item.provinceid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="市:" prop="cityid" style="width:100%">
                <el-select v-model="itemObj.cityid" placeholder="请选择城市" @change="changeCounty(itemObj.cityid)" :disabled="disabledCity">
                    <el-option v-for="(item, idx) in cityList" :key="idx" :label="item.city" :value="item.cityid"></el-option>
                </el-select>
                <el-checkbox v-model="itemObj.wholeCity" style="margin-left: 11px;" @change="changeBox">全市统一价</el-checkbox>
              </el-form-item>
              <el-form-item label="区:" prop="areaid" style="width:100%" v-if="!itemObj.wholeCity">
                <el-select v-model="itemObj.areaid" placeholder="请选择区/县"  @change="regionChange" :disabled="disabledCity">
                    <el-option v-for="(item, idx) in countyList" :key="idx" :label="item.area" :value="item.areaid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="服务类型：" prop="carwashId" style="width: 100%">
                  <el-select v-model="itemObj.carwashId" @change="menuTwoList2" placeholder="请选择服务类型">
                    <el-option
                      v-for="item in menuList"
                      :label="item.dotType"
                      :value="item.id"
                      :key="item.id"
                    ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="服务名称：" prop="carwashsId" style="width: 100%">
                  <el-select v-model="itemObj.carwashsId" placeholder="请选择服务名称" @change="changeT">
                    <el-option
                      v-for="item in menu2List"
                      :label="item.dotsType"
                      :value="item.ids"
                      :key="item.ids"
                    ></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="优惠价：" prop="price" style="width: 100%">
                  <el-input v-model="itemObj.price" style="width: 200px;" placeholder="请输入金额"></el-input>
              </el-form-item>
              <el-form-item label="有效时间" prop="fromTime" style="width: 100%">
                <!--  default-time="23:59:59" -->
                  <el-date-picker
                    v-model="itemObj.fromTime"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="有效时间">
                  </el-date-picker>
              </el-form-item>
              <el-form-item label="过期时间" prop="toTime" style="width: 100%">
                  <el-date-picker
                    v-model="itemObj.toTime"
                    type="date"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                    placeholder="过期时间">
                  </el-date-picker>
              </el-form-item>
          </el-form>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTheNewDialog = false">取 消</el-button>
       <el-button type="primary" :loading="loadingBootm" @click="itemEditDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findVehicleChannelPrice , delVehicleChannelPriceById , modifyVehicleChannelPrice , saveVehicleChannelPrice } from '@/api/channelPrice'
import { findYuyueCityByProvinceid , findYuyueAreasByCityid , findYuyueProvinces } from '@/api/nodeList'  // 省市区接口
import  { findCarwashType, findCarwashsTypeById } from '@/api/volumeList' // 服务项接口
import { findChannelName } from '@/api/volumeList'
import Pagination from "@/components/Pagination"
export default {
  components: {
    Pagination
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      disabledCity: false,
      editDialog: false,
      loadingBootm: false,
      dialogTitle: "查看",
      loading: false,
      editTheNewDialog: false,
      statusInfoList: [],
      areaJson: [],
      cityListJson: [],
      regionListJson: [],
      cityList: [],
      countyList: [],
      itemArr: [],
      menuList: [],
      menu2List: [],
      itemObj: {
        wholeCity: false
      },
      rules: {
          channelId: [
            { required: true, message: '请选择渠道', trigger: 'blur' }
          ],
          // originalPrice: [
          //   { required: true, message: '请输入原价', trigger: 'blur' },
          //   { pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message: '输入格式有误', trigger: 'blur' }
          // ],
          price: [
              { required: true, message: '请输入金额', trigger: 'blur' },
              { pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message: '输入格式有误', trigger: 'blur' }
          ],
          fromTime: [
              { required: true, message: '请选择有效时间', trigger: 'blur' }
          ],
          toTime: [
              { required: true, message: '请选择过期时间', trigger: 'blur' }
          ],
          provinceid: [
              { required: true, message: '请选择省份', trigger: 'blur' }
          ],
          cityid: [
              { required: true, message: '请选择城市', trigger: 'blur' }
          ],
          areaid: [
              { required: true, message: '请选择区/县', trigger: 'blur' }
          ],
          carwashId: [
            { required: true, message: '请选择服务类型', trigger: 'blur' }
          ],
          carwashsId: [
            { required: true, message: '请选择服务名称', trigger: 'blur' }
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
        province: null,
        city: null,
        region: null,
        name: null,
      }
    }
  },
  created() {
    this.getData()
    // 省市区
    this.ApiAreaJson()
    // 服务商
    this.selectInfo()
  },
  methods: {
    changeT(){
      this.$forceUpdate()
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
    menuTwoList2(num,bl){
      findCarwashsTypeById({carwashId: this.itemObj.carwashId}).then(res=>{
        if(res.code == 200){
          this.menu2List = res.data
          if(num){
            if(bl){
              // 编辑初始化数据
              this.itemObj.carwashsId = this.itemObj.carwashsId
            }else{
              this.itemObj.carwashsId = this.menu2List[0].ids
            }
          }
        }else{
          this.$message("服务器数据格出了小问题哦！")
        }
      })
    },
    async selectInfo(){
      var res = await findChannelName()
      this.statusInfoList = res.data
    },
    itemEditDialog(){
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            if(this.itemObj.wholeCity){
              this.itemObj.wholeCity = 1
            }else{
              this.itemObj.wholeCity = 0
            }
           if(this.itemObj.id){
               modifyVehicleChannelPrice(this.itemObj).then(res=>{
                   if(res.code == 200){
                       this.editTheNewDialog = false
                       this.$message({
                           message: '修改成功！',
                           type: 'success'
                       })
                   }else{
                       this.$message(res.msg)
                   }
               })
           }else{
               saveVehicleChannelPrice(this.itemObj).then(res=>{
                   if(res.code == 200){
                       this.editTheNewDialog = false
                       this.$message({
                           message: '修改成功！',
                           type: 'success'
                       })
                   }else{
                       this.$message(res.msg)
                   }
               })
           }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    ApiAreaJson(){
      findYuyueProvinces().then(res=>{
        this.areaJson = res.data
      })
    },
    regionChange(){
        this.$forceUpdate()
    },
    changeCity(id,num){
      findYuyueCityByProvinceid({provinceid: id}).then(res=>{
        this.cityList = res.data
        if(num === 1){
            // 编辑数据初始化
           findYuyueAreasByCityid({cityid: this.itemObj.cityid}).then(res=>{
                this.countyList = res.data
           })  
        }else{
            this.itemObj.cityid = this.cityList[0].cityid
            this.changeCounty(this.itemObj.cityid)
        }
      })
    },
    changeCounty(id){
      findYuyueAreasByCityid({cityid: id}).then(res=>{
        this.countyList = res.data
        this.itemObj.areaid = this.countyList[0].areaid
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
          delVehicleChannelPriceById({ids: id}).then(res=>{
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
      if (!(queryList.province == null)) {
        data.provinceid = queryList.province
      }
      if (!(queryList.city == null)) {
        data.cityid = queryList.city
      }
      if (!(queryList.region == null)) {
        data.areaid = queryList.region
      }
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
      findVehicleChannelPrice(data).then(res=>{
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
            
          })
        }
      })
    },
    lookOver(item){
      this.itemObj = item
      this.editDialog = true
      this.dialogTitle = "查看"
    },
    editTheNew(item){
        this.dialogTitle = "编辑"
        this.editTheNewDialog = true
        this.itemObj = item
        this.itemObj.channelId = Number(item.channelId)
        this.changeCity(item.provinceid,1)
        this.itemObj.wholeCity = false
        this.itemObj.carwashsId = Number(item.carwashsId)
        this.itemObj.carwashId = Number(item.carwashId)
        this.menuTwoList2(this.itemObj.carwashId,true)
        this.disabledCity = true
        this.apiFindCarwashType()
        this.$forceUpdate()
    },
    changeBox(){
      this.$forceUpdate()
    },
    newly(){
        this.dialogTitle = "新增"
        this.editTheNewDialog = true
        this.apiFindCarwashType()
    },
    close(){
      this.itemObj = {
        wholeCity: false
      }
      this.getData()
      this.disabledCity = false
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    reset(){
      this.queryList = {
        province: null,
        city: null,
        region: null,
        name: null,
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
