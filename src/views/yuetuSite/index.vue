<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.stationName"
          placeholder="请输入车站名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.province"
          placeholder="请输入省份"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.city"
          placeholder="请输入所在市"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.type" @change="getData" class="input fl" placeholder="请选择类型">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.type"
              :key="item.type"
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
      <el-table-column label="车站ID" prop="stationId" fixed align="center" width="90px">
        <template slot-scope="scope">
          <span>{{ scope.row.stationId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车站名称" prop="stationName" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stationName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厅总数" prop="hallCount" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.hallCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在省" prop="province" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所在市" prop="city" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeCopy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="compile(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button>
          <el-button size="mini" type="success" class="btnCa" @click="look(scope.row)">查看大厅</el-button>
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
      width="60%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="车站名称：" prop="stationName" style="width: 100%">
                  <el-input v-model="itemObj.stationName" style="width:50%" placeholder="请输入车站名称"></el-input>
              </el-form-item>
              <el-form-item label="省份：">
                  <el-select v-model="itemObj.provinceId" placeholder="请选择省份" filterable @change="prCityList">
                    <el-option v-for="value in provinceList" :key="value.id" :label="value.province" :value="value.provinceid"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="城市：">
                  <el-select v-model="itemObj.cityId" placeholder="请选择城市" filterable @change="itemCityList">
                    <el-option v-for="value in cityList" :key="value.id" :label="value.city" :value="value.cityid"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="类型：" prop="type" style="width: 100%">
                <el-radio-group v-model="itemObj.type">
                  <el-radio label="1">高铁火车站</el-radio>
                  <el-radio label="2">国内机场</el-radio>
                  <el-radio label="3">国际/中国港澳台</el-radio>
                </el-radio-group>
              </el-form-item>
          </el-form>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
       <el-button type="primary" :loading="loadingBootm" @click="itemEditDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 大厅 -->
    <!-- <lobby :text="text" :visibleLobby.sync="visibleLobby"></lobby> -->
    <el-dialog
      :title="text"
      :visible.sync="visibleLobby"
      :close-on-click-modal="false"
      width="80%"
      @close="close2"
      center>
      <el-dialog
        width="70%"
        :title="textInner"
        :visible.sync="innerVisible"
        :close-on-click-modal="false"
         @close="close3"
        append-to-body
        center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <el-form label-position="right" ref="lobby" :rules="rules2" label-width="150px" :model="lobbyObj" class="clearFix">
                <el-form-item label="大厅名称：" prop="hallName" style="width: 100%">
                    <el-input v-model="lobbyObj.hallName" style="width:50%" placeholder="请输入大厅名称"></el-input>
                </el-form-item>
                <!-- <el-form-item label="门头名称：" prop="hallName" style="width: 100%">
                    <el-input v-model="lobbyObj.hallName" style="width:50%" placeholder="请输入门头名称"></el-input>
                </el-form-item> -->
                <el-form-item label="营业时间：" prop="businessHours" style="width: 100%">
                    <el-time-picker
                      @change="businessHours"
                      is-range
                      v-model="lobbyObj.businessHours"
                      format="HH:mm"
                      value-format="HH:mm"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      placeholder="选择时间范围">
                    </el-time-picker>
                </el-form-item>
                <el-form-item label="客服电话：" prop="servicePhone" style="width: 100%">
                    <el-input v-model="lobbyObj.servicePhone" style="width:50%" placeholder="请输入客服电话"></el-input>
                </el-form-item>
                <el-form-item label="大厅地址：" prop="hallLocation" style="width: 100%">
                    <el-input v-model="lobbyObj.hallLocation" style="width:50%" placeholder="请输入大厅地址"></el-input>
                </el-form-item>
                <el-form-item label="营业状态：" prop="hallStatus" style="width: 100%">
                  <el-radio-group v-model="lobbyObj.hallStatus">
                    <el-radio label="1">正常</el-radio>
                    <el-radio label="2">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="产品图片：" style="width: 100%">
                  <el-upload
                    action=""
                    :auto-upload="false"
                    :show-file-list="false"
                    list-type="picture-card"
                    :on-change="handleChange">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <el-button size="mini" type="danger" @click="imageUrl = ''" style="margin-left: 45px;">删除</el-button>
              </el-form-item>
            </el-form>
        </div>
        <el-divider content-position="left"><span class="title">服务项</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          <div class="img_list">
              <el-checkbox-group v-model="checkList">
                <el-checkbox :label="item.serviceId" v-for="(item,index) in imgList" :key="index"><div class="imgbox"><img class="img" :src="item.serviceIcon" alt=""><span class="span">{{item.serviceName}}</span></div></el-checkbox>
              </el-checkbox-group>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loadingBtn" @click="lobbyDialog">确 定</el-button>
        </span>
      </el-dialog>
       <div class="btn_box" style="margin-bottom:10px;">
           <div></div>
           <el-button type="primary" @click="newlyDivider">新增</el-button>
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
            <el-table-column label="大厅图片" prop="hallPic" align="center">
              <template slot-scope="scope">
                <img :src="scope.row.hallPic" alt="" style="height:75px;">
              </template>
            </el-table-column>
            <el-table-column label="大厅名称" prop="hallName" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.hallName }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="门头名称" prop="hallName" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.hallName }}</span>
              </template>
            </el-table-column> -->
            <el-table-column label="营业时间" prop="businessHours" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.businessHours }}</span>
              </template>
            </el-table-column>
            <el-table-column label="客服电话" prop="servicePhone" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.servicePhone }}</span>
              </template>
            </el-table-column>
            <el-table-column label="大厅地址" prop="hallLocation" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.hallLocation }}</span>
              </template>
            </el-table-column>
            <el-table-column label="修改时间" prop="updateTime" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="营业状态" prop="hallStatus" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.hallStatus==1? "正在营业": "已停业" }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" prop="audit_status" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="lobbyCompile(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="lobbyRemove(scope.row)">删除</el-button>
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
import { listStationsNameInfos , delStationsNameInfo , findYuyueProvinces , findYuyueCityByProvinceid , updateYuyueStationInfo , saveYuyueStationInfo , findStationsByIds , delYuyueStations , findHallService , updateYuyueStations , saveYuyueStations } from '@/api/guest/yuetuSite'
import { dotOssUpload } from '@/api/nodeList'
import Pagination from "@/components/Pagination"
import lobby from "@/components/yuetuLobby"
export default {
  components: {
    Pagination,
    lobby
  },
  watch:{
    // 监听数据的变化输出 newV 改变的值，oldV 改变之前的值
    // visibleLobby(newV,oldV){
    //   // console.log(newV,oldV);
    // },
  },
  data() {
    return {
      loadingBtn: false,
      imageUrl: "",
      lobbyObj: {},
      textInner: "",
      innerVisible: false,
      stationId: null,
      dialogLoading: false,
      lobbyData:{
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      visibleLobby: false,
      text: "",
      dialogTitle: "",
      loadingBootm: false,
      editDialog: false,
      loading: false,
      newly: false,
      checkList: [],
      imgList: [],
      itemArr: [],
      itemObj: {},
      rules: {
          username: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
      },
      rules2: {
          businessHours: [
            { required: true, message: '请选择营业时间', trigger: 'blur'}
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
        stationName: null,
        province: null,
        city: null,
        type: null
      },
      statusList: [
        {
          name: "高铁火车站",
          type: 1
        },
        {
          name: "国内机场",
          type: 2
        },
        {
          name: "国际/中国港澳台",
          type: 3
        }
      ],
      provinceList: [],
      cityList: [],
      newlyData: false
    }
  },
  created() {
    this.getData()
    this.apiProvince()
  },
  methods: {
    itemCityList(){
      this.$forceUpdate()
    },
    newlyDivider(){
      this.innerVisible = true
      this.lobbyObj = {}
      this.checkList = []
      this.textInner = "新增大厅"
      this.imageUrl = ""
      findHallService().then(res=>{
        this.imgList = res.data
      })
      this.newlyData = true
    },
    businessHours(date){
    },
    close2(){
      this.getData()
    },
    close3(){
      this.getList()
      this.lobbyObj = {}
      this.checkList = []
      this.newlyData = false
      this.imageUrl = ""
    },
    lobbyDialog(){
        var obj = this.lobbyObj
        obj.hallPic = this.imageUrl
        obj.serviceIds = this.checkList
        if(obj.businessHours && obj.businessHours[0] && obj.businessHours[1]){
          obj.businessHours = obj.businessHours[0] + "-" +  obj.businessHours[1]
        }
      if(this.newlyData){
        obj.stationId = this.stationId
        saveYuyueStations(obj).then(res=>{
          if(res.code == 200){
              this.$message({
                  type: 'success',
                  message: '操作成功!'
              })
              this.getList()
              this.innerVisible = false
            }else{
              this.$message({
                  type: 'info',
                  message: res.msg
              })
            }
        })
      }else{
        updateYuyueStations(obj).then(res=>{
          if(res.code == 200){
              this.$message({
                  type: 'success',
                  message: '操作成功!'
              })
              this.getList()
              this.innerVisible = false
            }else{
              this.$message({
                  type: 'info',
                  message: res.msg
              })
            }
        })
      }
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
    lobbyCompile(item){
      this.innerVisible = true
      this.textInner = item.hallName
      if(item.hallPic){
        this.imageUrl = item.hallPic
      }
      if(item.businessHours.indexOf("-") == -1){

      }else{
         var a = item.businessHours.split("-")
         item.businessHours = a
      }
      this.lobbyObj = item
      var arr = []
      if(item.services){
        item.services.forEach(v=>{
          arr.push(v.serviceId)
        })
      }
      this.checkList = arr 
      findHallService().then(res=>{
        this.imgList = res.data
      })
    },
    lobbyRemove(item){
      this.lobbyOpen("确定删除该大厅？" , item.hallId)
    },
    lobbyOpen(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogLoading = true
          delYuyueStations({hallId: id}).then(res=>{
            if(res.code == 200){
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getList()
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
    look(item){
      this.stationId = item.stationId
      this.text = item.stationName + "大厅信息"
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
      data.pageNum = this.lobbyData.current_page
      data.pageSize = this.lobbyData.per_page
      data.stationId = this.stationId
      findStationsByIds(data).then(res=>{
         this.dialogLoading = false;
        if (!res.data || res.data.length <= 0) {
          this.$message("暂无数据~")
          this.lobbyData.data = []
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
    compile(item){
      this.editDialog = true
      this.itemObj = item
      if(item.provinceId){
        this.apiCity(item.provinceId)
      }
    },
    newlyIncreased(){
      this.editDialog = true
    },
    async apiProvince(){
      var res = await findYuyueProvinces()
      this.provinceList = res.data
    },
    prCityList(data){
      this.apiCity(data,1)
    },
    async apiCity(provinceid,change){
      var res = await findYuyueCityByProvinceid({provinceid})
      this.cityList = res.data
      if(change){
         this.itemObj.cityId = res.data[0].cityid
      }
    },
    itemEditDialog(){
      if(this.itemObj.stationId){
        delete this.itemObj.createTime
        delete this.itemObj.hallCount
        delete this.itemObj.typeCopy
        this.itemObj.id = this.itemObj.stationId
        delete this.itemObj.stationId
        updateYuyueStationInfo(this.itemObj).then(res=>{
          if(res.code == 200){
            this.$message({
                type: 'success',
                message: '操作成功!'
            })
            this.getData()
            this.editDialog = false
          }else{
            this.$message({
                type: 'info',
                message: res.msg
            })
          }
        })
      }else{
        saveYuyueStationInfo(this.itemObj).then(res=>{
          if(res.code == 200){
            this.$message({
                type: 'success',
                message: '操作成功!'
            })
            this.getData()
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
          arr.push(v.stationId)
        })
        this.open('确定批量删除？' , arr)
      }else{
        this.open('确定删除？' , [item.stationId])
      }
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          delStationsNameInfo({ids: id}).then(res=>{
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
      if (queryList.stationName) {
        data.stationName = queryList.stationName
      }
      if (queryList.province) {
        data.province = queryList.province
      }
      if (queryList.city) {
        data.city = queryList.city
      }
      if(!(queryList.type == null)){
        data.type = queryList.type
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      listStationsNameInfos(data).then(res=>{
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
            if(v.type == 1){
              v.typeCopy = "高铁火车站"
            }else if(v.type == 2){
              v.typeCopy = "国内机场"
            }else if(v.type == 3){
              v.typeCopy = "国际/中国港澳台"
            }
          })
        }
      })
    },
    close(){
      this.itemObj = {}
      this.getData()
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    getPageData2(e) {
      this.getList("page");
    },
    reset(){
      this.queryList = {
        stationName: null,
        province: null,
        city: null,
        type: null
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
.img_list{
  padding: 10px;
  /deep/.el-checkbox__input{
    position: absolute;
    bottom: 0;
    left: 5px;
  }
  .imgbox{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
    margin-top: 15px;
    .span{
      margin-left: 10px;
    }
    .img{
      width: 90px;
      height: 90px;
      border-radius: 4px;
    }
  }
}
.itemTable{
  width: 100%;
  // /deep/.el-table{
  //   width: 100%;
  // }
}
.btnCa{
  width: 80%;
  margin-top: 8px;
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
