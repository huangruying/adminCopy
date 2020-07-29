<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.name"
          placeholder="请输入产品名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-select v-model="queryList.isPay" @change="getData" class="input fl" placeholder="是否需要支付">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.examine" @change="getData" class="input fl" placeholder="审核是否通过">
            <el-option
              v-for="item in auditList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
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
      <el-table-column label="产品id" prop="id" fixed align="center" width="80PX">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品图片" prop="picfilepath" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.picfilepath" alt="" style="height: 55px; width: 82px;">
        </template>
      </el-table-column>
      <el-table-column label="产品名称" prop="name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品简介" prop="desc" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="price" align="center" width="80PX">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否需要支付" prop="isPay" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.isPay == 0? '需支付' : '不需支付' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="dateline" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dateline }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="updatetime" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="置顶时间" prop="topdateline" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.topdateline }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="渠道" prop="channels" align="center">
        <template slot-scope="scope">
          <div v-for="(ditch,idx) in scope.row.channels" :key="idx">{{ditch.channelName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="组合" prop="combinations" align="center">
        <template slot-scope="scope">
          <div v-for="(items,ids) in scope.row.combinations" :key="ids">{{items}}</div>
        </template>
      </el-table-column>
      <el-table-column label="审核是否通过" prop="examine" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.examine == 0 ? "未审核" : "已通过" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <div style="width: 100%;margin-bottom: 7px;" v-if="scope.row.examine == 0"><el-button size="mini" type="success" @click="audit(scope.row)">审核通过</el-button></div>
          <div style="width: 100%;margin-bottom: 7px;"><el-button size="mini" type="primary" @click="item(scope.row)">编辑</el-button></div>
          <div style="width: 100%;"><el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button></div>
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
      :visible.sync="editDialog"
      width="80%"
      :close-on-click-modal="false"
      @close="close"
      center>
      <div class="btn_top">
        <div class="btn" :class="btnss == 1? 'click' : ''" @click="btn(1)">基本内容</div>
        <div class="btns" :class="btnss == 2? 'click' : ''" @click="btn(2)">权益介绍</div>
      </div>
      <div>
        <!-- 基本内容 -->
        <el-divider content-position="left" v-if="btnss == 1"><span class="title">基本内容</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;" v-if="btnss == 1">
          <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
              <el-form-item label="产品名称：" prop="name" style="width: 100%">
                  <el-input v-model="itemObj.name" style="width:50%" placeholder="请输入产品名称"></el-input>
              </el-form-item>
              <el-form-item label="产品价格：" prop="price" style="width: 100%">
                  <el-input v-model="itemObj.price" style="width:50%" placeholder="请输入产品价格"></el-input>
              </el-form-item>
              <el-form-item label="产品简介：" prop="desc" style="width: 100%">
                  <el-input v-model="itemObj.desc" style="width:50%" placeholder="请输入产品简介"></el-input>
              </el-form-item>
              <el-form-item label="所属渠道商：" prop="desc" style="width: 100%">
                <el-select v-model="itemObj.channelids" filterable multiple placeholder="请选择所属渠道商" style="width: 50%" @change="changeID">
                  <el-option
                    v-for="item in channelList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="对应产品：" prop="desc" style="width: 100%">
                <el-cascader v-model="valueList" :options="infoList" filterable :props="props" style="width: 50%" @change="changeInfo" placeholder="请选择对应产品及所属数量">
                  <template slot-scope="{ node, data }">
                    <div class="item_box">
                      <span>{{ data.label }}</span>
                      <div style="color: #8492a6; font-size: 13px;padding-left: 13px">
                        <el-input-number v-model="data.num" :min="1" :max="100" label="描述文字" @change="numChange" step-strictly></el-input-number>
                      </div>
                    </div>
                  </template>
                </el-cascader>
              </el-form-item>
              <el-form-item label="是否需要支付：" style="width: 100%">
                <el-radio-group v-model="itemObj.isPay">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="服务项：" style="width: 100%">
                <div class="img_list">
                    <el-checkbox-group v-model="checkList">
                      <el-checkbox :label="item.serviceId" v-for="(item,index) in imgList" :key="index">
                        <div class="imgbox">
                          <img class="img" :src="item.serviceIcon" alt="">
                          <span class="span">{{item.serviceName}}</span>
                        </div>
                      </el-checkbox>
                    </el-checkbox-group>
                </div>
              </el-form-item>
              <el-form-item label="产品图片：" style="width: 100%">
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
              <el-form-item label="产品介绍：">
                <div class="editorBox">
                    <!-- 调用富文本编辑器 -->
                    <quill-editor ref="myText" v-model="itemObj.content" :config='editorOption' class="editor">
                    </quill-editor>
                      <!-- <quill-editor v-model="content"
                        :options="editorOption"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)">
                      </quill-editor> -->
                </div>
              </el-form-item>
          </el-form>
        </div>
        <!-- 权益介绍 -->
        <el-divider content-position="left" v-if="btnss == 2"><span class="title">权益介绍</span></el-divider>
         <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;" v-if="btnss == 2">
           <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
             <el-form-item label="权益简介：">
                <div class="editorBox">
                    <!-- 调用富文本编辑器 -->
                    <quill-editor ref="myText2" v-model="itemObj.equityBrief" :config='editorOption' class="editor">
                    </quill-editor>
                </div>
              </el-form-item>
              <el-form-item label="权益内容：">
                <div class="editorBox">
                    <!-- 调用富文本编辑器 -->
                    <quill-editor ref="myText3" v-model="itemObj.equity" :config='editorOption' class="editor">
                    </quill-editor>
                </div>
              </el-form-item>
           </el-form>
         </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBootm" @click="itemEditDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findYuyueProductInfo , deleteYuyueProduct , getChannelName , findIproductInfos , updateYuyueProductInfo , saveYuyueProduct , getYyProductById , updateExamine } from '@/api/guest/ditchProduct'
