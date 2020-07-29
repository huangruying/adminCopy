<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <!-- <el-input
          v-model="queryList.couponName"
          placeholder="请输入券码名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/> -->
          <!-- <el-input
          v-model="queryList.alias"
          placeholder="请输入别名"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.name"
          placeholder="请输入用户名"
          class="input fl"
          @keyup.enter.native="handleFilter"/> -->
          <!-- <el-select v-model="queryList.status" @change="getList" class="input fl" placeholder="状态">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select> -->
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
      @expand-change="expandChange"
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column type="expand" fixed label="点击展开" width="100px;">
        <template slot-scope="props">
            <el-table :data="props.row.data" border stripe style="width: 100%;" v-if="props.row.data.length > 0" v-loading="expandLoading">
              <el-table-column prop="couponName" label="券码名称" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.couponName }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="数据方式" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.type == 0? "生成": "导入" }}</span>
                </template>
              </el-table-column> 
              <el-table-column prop="num" label="数量" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.num }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="生成时间" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.createTime }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right" prop="" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" @click="lookInto(scope.row)">查 看</el-button>
                </template>
              </el-table-column>
            </el-table>
        </template>
      </el-table-column>
      <el-table-column label="券码名称" prop="couponName" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.couponName }}</span>
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
      <el-table-column label="使用说明" prop="content" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间" prop="failureTime" align="center" width="340px">
        <template slot-scope="scope">
          <span>{{ scope.row.effectTime }}</span> &nbsp;&nbsp; ~ &nbsp;&nbsp; <span>{{ scope.row.failureTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="type" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type? "未过期": "已过期" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <div style="width: 50%;padding:0 0 7px 7px; float: left;"><el-button size="mini" type="primary" @click="compile(scope.row)" v-if="scope.row.type">编辑</el-button></div>
          <div style="width: 50%;padding:0 0 7px 0; float: left;"><el-button size="mini" type="danger" @click="remove(scope.row)">删除</el-button></div>
          <div style="width: 50%;padding:0 0 7px 7px; float: left;"><el-button size="mini" type="success" @click="audit(scope.row)" v-if="scope.row.type">生成券码</el-button></div>
          <div style="width: 50%;padding:0 0 7px 0; float: left;"><el-button size="mini" type="info" @click="lookData(scope.row)">查看券码</el-button></div>
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
              <el-form-item label="券码名称：" prop="couponName" style="width: 100%" :rules="[{ required: true, message: '请输入券码名称', trigger: 'blur' }]" >
                  <el-input v-model="itemObj.couponName" style="width:50%" placeholder="请输入优惠劵名称"></el-input>
              </el-form-item>
              <el-form-item prop="channelId" label="渠道名称" :rules="[{ required: true, message: '请选择渠道名称', trigger: 'blur' }]" style="width: 100%">
                <el-select v-model="itemObj.channelId" placeholder="请选择渠道名称" style="width:50%">
                  <el-option
                    v-for="item in statusInfoList"
                    :label="item.name"
                    :value="item.id"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="carwashId" label="服务名称" :rules="[{ required: true, message: '请选择服务名称', trigger: 'blur' }]" style="width: 100%">
                <el-select v-model="itemObj.carwashId" @change="menuTwoList" placeholder="请选择服务名称" style="width:50%">
                  <el-option
                    v-for="item in menuList"
                    :label="item.dotType"
                    :value="item.id"
                    :key="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="carwashsId" label="服务内容" :rules="[{ required: true, message: '请选择服务内容', trigger: 'blur' }]" style="width: 100%">
                <el-select v-model="itemObj.carwashsId" placeholder="请选择服务内容" style="width:50%">
                  <el-option
                    v-for="item in menu2List"
                    :label="item.dotsType"
                    :value="item.ids"
                    :key="item.ids"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="优惠劵金额：" prop="couponMoney" style="width: 100%">
                  <el-input v-model="itemObj.couponMoney" style="width:50%" placeholder="请输入优惠劵金额" :disabled="disabledPrice" ></el-input>
              </el-form-item> -->
              <el-form-item :label="itemPicker" prop="time" style="width: 100%" v-if="!period" :rules="[{ type: 'array', required: true, message: '请选择时间', trigger: 'change' }]">
                 <el-date-picker
                    :key="'period2'"
                    style="width:50%"
                    v-model="itemObj.time"
                    type="daterange"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :default-time="['00:00:00', '23:59:59']"
                    range-separator="至"
                    start-placeholder="有效期开始"
                    end-placeholder="有效期结束"
                    @blur="changePicker"
                  ></el-date-picker>
              </el-form-item>
              <el-form-item :label="itemPicker" prop="failureTime" style="width: 100%" v-if="period" :rules="[{ required: true, message: '请选择时间', trigger: 'change' }]">
                  <el-date-picker
                    :key="'period'"
                    v-model="itemObj.failureTime"
                    type="datetime"
                    default-time="23:59:59"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions2"
                    placeholder="有效期结束">
                  </el-date-picker>
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
    <!-- 生成券码 -->
    <el-dialog
      title="确定生成券码?"
      :visible.sync="centerDialogVisible"
      width="30%"
      @close="closeVis"
      center>
      <div class="clearFix">
        <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
          <!-- <el-form-item prop="source" label="服务类型" :rules="[{ required: true, message: '请选择服务商', trigger: 'blur' }]">
            <el-select v-model="dynamicValidateForm.source" class="input fl" placeholder="请选择服务商">
              <el-option
                v-for="item in statusInfoList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="carwashId" label="服务类型" :rules="[{ required: true, message: '请选择服务类型', trigger: 'blur' }]">
            <el-select v-model="dynamicValidateForm.carwashId" @change="menuTwoList" class="input fl" placeholder="请选择服务类型">
              <el-option
                v-for="item in menuList"
                :label="item.dotType"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="carwashsId" label="服务名称" :rules="[{ required: true, message: '请选择服务名称', trigger: 'blur' }]">
            <el-select v-model="dynamicValidateForm.carwashsId" class="input fl" placeholder="请选择服务名称">
              <el-option
                v-for="item in menu2List"
                :label="item.dotsType"
                :value="item.ids"
                :key="item.ids"
              ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item prop="num" label="券码数量" :rules="[{ required: true, message: '请输入生成券码数量', trigger: 'blur' },{ pattern: /^[1-9]\d*|0$/, trigger: 'blur' , message: '请输入正整数'}]">
            <el-input
              type="number"
              placeholder="请输入生成券码数量"
              v-model.number="dynamicValidateForm.num"
              :max="10000"
              :min="0"
              class="inputNumber"
              @mousewheel.native.prevent
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getCouponCode">确 定</el-button>
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
          v-model="dialogList.code"
          placeholder="请输入劵码号"
          class="input fl"
          @keyup.enter.native="look(item)"/>
          <el-select v-model="dialogList.status" @change="look(item)" class="input fl" placeholder="请选择券码状态">
            <el-option
              v-for="item in statusList2"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
          <!-- <el-select v-model="dialogList.source" @change="look(item)" class="input fl" placeholder="请选择券码来源">
            <el-option
              v-for="item in statusList3"
              :label="item.name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select> -->
          <el-date-picker
            class="input fl"
            style="width:360px"
            v-model="dialogList.time"
            type="daterange"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="look(item)"
          ></el-date-picker>
       </div>
       <div class="btn_box">
         <div>
           <el-button type="danger" @click="dialogRemove(2)">批量删除</el-button>
           <el-button type="primary" @click="exportData2(item)">导出券码</el-button>
           <el-button type="primary" @click="importExcel">导入券码</el-button>
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
          <el-table-column label="劵码号" prop="code" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="服务类型" prop="carwashId" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.carwashId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="服务名称" prop="carwashsId" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.carwashsId }}</span>
            </template>
          </el-table-column>
          <el-table-column label="券码来源" prop="source" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.sourceCopy }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="领劵人" prop="name" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领劵人手机号" prop="phone" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="领取时间" prop="collectionTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.collectionTimeCopy }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="使用时间" prop="useTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useTimeCopy }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" prop="updateTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.updateTime }}</span>
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
    <!--上传文件的弹窗-->
    <el-dialog :visible.sync="uploaddialogVisible" :close-on-click-modal="false" title="导入数据" center>
      <!-- <div style="margin-bottom: 30px;">
        <el-select v-model="facilitatorId" class="input fl" placeholder="导入请选择服务商">
        <el-option
          v-for="item in statusInfoList"
          :label="item.name"
          :value="item.id"
          :key="item.id"
        ></el-option>
        </el-select>
        <el-select v-model="uploadCarwashId" @change="menuTwoList2" class="input fl" placeholder="请选择服务类型">
          <el-option
            v-for="item in menuList"
            :label="item.dotType"
            :value="item.id"
            :key="item.id"
          ></el-option>
        </el-select>
        <el-select v-model="uploadCarwashsId" class="input fl" placeholder="请选择服务名称">
          <el-option
            v-for="item in menu2List"
            :label="item.dotsType"
            :value="item.ids"
            :key="item.ids"
          ></el-option>
        </el-select>
      </div> -->
      <el-upload ref="upload" :auto-upload="false" :multiple="false" :on-change="handleChange" :on-remove="removeFile"
        :limit="1" action="" drag class="upload-demo">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadgoBack">返 回</el-button>
        <el-button type="primary" @click="submitImportExcel">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 详情导入查看 -->
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible.sync="lookIntoEditDialog"
      width="83%"
      @close="close3"
      center>
      <el-divider content-position="left"><span class="title">查询</span></el-divider>
      <div class="query">
       <div class="input_box">
       </div>
       <div class="btn_box">
         <div>
         </div>
         <div>
           <el-button type="primary" icon="el-icon-refresh" @click="resetGetData3(itemInto)"></el-button>
         </div>
       </div>
      </div>
        <el-table
          v-loading="loading3"
          :data="expandData.data"
          border
          stripe
          fit
          style="width: 100%;">
          <el-table-column label="劵码ID" prop="id" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column label="劵码号" prop="code" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领劵人" prop="name" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="领劵人手机号" prop="phone" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column label="使用时间" prop="useTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.useTimeCopy }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="修改时间" prop="updateTime" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="expandData.total>0"
          :total="expandData.total"
          :page.sync="expandData.current_page"
          :limit.sync="expandData.per_page"
          @pagination="getPageData3"
        />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="lookIntoEditDialog = false">返回列表</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { findGeneralCoupon , batchCouponcodeImport , findCompanyInfos , delGeneralCouponById , saveGeneralCoupon , modifyGeneralCouponById , findCarwashsTypeById, findCarwashType , generateGeneralCouponcode, finGeneralCouponcode , delGeneralCouponcodeById , findChannelName , findGeneralLogBygeneralId , findCodeDetailByLogId } from '@/api/volumeList'
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
            callback()
          } 
        }
    };
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
          return time.getTime() < new Date(dar.failureTime).getTime();
        }
      },
      itemPicker: "有效期：",
      facilitatorId: null,
      uploadCarwashId: null,
      uploadCarwashsId: null,
      failureTime: "",
      dotCode: "",
      dialogTitle: "",
      thishostName: '',
      fileList: "",
      itemId: null,
      item: {},
      dynamicValidateForm: {},
      loading3: false,
      lookIntoEditDialog: false,
      expandLoading: false,
      lookEditDialog: false,
      centerDialogVisible: false,
      disabledPrice: true,
      period: false,
      uploaddialogVisible: false,
      loadingBootm: false,
      urlBl: false,
      alterDisabled: false,
      inputDisabled: false,
      passRadio: null,
      loading: false,
      loading2: false,
      passDialog: false,
      editDialog: false,
      itemArr2: [],
      dialogList: {
        code: null,
        status: null,
        time: ["", ""]
      },
      itemObj: {
        openingBank: false,
        time:[]
      },
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
      expandData: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 0,
        link: ""
      },
      itemInto: {},
      queryList: {
        couponName: null,
        couponCode: null,
        name: null,
        alias: null,
        status: null,
        time: ["", ""],
      },
      statusList: [
        {
          name: '已过期',
          value: 0
        },
        {
          name: '未使用',
          value: 1
        },
        {
          name: '已使用',
          value: 2
        },
      ],
      statusList2: [
        {
          name: "未领取",
          id: 0
        },
        {
          name: "已领取",
          id: 1
        },
        {
          name: "已使用",
          id: 2
        },
        {
          name: "已注销",
          id: 3
        },
      ],
      statusList3: [],
      statusInfoList: [],
      menuList: [],
      menu2List: []
    }
  },
  created() {
    this.selectInfo()
    this.getData()
    this.thishostName = `${location.protocol}//${location.hostname}`
  },
  methods: {
    lookInto(item){
      this.lookIntoEditDialog = true
      this.itemInto = item
      this.getIntoData(item)
    },
    getIntoData(item , filter ){
      this.loading3 = true
      var data = {}
      data.logId = item.id
      // if (filter && this.expandData.current_page > 1) {
      //   data.page = this.expandData.current_page;
      // } else {
      //   this.expandData.current_page = 1;
      // }
      data.pageNum = this.expandData.current_page
      data.pageSize = this.expandData.per_page
      findCodeDetailByLogId(data).then(res=>{
         this.loading3 = false;
        if (!res.data || res.data.length <= 0) {
          this.$message("暂无数据~")
          this.expandData = {
              current_page: 1,
              data: [],
              last_page: 1,
              per_page: 10,
              total: 0,
              link: ""
         }
        }
        if( res.data && res.data.length > 0){
          this.expandData = res;
          this.expandData.current_page = res.pageNum
          this.expandData.per_page = res.pageSize
          this.expandData.total = res.total
          this.expandData.data.forEach(v=>{
              if(v.status == 0){
                v.status = "未领取"
              }else if(v.status == 1){
                v.status = "已领取"
              }else if(v.status == 2){
                v.status = "已使用"
              }else if(v.status == 3){
                v.status = "已注销"
              }
              if(v.collectionTime && v.collectionTime != 0){
                v.collectionTimeCopy = v.collectionTime
              }
              if(v.useTime && v.useTime != 0){
                v.useTimeCopy = v.useTime
              }
              if(v.source == 0){
                v.sourceCopy = "生成"
              }else{
                this.statusInfoList.forEach(i=>{
                  if(v.source == i.id){
                    v.sourceCopy = i.name
                  }
                })
              }
          })
        }
      })
    },
    expandChange(row,expandedRows){
      // 该处是用于判断是展开还是收起行，只有展开的时候做请求，避免多次请求！
      // 展开的时候expandedRows有值，收起的时候为空.
      if (expandedRows.length > 0) {
        this.expandLoading = true
        var data = {}
        data.generalId = row.id
        findGeneralLogBygeneralId(data).then(res=>{
           this.expandLoading = false
           if (!res.data || res.data.length <= 0) {
              this.$message("暂无数据~")
           }
           if( res.data && res.data.length > 0){
             // 遍历当前页面表
             this.data.data.forEach((temp, index) => {
                // 找到当前点击的行，把动态获取到的数据赋值进去
                if (temp.id === row.id) {
                  this.data.data[index].data = res.data
                }
             });
           }
        })
      }
    },
    lookData(data){
      this.dialogList = {
        code: null,
        status: null,
        time: ["", ""]
      }
      this.look(data)
    },
    look(item,filter){
      this.loading2 = true
      this.lookEditDialog = true
      this.item = item
      var data = {}
      data.generalId = item.id
      if (filter && this.dialog.current_page > 1) {
        data.page = this.dialog.current_page;
      } else {
        this.data.current_page = 1;
      }
      if(this.dialogList.code){
        data.code = this.dialogList.code
      }
      if(!(this.dialogList.status == null)){
        data.status = this.dialogList.status
      }
      if(!(this.dialogList.source == null)){
        data.source = this.dialogList.source
      }
      if(this.dialogList.time && this.dialogList.time[0] && this.dialogList.time[1]) {
        data.startTime = this.dialogList.time[0]
        data.endTime = this.dialogList.time[1]
      }
      data.pageNum = this.dialog.current_page
      data.pageSize = this.dialog.per_page
      finGeneralCouponcode(data).then(res=>{
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
                v.status = "已领取"
              }else if(v.status == 2){
                v.status = "已使用"
              }else if(v.status == 3){
                v.status = "已注销"
              }
              if(v.collectionTime && v.collectionTime != 0){
                v.collectionTimeCopy = v.collectionTime
              }
              if(v.useTime && v.useTime != 0){
                v.useTimeCopy = v.useTime
              }
              if(v.source == 0){
                v.sourceCopy = "生成"
              }else{
                this.statusInfoList.forEach(i=>{
                  if(v.source == i.id){
                    v.sourceCopy = i.name
                  }
                })
              }
          })
        }
      })
    },
    exportData2(item){
      if(this.dialog.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var { code , status , time } = this.dialogList
          var endTime = ""
          var startTime = ""
          if(time && time[0] && time[1]){
            endTime = time[1]
            startTime = time[0]
          }
          window.location.href = `${baseUrl}/wash/couponcodeExport?generalId=${item.cid}&code=${code}&status=${status}&startTime=${startTime}&endTime=${endTime}`
          // window.location.href = `${baseUrl}/wash/couponcodeExport?generalId=${item.id}&code=${code}&status=${status}&startTime=${startTime}&endTime=${endTime}`
      }
    },
    resetGetData2(item){
      this.dialogList = {
        code: null,
        status: null,
        time: ["", ""]
      }
      this.look(item)
    },
    resetGetData3(item){
      this.getIntoData(item)
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
          delGeneralCouponcodeById({ids: id}).then(res=>{
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
    getPageData2(e) {
      this.look( this.item , "page" )
    },
    getPageData3(e) {
      this.getIntoData( this.itemInto , "page" )
    },
    getCouponCode(){
      this.$refs['dynamicValidateForm'].validate((valid) => {
          if (valid){
            var data = this.dynamicValidateForm
            data.projectId = this.itemId
            generateGeneralCouponcode(data).then(res=>{;
              if(res.code == 200){
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                });
                this.centerDialogVisible = false
              }else{
                this.$message({
                  type: 'info',
                  message: res.msg
                })
              }  
            })
          }
      })
    },
    menuTwoList(id,bl){
      findCarwashsTypeById({carwashId: this.itemObj.carwashId}).then(res=>{
        if(res.code == 200){
          this.menu2List = res.data
        }else{
          this.$message("服务器数据格出了小问题哦！")
        }
      })
    },
    menuTwoList2(id){
      findCarwashsTypeById({carwashId: id}).then(res=>{
        if(res.code == 200){
          this.menu2List = res.data
        }else{
          this.$message("服务器数据格出了小问题哦！")
        }
      })
    },
    audit(item){
      this.itemId = item.id
      this.centerDialogVisible = true
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
    newlyIncreased(){
      this.apiFindCarwashType()
      this.itemPicker = "有效期："
      this.editDialog = true
      this.period = false
      this.disabledPrice = false
    },
    changePicker(){
      this.$forceUpdate()
    },
    remove(item){
      this.open('确定删除？' , item.id)
    },
    open(text,id) {
        this.$confirm( text , '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          delGeneralCouponById({id: id}).then(res=>{
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
      this.apiFindCarwashType()
      this.itemPicker = "有效期结束："
      this.editDialog = true
      this.disabledPrice = true
      this.period = true
      this.itemObj = item
      this.itemObj.time = [item.effectTime , item.failureTime]
      this.itemObj.carwashId = Number(item.carwashId)
      this.itemObj.carwashsId = Number(item.carwashsId)
      this.itemObj.channelId = Number(item.channelId)
      this.menuTwoList(item.carwashId)
      this.failureTime = item.failureTime
    },
    itemEditDialog(){
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
             var data = {}
                data.couponName = this.itemObj.couponName
                data.channelId = this.itemObj.channelId
                data.carwashId = this.itemObj.carwashId
                data.carwashsId = this.itemObj.carwashsId
                data.content = this.itemObj.content
              if(this.itemObj.id){
                data.effectTime = this.effectTime
                data.failureTime = this.itemObj.failureTime
                data.id = this.itemObj.id
                // console.log(data);
                modifyGeneralCouponById(data).then(res=>{
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
                if(this.itemObj.time[0] && this.itemObj.time[1]) {
                  data.effectTime = this.itemObj.time[0]
                  data.failureTime = this.itemObj.time[1]
                }
                saveGeneralCoupon(data).then(res=>{
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
          }
      })
    },
    close(){
      this.itemObj = {}
      this.getData()
      this.failureTime = ""
    },
    close2(){
    },
    close3(){
    },
    closeVis(){
      this.dynamicValidateForm = {}
      this.itemId = null
    },
    async selectInfo(){
      var res = await findChannelName()
      this.statusInfoList = res.data
      this.statusList3 = this.statusInfoList
      // var obj = {
      //   id: 0,
      //   name: "生成"
      // }
      // this.statusList3.push(obj)
    },
    exportData(){
      if(this.data.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
          var {couponName,couponCode,name,alias,status,time} = this.queryList
          var startTime = time[0]
          var endTime = time[1]
          window.location.href = `${baseUrl}/wash/generalCouponExport?pageNum=${this.data.current_page}&pageSize=${this.data.per_page}
          &couponName=${couponName}&couponCode=${couponCode}&name=${name}&alias=${alias}&status=${status}&startTime=${startTime}&endTime=${endTime}`
      }
    },
    submitImportExcel() {
      // if(this.facilitatorId == null){
      //   this.$message({
      //     type: "warning",
      //     message: "请选择服务商"
      //   })
      // }else if(this.uploadCarwashId == null){
      //   this.$message({
      //     type: "warning",
      //     message: "请选择服务类型"
      //   })
      // }else if(this.uploadCarwashsId == null){
      //   this.$message({
      //     type: "warning",
      //     message: "请选择服务名称"
      //   })
      // }else{}
        if (this.fileList) {
          var formData = new FormData()
          formData.append('file', this.fileList[0].raw)
          formData.append('generalId', this.item.id)
          // formData.append('source', this.facilitatorId)
          // formData.append('carwashId', this.uploadCarwashId)
          // formData.append('carwashsId', this.uploadCarwashsId)
          batchCouponcodeImport(formData).then(res => {
            if(res.code == 200){
              this.uploaddialogVisible = false
              this.$message({
                type: 'success',
                message: `上传成功!`
              })
              this.look(this.item)
            }else{
              this.$message({
                type: 'success',
                message: res.msg
              })
            }
          })
        } else {
          this.$message({
            message: '请选择Excle文件!'
          })
        }
    },
    importExcel() {
        this.fileList = null
        this.uploaddialogVisible = true
        this.apiFindCarwashType()
        this.$nextTick((i) => {
          this.$refs.upload.clearFiles()
        })
    },
    uploadgoBack() {
        this.uploaddialogVisible = false
    },
    removeFile(file, fileList) {
        this.fileList = null
    },
    handleChange(file, fileList) {
        this.fileList = fileList
    },
    getList(data){
      this.getData()
    },
    // 比较是否超过当前时间，后台懒得做，严格上讲时间戳在后台生成是比较好的
    isThreeHourAgo(time) {
      const now = Date.now()
      const d = new Date(time)
      const secDiff = (now - d) / 1000
      return secDiff > 3 * 60 * 60
    },
    async getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.couponName) {
        data.couponName = queryList.couponName
      }
      if (queryList.couponCode) {
        data.couponCode = queryList.couponCode   
      }
      if (queryList.name) {
        data.name = queryList.name   
      }
      if (queryList.alias) {
        data.alias = queryList.alias   
      }
      // console.log(queryList.status);
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
      // data.username = this.$store.state.user.name
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      findGeneralCoupon(data).then(res=>{
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
        if(res.data && res.data.length > 0){
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          res.data.map(v=>{
            var blDate = this.isThreeHourAgo(v.failureTime)
            if(!blDate){
              v.type = true
            }else{
              v.type = false
            }
            v.data = []
          })
          this.data.data = res.data
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
        couponName: null,
        couponCode: null,
        name: null,
        alias: null,
        status: null,
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
/* element样式重置 start */
 // 处理input type = number的上下箭头
 @import "../../styles/cascader.css";
 /deep/.el-table__expanded-cell{
   background: #f0f9eb !important;
 }
 /deep/.el-table__expand-icon {
   height: 60px;
   >i{
     font-size: 25px;
   }
 }
.inputNumber{
  width: 200px;
  margin-left: 20px;
}
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
  .upload-demo {
    text-align: center;
    padding: 0 100px;
  }
  .info{
    width: 300px;
    .infoItem{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: .5rem;
      .left,.right{
        flex-shrink: 0;
        max-width: 50%
      }
      .left{
        font-weight: bold
      }
    }
  }
</style>
