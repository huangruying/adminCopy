<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.title"
          placeholder="请输入优惠券名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <!-- <el-date-picker
          class="picker fl"
            v-model="queryList.time"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
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
      <el-table-column label="劵码ID" prop="couponsId" align="center" width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.couponsId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠券名称" prop="title" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优惠金额" prop="price" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取人数" prop="number" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="领取次数" prop="frequency" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.frequency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余数量" prop="frequency" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.couponsNum - scope.row.frequency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间" prop="startdate" align="center" width="340px">
        <template slot-scope="scope">
          <span>{{ scope.row.startdate }}</span> &nbsp;&nbsp; ~ &nbsp;&nbsp; <span>{{ scope.row.enddate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="劵码量" prop="couponsNum" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.couponsNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="type" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type? "未过期": "已过期" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" prop="audit_status" width="210px" align="center">
        <template slot-scope="scope">
          <!-- 券码过期不能再编辑及生成券码 -->
          <div style="width: 50%;padding:0 0 7px 7px; float: left;"><el-button size="mini" type="primary" @click="compile(scope.row)" v-if="scope.row.type">编辑</el-button></div>
          <div style="width: 50%;padding:0 0 7px 0; float: left;"><el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button></div>
          <div style="width: 50%;padding:0 0 7px 7px; float: left;"><el-button size="mini" type="success" @click="audit(scope.row)" v-if="scope.row.type">生成券码</el-button></div>
          <div style="width: 50%;padding:0 0 7px 0; float: left;"><el-button size="mini" type="info" @click="look(scope.row)">查看券码</el-button></div>
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

    <!-- 新增编辑 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="editDialog"
      width="50%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="优惠劵名称：" prop="title" style="width: 100%">
                  <el-input v-model="itemObj.title" style="width:50%" placeholder="请输入优惠劵名称"></el-input>
              </el-form-item>
              <el-form-item label="优惠劵金额：" prop="price" style="width: 100%">
                  <el-input v-model="itemObj.price" style="width:50%" placeholder="请输入优惠劵金额" :disabled="disabledPrice" ></el-input>
              </el-form-item>
              <el-form-item :label="itemPicker" prop="couponMoney" style="width: 100%" v-show="!period">
                 <el-date-picker
                    style="width:50%"
                    v-model="itemObj.time"
                    type="daterange"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="有效期开始"
                    end-placeholder="有效期结束"
                    :picker-options="pickerOptions"
                    @blur="changePicker"
                  ></el-date-picker>
              </el-form-item>
              <el-form-item :label="itemPicker" prop="couponMoney" style="width: 100%" v-show="period">
                  <el-date-picker
                    v-model="itemObj.enddate"
                    type="datetime"
                    default-time="23:59:59"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions2"
                    placeholder="有效期结束">
                  </el-date-picker>
                  <!-- <div class="color_period">可以延长有效期，严禁缩短有效期!</div> -->
              </el-form-item>
              <el-form-item label="使用说明：" prop="content" style="width: 100%">
                  <el-input type="textarea" v-model="itemObj.content" autosize maxlength="300" show-word-limit style="width:50%" placeholder="请输入使用说明"></el-input>
              </el-form-item>
          </el-form>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
       <el-button type="primary" :loading="loadingBootm" @click="itemEditDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="lookEditDialog"
      width="83%"
      @close="close2"
      center>
      <el-divider content-position="left"><span class="title">查询</span></el-divider>
      <div class="query">
       <div class="input_box">
         <el-input
          v-model="dialogList.barcode"
          placeholder="请输入劵码号"
          class="input fl"
          @keyup.enter.native="look(item)"/>
          <el-input
          v-model="dialogList.username"
          placeholder="请输入领劵人"
          class="input fl"
          @keyup.enter.native="look(item)"/>
          <el-select v-model="dialogList.status" @change="look(item)" class="input fl" placeholder="请选择券码状态">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
       </div>
       <div class="btn_box">
         <div>
           <el-button type="danger" @click="dialogRemove(2)">批量删除</el-button>
           <el-button type="primary" @click="exportData(item)">导出券码</el-button>
           <el-button type="primary" icon="el-icon-search" @click="look(item)">搜索</el-button>
         </div>
         <div>
           <el-button type="primary" icon="el-icon-refresh" @click="resetGetData2(item)"></el-button>
         </div>
       </div>
      </div>
        <el-table
          v-loading="loading2"
          :data="dialog.data"
          border
          stripe
          fit
          @selection-change="handleSelectionChange2"
          style="width: 100%;">
          <el-table-column
            align="center"
            type="selection"
            width="50">
        </el-table-column>
          <el-table-column label="劵码ID" prop="id" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="优惠劵名称" prop="title" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="劵码号" prop="barcode" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.barcode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="dateline" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.dateline }}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用时间" prop="usetime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.usetime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领取时间" prop="collectionTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.collectionTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领劵人" prop="username" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" prop="" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" @click="dialogRemove(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="dialog.total>0"
          :total="dialog.total"
          :page.sync="dialog.current_page"
          :limit.sync="dialog.per_page"
          @pagination="getPageData2"
        />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookEditDialog = false">返回列表</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findYuyueCoupons , deleteYuyueCouponsById , saveYuyueCoupons , updateYuyueCoupons , saveYuyueCouponscode , getYuyueCouponscodeByCid , deleteYuyueCouponscode } from '@/api/guest/marketingList'
import Pagination from "@/components/Pagination"
import formatTime from "@/utils/formatTime"
import { baseUrl } from '@/utils/baseUrl'
export default {
  components: {
    Pagination
  },
  data() {
    const dar = this
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      pickerOptions2: {
         // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate(time) {
          return time.getTime() < new Date(dar.enddate).getTime();
        }
      },
      itemPicker: "有效期：",
      dialogTitle: "",
      disabledPrice: true,
      loadingBootm: false,
      editDialog: false,
      lookEditDialog: false,
      loading: false,
      loading2: false,
      period: false,
      itemArr: [],
      itemArr2: [],
      itemObj: {
        time:[]
      },
      enddate: "",
      item: {},
      rules: {
          username: [
            { required: true, message: '不能为空', trigger: 'blur' }
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
      dialog: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      queryList: {
        title: null ,
        // time: ["" , ""]
      },
      dialogList: {
        barcode: null,
        status: null,
        username: null
      },
      statusList: [
        {
          name: "未领取",
          id: 0
        },
        {
          name: "未使用",
          id: 1
        },
        {
          name: "已使用",
          id: 2
        },
        {
          name: "已过期",
          id: 3
        },
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    changePicker(){
      this.$forceUpdate()
    },
    exportData(item){
      if(this.dialog.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var { barcode , status , username } = this.dialogList
          window.location.href = `${baseUrl}/wash/coupon/exportYuyueCouponscode?cid=${item.couponsId}&barcode=${barcode}&username=${username}&status=${status}`
      }
    },
    look(item,filter){
      this.loading2 = true
      this.lookEditDialog = true
      this.item = item
      var data = {}
      data.cid = item.couponsId
      if (filter && this.dialog.current_page > 1) {
        data.page = this.dialog.current_page;
      } else {
        this.data.current_page = 1;
      }
      if(this.dialogList.barcode){
        data.barcode = this.dialogList.barcode
      }
      if(this.dialogList.username){
        data.username = this.dialogList.username
      }
      if(!(this.dialogList.status == null)){
        data.status = this.dialogList.status
      }
      data.pageNum = this.dialog.current_page
      data.pageSize = this.dialog.per_page
      getYuyueCouponscodeByCid(data).then(res=>{
         this.loading2 = false;
        if (!res.data || res.data.length <= 0) {
          this.$message("暂无数据~")
          this.dialog = {
              current_page: 1,
              data: [],
              last_page: 1,
              per_page: 10,
              total: 0,
              link: ""
         }
        }
        if( res.data && res.data.length > 0){
          // console.log(res);
          this.dialog = res;
          this.dialog.current_page = res.pageNum
          this.dialog.per_page = res.pageSize
          this.dialog.total = res.total
          this.dialog.data.forEach(v=>{
              if(v.status == 0){
                v.status = "未领取"
              }else if(v.status == 1){
                v.status = "未使用"
              }else if(v.status == 2){
                v.status = "已使用"
              }else if(v.status == 3){
                v.status = "已过期"
              }
          })
        }
      })
    },
    aa(total){
      return total.toString().replace(/\B(?=(\d{3})+$)/g,',');
    },
    audit(item){
      this.open2('优惠券名称 ：  ' + item.title , item.couponsId)
    },
    open2(text,id) {
        this.$prompt(text, '确定生成券码？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入生成券码数量',
          inputPattern:  /^([1-9]\d{0,3}|10000)$/,
          inputErrorMessage: '请输入1到10000之间的整数！',
          type: 'warning'
        }).then(({ value }) => {
          saveYuyueCouponscode({cid: id,num: value}).then(res=>{
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
    compile(item){
      this.itemPicker = "有效期结束："
      this.editDialog = true
      this.disabledPrice = true
      this.period = true
      this.itemObj = item
      this.itemObj.time = [item.startdate , item.enddate]
      this.enddate = item.enddate
    },
    newlyIncreased(){
      this.itemPicker = "有效期："
      this.editDialog = true
      this.period = false
      this.disabledPrice = false
    },
    itemEditDialog(){
        var data = {}
        data.title = this.itemObj.title
        data.price = this.itemObj.price
        data.content = this.itemObj.content
      if(this.itemObj.couponsId){
        data.startdate = this.itemObj.startdate
        data.enddate = this.itemObj.enddate
        data.id = this.itemObj.couponsId
        // console.log(data);
        updateYuyueCoupons(data).then(res=>{
          if(res.code == 200){
            this.$message({
                type: 'success',
                message: '操作成功!'
            })
            this.editDialog = false
          }else{
            this.$message({
                type: 'info',
                message: res.msg
            })
          }
        })
      }else{
        data.uid = 1
        if(this.itemObj.time[0] && this.itemObj.time[1]) {
          data.startdate = this.itemObj.time[0]
          data.enddate = this.itemObj.time[1]
        }
        saveYuyueCoupons(data).then(res=>{
          if(res.code == 200){
            this.$message({
                type: 'success',
                message: '操作成功!'
            })
            this.editDialog = false
          }else{
            this.$message({
                type: 'info',
                message: res.msg
            })
          }
        })
      }
      
    },
    handleSelectionChange(val) {
        this.itemArr = val
    },
    handleSelectionChange2(val){
       this.itemArr2 = val
    },
    dialogRemove(item){
      if(item === 2){
        if(this.itemArr2.length == 0){
          this.$message({
            type: 'info',
            message: '请选择数据！'
          })
          return
        }
        var arr = []
        this.itemArr2.forEach(v=>{
          arr.push(v.id)
        })
        this.open3('确定批量删除？' , arr)
      }else{
        this.open3('确定删除？' , [item.id])
      }
    },
    open3(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading2 = true
          deleteYuyueCouponscode({ids: id}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.look(this.item)
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
          arr.push(v.couponsId)
        })
        this.open('确定批量删除？' , arr)
      }else{
        this.open('确定删除？' , [item.couponsId])
      }
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          deleteYuyueCouponsById({ids: id}).then(res=>{
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
      if (queryList.title) {
        data.title = queryList.title
      }
      // if (queryList.time[0] && queryList.time[1]) {
      //   data.startTime = queryList.time[0]
      //   data.endTime = queryList.time[1]
      // }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findYuyueCoupons(data).then(res=>{
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
              if( v.startdate && v.startdate != 0){
                v.startdate = formatTime(v.startdate*1000,'yyyy-mm-dd hh:mm:ss')
              }else{
                v.startdate = ""
              }
              if( v.enddate && v.enddate != 0 ){
                v.enddate = formatTime(v.enddate*1000,'yyyy-mm-dd hh:mm:ss')
                var blDate = this.isThreeHourAgo(v.enddate)
                if(!blDate){
                  v.type = true
                }else{
                  v.type = false
                }
              }else{
                v.enddate = ""
              }
          })
        }
      })
    },
    // 比较是否超过当前时间，后台懒得做，严格上讲时间戳在后台生成是比较好的
    isThreeHourAgo(time) {
      const now = Date.now()
      const d = new Date(time)
      const secDiff = (now - d) / 1000
      return secDiff > 3 * 60 * 60
    },
    //获取当前时间
    FormatDate () {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth();
        var date = now.getDate();
        month = month + 1;
        if (month < 10){
          month = "0" + month;
        }
        if (date < 10) {
          date = "0" + date;
        }
        var time = year + "-" + month + "-" + date
        return time;
    },
    close(){
      this.itemObj = {}
      this.getData()
      this.enddate = ""
    },
    close2(){
      
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    getPageData2(e) {
      this.look( this.item , "page" )
    },
    reset(){
      this.queryList = {
        name: null,
        time: ["" , ""]
      }
    },
    resetGetData(){
      this.reset()
      this.getData()
    },
    resetGetData2(item){
      this.dialogList.barcode = null
      this.dialogList.status = null
      this.look(item)
    },
  }
}
</script>

<style lang="less" scoped>
.color_period{
  color: #f00;
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