import { dotOssUpload , findHallServiceInfos } from '@/api/nodeList'
import Pagination from "@/components/Pagination"
import formatTime from "@/utils/formatTime"
// import VueQuillEditor from 'vue-quill-editor'
// import ImageResize from 'quill-image-resize-module'
// Quill.register('modules/imageResize', ImageResize)
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  components: {
    Pagination,
    quillEditor,
    // VueQuillEditor
  },
  computed: {
    // itemLabel(label,num){
    //   if(label.indexOf("/") == -1){
    //           label = label + "/" + num
    //   }else{
    //     var str = label.split('/') 
    //     label = str[0] + "/" + num
    //   }
    //   return label
    // }
  },
  data() {
    return {
      // equityBrief: "",
      // equity: "",
      valueList: "",
      itemID: "",
      imageUrl: "",
      fileList:[],
      number: "",
      props: { multiple: true },
      btnss: 1,
      // content: "", // 编辑器的内容
      editorOption: {
        placeholder: '请输入...',
        // 编辑器的配置
        // something config
        theme: "bubble"
      },
      dialogTitle: "",
      loadingBootm: false,
      loading: false,
      editDialog: false,
      itemObj: {},
      itemArr: [],
      rules: {
          username: [
            { required: true, message: '不能为空', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
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
        isPay: null,
        examine: null
      },
      statusList: [
        {
          name: '需支付',
          value: 0
        },
        {
          name: '不需支付',
          value: 1
        }
      ],
      auditList: [
        {
          name: '已通过',
          value: 1
        },
        {
          name: '未审核',
          value: 0
        }
      ],
      channelList: [],
      infoList: [],
      infoArr: [],
      checkList: [],
      imgList: [
        // {
        //   iconImg: require('@/assets/iconImg/1.png'),
        //   name: "高铁贵宾厅",
        //   explain: "无限次",
        //   id: 0
        // },
        // {
        //   iconImg: require('@/assets/iconImg/2.png'),
        //   name: "快捷进站",
        //   explain: "无限次",
        //   id: 1
        // },
        // {
        //   iconImg: require('@/assets/iconImg/3.png'),
        //   name: "携伴",
        //   explain: "12次",
        //   id: 2
        // },
        // {
        //   iconImg: require('@/assets/iconImg/4.png'),
        //   name: "智能按摩",
        //   explain: "无限次",
        //   id: 3
        // },
        // {
        //   iconImg: require('@/assets/iconImg/5.png'),
        //   name: "优先登车",
        //   explain: "无限次",
        //   id: 4
        // },
        // {
        //   iconImg: require('@/assets/iconImg/6.png'),
        //   name: "协助取票",
        //   explain: "无限次",
        //   id: 5
        // },
        // {
        //   iconImg: require('@/assets/iconImg/7.png'),
        //   name: "候车用餐12次",
        //   explain: "无限次",
        //   id: 6
        // },
        // {
        //   iconImg: require('@/assets/iconImg/8.png'),
        //   name: "机场贵宾厅",
        //   explain: "无限次",
        //   id: 7
        // },
        // // {
        // //   iconImg: require('@/assets/iconImg/9.png'),
        // //   name: "高铁贵宾厅",
        // //   explain: "无限次",
        // //   id: 8
        // // },
        // {
        //   iconImg: require('@/assets/iconImg/10.png'),
        //   name: "五星要客",
        //   explain: "1次",
        //   id: 9
        // },
        // {
        //   iconImg: require('@/assets/iconImg/11.png'),
        //   name: "商务会议",
        //   explain: "1次",
        //   id: 10
        // }
      ]
    }
  },
  mounted() {
    this.getData()
    this.apiGetChannelName()
    this.apiFindIproductInfos()
    this.smallIcon()
  },
  methods: {
    async smallIcon(){
      var res = await findHallServiceInfos()
      this.imgList = res.data
      // console.log(res);
    },
    changeID(){
      this.$forceUpdate()
    },
    audit(item){
      this.open2('确定审核通过？' , item.id)
    },
    open2(text,id) {
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateExamine({id}).then(res=>{
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
    newlyIncreased(){
      this.itemObj = {}
      this.editDialog = true
      this.dialogTitle = "新增"
      this.valueList = ""
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
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 4;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 或 png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 4MB!');
        }
        return isJPG && isLt2M;
    },
    changeInfo(item){
      var arr = []
      for(var i = 0; i<item.length; i++){
        arr[i] = item[i][0]
      }
      this.infoArr = arr
      this.infoList.forEach(v=>{
        for(var l = 0; l< this.infoArr.length; l++){
          if(v.value == this.infoArr[l]){
            if(v.label.indexOf("/") == -1){
              v.label = v.label + "/" + v.num
            }else{
              var str = v.label.split('/') 
              v.label = str[0] + "/" + v.num
            }
          }
        }
      })
    },
    numChange(){
        this.infoList.forEach(v=>{
          for(var l = 0; l< this.infoArr.length; l++){
            if(v.value == this.infoArr[l]){
              if(v.label.indexOf("/") == -1){
                v.label = v.label + "/" + v.num
              }else{
                var str = v.label.split('/') 
                v.label = str[0] + "/" + v.num
              }
            }
          }
        })
    },
    apiGetChannelName(){
      getChannelName().then(res=>{
        this.channelList = res.data
      })
    },
    apiFindIproductInfos(){
      findIproductInfos().then(res=>{
        res.data.map(v=>{
          v.value = v.id
          v.label = v.name
          v.num = 1
          delete v.id
          delete v.name
        })
        this.infoList = res.data
      })
    },
    btn(index){
      this.btnss = index
    },
    itemEditDialog(){
      this.loadingBootm = true
      var arr = []
      if(this.infoList.length > 0){
        this.infoList.forEach(v=>{
          for(var l = 0; l< this.infoArr.length; l++){
            if(this.infoArr[l] && v.value == this.infoArr[l]){
              arr.push(v)
            }
          }
        })
      }
      if(arr.length>0){
        arr.forEach(v=>{
          v.productid = v.value
          delete v.label
          delete v.value
        })
      }
      this.itemObj.picfilepath = this.imageUrl
      this.itemObj.productList = arr
      this.itemObj.serviceids = this.checkList
      // this.itemObj.content = this.content
      this.itemObj.pid = this.itemID
      delete this.itemObj.dateline
      delete this.itemObj.updatetime
      delete this.itemObj.topdateline
      delete this.itemObj.id
      // console.log(arr); // 对应产品数组
      // console.log(this.itemObj);
      if(this.itemID){
        updateYuyueProductInfo(this.itemObj).then(res=>{
          this.loadingBootm = false
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.editDialog = false
          }else{
            this.$message({
              type: 'error',
              message: res.data
            })
          }
        })
      }else{  
        saveYuyueProduct(this.itemObj).then(res=>{
          this.loadingBootm = false
          if(res.code == 200){
            this.$message({
              type: 'success',
              message: '操作成功！'
            })
            this.editDialog = false
          }else{
            this.$message({
              type: 'error',
              message: res.data
            })
          }
        })
      }
    },
    onEditorBlur(editor) {
          // console.log('editor blur!', editor)
        },
    onEditorFocus(editor) {
              // console.log('editor focus!', editor)
            },
    onEditorReady(editor) {
          // console.log('editor ready!', editor)
    },
    handleSelectionChange(val) {
        this.itemArr = val
    },
    open(text,id) {
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteYuyueProduct({productId: id}).then(res=>{
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
      if(!(queryList.isPay == null)){
        data.isPay = queryList.isPay
      }
      if(!(queryList.examine == null)){
        data.examine = queryList.examine
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1
      }
      // data.username = this.$store.state.user.name
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findYuyueProductInfo(data).then(res=>{
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
              if( v.updatetime){
                v.updatetime = formatTime(v.updatetime*1000,'yyyy-mm-dd hh:mm:ss')
              }
          })
        }
      })
    },
    item(item){
      this.imageUrl = item.picfilepath
      this.itemObj = item
      this.editDialog = true
      this.dialogTitle = "编辑"
      this.itemID = item.id
      var ListArr = []
      // console.log(item);
      if(item.services){
        item.services.forEach(v=>{
          ListArr.push(v.serviceId)
        })
        this.checkList = ListArr
      }
      getYyProductById({id: item.id}).then(res=>{
        var arr = []
        if(res.data.productList){
          res.data.productList.forEach(v=>{
            var arrNum = Number(v.productid)
            arr.push([v.productid])
            this.infoList.forEach(valueId=>{
                if(valueId.value == v.productid){
                  if(valueId.label.indexOf("/") == -1){
                    valueId.label = valueId.label + "/" + v.num
                    valueId.num = v.num
                  }else{
                    var str = valueId.label.split('/') 
                    valueId.label = str[0] + "/" + v.num
                  }
                }
            }) 
          })
        }
        var channelsArr = []
        if(res.data.channels){
          res.data.channels.forEach(v=>{
            var id = Number(v.channelId)
            channelsArr.push(id)
          })
        }
        this.itemObj.channelids = channelsArr
        this.valueList = arr 
        this.infoArr = arr
      })
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
    close(){
      this.itemObj = {}
      this.itemID = null
      this.imageUrl = ""
      this.loadingBootm = false
      this.apiFindIproductInfos()
      this.checkList = []
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
        name: null,
        isPay: null,
        examine: null
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
@import "../../styles/cascader.css";
.img_list{
  padding: 10px;
  /deep/.el-checkbox__input{
    position: absolute;
    bottom: 10px;
    left: 5px;
  }
  .imgbox{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
    margin-top: 15px;
    .explain{
      margin-left: 10px;
      color: #777;
      font-size: 12px;
      font-family: Microsoft YaHei;
    }
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
.item_box{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // /deep/.el-cascader-node{
  //   margin-top: 10px !important;
  // }
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
