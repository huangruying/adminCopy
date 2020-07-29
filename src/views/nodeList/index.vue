<template>
  <div class="app-container">
    <el-divider content-position="left"><span class="title">查询</span></el-divider>
    <div class="query">
       <div class="input_box">
          <el-input
          v-model="queryList.dotCode"
          placeholder="网点编号"
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
          <el-select v-model="queryList.status" @change="getData" class="input fl" placeholder="状态">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="queryList.mechanismName" @change="getData" class="input fl" placeholder="网点类型">
            <el-option
              v-for="item in nodeTypesList"
              :label="item.name"
              :value="item.mechanismName"
              :key="item.name"
            ></el-option>
          </el-select>
          <el-input
          v-model="queryList.recommender"
          placeholder="推荐人"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
       </div> 
       <div class="input_box">
          <el-input
          v-model="queryList.phone"
          placeholder="手机号码"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
          <el-input
          v-model="queryList.dotName"
          placeholder="网点名称"
          class="input fl"
          @keyup.enter.native="handleFilter"/>
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
            class="picker fl"
            v-model="queryList.time"
            type="daterange"
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
           <el-button type="primary" @click="newly(true)" style="margin-left:15px;">新增</el-button>
         </div>
       </div>
    </div>
    <el-table
      v-loading="loading"
      :data="data.data"
      border
      stripe
      fit
      :row-class-name="tableRowClassName"
      style="width: 100%;">
      <!-- fit highlight-current-row -->
      <el-table-column label="网点编号" prop="dotCode" fixed align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="网点类型" prop="dotType" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.dotType == 0? "车行" : "代办机构" }}</span>
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
      <el-table-column label="经理/店长手机号" prop="storePhone" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.storePhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份" prop="province" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="市" prop="city" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区/县" prop="region" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.region }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="详细地址" prop="address" align="center" width="250">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="推荐人" prop="recommender" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.recommender }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" prop="statusCopy" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.statusCopy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createTime" align="center" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" fixed="right" prop="audit_status" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="edit(scope.row)">查 看</el-button>
          <el-button size="mini" type="primary" @click="pass(scope.row)" v-if="scope.row.status != 1">审 批</el-button>
          <el-button size="mini" type="primary" @click="compile(scope.row)">编 辑</el-button>
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

    <!-- 弹窗审批 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="passDialog"
      width="30%"
      @close="close"
      center>
      <span class="center">
        <el-radio-group v-model="passRadio">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">驳回</el-radio>
        </el-radio-group>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="passDialog = false">取 消</el-button>
        <el-button type="primary" @click="passDialogVisible">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹窗查看 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editDialog"
      :close-on-click-modal="false"
      width="80%"
      @close="close"
      center>
      <!-- 地图选择经纬度2层弹窗 -->
      <el-dialog
        width="50%"
        title="选择经纬度"
        :visible.sync="lngLatDialog"
        @opened="lnglatlog"
        @close="close2"
        append-to-body>

        <div class="mymapM">
          <!--捜索-->
          <div v-if="loadingLialog" class="loading" v-loading="loadingLialog">
            <!-- <van-loading type="spinner" /> -->
          </div>

          <div class="search-box">
            <div class="search-postion">
              <!-- <span class="buts">返回</span> -->
              <el-input type="text" v-model="search_key" placeholder="输入关键字搜索" @change="keySearch"></el-input>
              <span class="clear" v-if="search_key" @click="search_key ='' ">
                <!-- <van-icon color="#8f8f8f" name="clear" /> -->
              </span>
              <el-button type="primary" @click="keySearch()" style="margin: 0 30px;" icon="el-icon-search">捜索</el-button>
              <el-button type="primary" @click="SearchBtn()" style="margin: 0 30px;">确定选取该位置</el-button>
            </div>
          </div>
          <div class="con-box con-map" v-if="!search_key">
            <!--地图-->
            <div class="mapbox">
              <div class="map" id="container"></div>
              <div class="sign"></div>
            </div>
          </div>
          <div class="con-box" v-if="!search_key">
            <!--地址列表-->
            <div class="Hlist-box">
              <ul>
                <li v-for="(item, index) in lists" :key="index" @click="onAddressLi(item)">
                  <b>
                    <!-- <van-icon color="#a6a6a6" name="clock" /> -->
                    <i class="el-icon-location-information"></i>
                  </b>
                  <div>
                    <span>{{item.name}}</span>
                    <p>{{item.address}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!--捜索列表-->
          <div class="search-list" v-if="search_key">
            <ul>
              <li v-for="(item, index) in search_list" :key="index" @click="onSearchLi(item.location)">
                <span>{{item.name}}</span>
                <p>{{item.address}}</p>
              </li>
              <li v-if="noSearchShow" class="listnodata">
                <p>暂无搜索结果</p>
              </li>
            </ul>
          </div>
        </div>

      </el-dialog>
      <!-- 图片查看弹出窗 -->
      <el-dialog :visible.sync="updateDialog" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-form label-position="right" ref="ruleForm" :rules="rules" label-width="150px" :model="itemObj" class="clearFix">
       <el-divider content-position="left"><span class="title">网点信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">        
            <!-- <el-form-item label="网点编号:" prop="dotCode" style="width:50%">
              <el-input v-model="itemObj.dotCode" style="width:210px" :disabled="alterDisabled"></el-input>
            </el-form-item> -->
            <el-form-item label="网点名称:" prop="dotName" style="width:50%">
              <el-input v-model="itemObj.dotName" style="width:210px" :disabled="inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="网点简称:" prop="dotAbbreviation" style="width:50%">
              <el-input v-model="itemObj.dotAbbreviation" style="width:210px" :disabled="inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="网点类型:" prop="dotType" style="width:50%">
              <el-select v-model="itemObj.dotType" style="width:210px" placeholder="网点类型">
                <el-option
                  v-for="item in nodeTypesList"
                  :label="item.name"
                  :value="item.mechanismName"
                  :key="item.name"
                ></el-option>
              </el-select>
              <!-- <el-input v-model="itemObj.mechanismName" style="width:210px" :disabled="inputDisabled"></el-input> -->
            </el-form-item>
            <el-form-item label="所属机构:" prop="mechanismId" style="width:50%">
              <el-select v-model="itemObj.mechanismId" style="width:210px" placeholder="所属机构">
                <el-option
                  v-for="item in organizationList"
                  :label="item.mechanismName"
                  :value="item.id"
                  :key="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客服电话:" prop="mobile" style="width:50%">
              <el-input v-model="itemObj.mobile" style="width:210px" :disabled="inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="经理/店长:" prop="shopowner" style="width:50%">
              <el-input v-model="itemObj.shopowner" style="width:210px" :disabled="inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="经理/店长手机号码:" prop="storePhone" style="width:50%">
                <el-input v-model="itemObj.storePhone" style="width:210px" :disabled="inputDisabled"></el-input>
                <span class="phone_color">手机号是商家账号</span>
            </el-form-item>
            <el-form-item label="救援电话:" prop="rescueCall" style="width:50%">
              <el-input v-model="itemObj.rescueCall" style="width:210px" :disabled="alterDisabled"></el-input>
            </el-form-item>
            <!-- <el-form-item label="负责人:" prop="charge" style="width:50%">
              <el-input v-model="itemObj.charge" style="width:210px" :disabled="inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="负责人手机号码:" prop="chargePhone" style="width:50%">
              <el-input v-model="itemObj.chargePhone" style="width:210px" :disabled="inputDisabled"></el-input>
            </el-form-item> -->
            <el-form-item label="合同到期时间:" prop="contractTime" style="width:50%" required>
              <el-date-picker
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                :disabled="alterDisabled"
                v-model="itemObj.contractTime"
                type="datetime"
                style="width:210px"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="经度/纬度:" prop="longitude" style="width:50%" class="formspan" :class="!lanbtn?'itembor': ''">
              <!-- <div>
                <span class="lnglatText" @click="lngLatDia">{{lnglatText}}</span>
              </div> -->
              <el-input v-model="itemObj.longitude" style="width:210px;" @click="lngLatDia" placeholder="请点击右侧按钮选择经纬度"></el-input>
              <el-button type="primary" @click="lngLatDia" :disabled="inputDisabled">点击选择经纬度</el-button>
              <span style="color: #f00;" class="spanbtn" v-if="!lanbtn">请点击按钮选择经纬度</span>
            </el-form-item>
            <el-form-item label="网点推荐人:" prop="recommender" style="width:50%">
              <el-input v-model="itemObj.recommender" style="width:210px" :disabled="alterDisabled"></el-input>
            </el-form-item>
            <el-form-item label="网点地址:" prop="dotAddress" style="width:50%">
              <el-input v-model="itemObj.dotAddress" style="width:210px" :disabled="inputDisabled"></el-input>
            </el-form-item>
            <el-form-item label="营业时间:" prop="businessHours" style="width:50%">
            <el-time-picker
              class="picker_tiem"
              is-range
              arrow-control
              :disabled="alterDisabled"
              v-model="itemObj.businessHours"
              format="HH:mm"
              value-format="HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围">
            </el-time-picker>
            </el-form-item>
            <el-form-item label="省:" prop="provinceId" style="width:50%">
              <el-select v-model="itemObj.provinceId" placeholder="请选择省份" @change="changeCity" :disabled="alterDisabled">
                <el-option v-for="(item, idx) in areaJson" :key="idx" :label="item.province" :value="item.provinceid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="市:" prop="cityId" style="width:50%">
              <el-select v-model="itemObj.cityId" placeholder="请选择城市" @change="changeCounty(itemObj.cityId)" :disabled="alterDisabled">
                <el-option v-for="(item, idx) in cityList" :key="idx" :label="item.city" :value="item.cityid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="区:" prop="regionId" style="width:50%">
              <el-select v-model="itemObj.regionId" placeholder="请选择区/县" :disabled="alterDisabled"  @change="regionChange">
                <el-option v-for="(item, idx) in countyList" :key="idx" :label="item.area" :value="item.areaid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="网点详细地址:" prop="address" style="width:100%">
              <el-input v-model="itemObj.address" style="width:80%;" :disabled="inputDisabled"></el-input>
            </el-form-item>      
         </div>
         <el-divider content-position="left"><span class="title">服务项采购价格</span></el-divider>
         <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
            <!-- <el-checkbox-group v-model="itemVcheckList"> -->
              <div class="fuwu_xan">
                <div class="xian_type" v-for="(itemV,indexV) in serviceItemList" :key="indexV">
                  <el-button type="primary" style="margin-bottom: 10px;">{{ itemV.dotType }}</el-button>
                  <!-- <el-checkbox :label="itemV.id" style="width: 100px;margin-bottom:20px;" border>{{ itemV.dotType }}</el-checkbox> -->
                  <div class="input_checkbox">
                    <el-checkbox-group v-model="valueVcheckList">
                      <div style="width:100%;" class="clearFix">
                        <div style="width:50%; float: left;" v-for="(valueV,indexV) in itemV.carwashsTypes" :key="indexV">
                            <el-checkbox :label="valueV.strObj" @change="Vchange()">
                              <el-input placeholder="请输入价格" type='number' min="0" onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"  v-model="valueV.price" style="margin-bottom: 10px;" @blur="Vchange">
                                <template slot="prepend">{{ valueV.dotsType }}</template>
                                <template slot="append">元</template>
                              </el-input>
                            </el-checkbox>
                        </div>
                      </div>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            <!-- </el-checkbox-group> -->
         </div>
         <el-divider content-position="left"><span class="title">银行账户信息</span></el-divider>
         <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
           <el-form-item label="户名:" prop="accountName" style="width:50%">
              <el-input v-model="itemObj.accountName" style="width:210px" :disabled="inputDisabled"></el-input>
           </el-form-item>
           <el-form-item label="账户:" prop="account" style="width:50%">
              <el-input v-model="itemObj.account" style="width:210px" :disabled="inputDisabled"></el-input>
           </el-form-item>
           <el-form-item label="开户行:" prop="openingBank" style="width:50%">
              <el-input v-model="itemObj.openingBank" style="width:210px" :disabled="inputDisabled"></el-input>
           </el-form-item>
         </div>
         <el-divider content-position="left"><span class="title">网点照片及营业执照</span></el-divider>
         <div class="query clearFix" style="padding-top:30px;">
           <div class="boxUpload">
             <div class="item">
                <el-upload
                  :on-exceed="onExceed"
                  :limit="4"
                  action=""
                  class="avatar-uploader"
                  list-type="picture-card"
                  :before-remove="handleRemove1"
                  :on-preview="handlePictureCardPreview"
                  :auto-upload="false"
                  :on-change="handleChange1"
                  :file-list="fileList_1"
                  :before-upload="beforeAvatarUpload">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <div class="text">上传店面形象照片</div>
             </div>
           </div>
           <div class="boxUpload clearfix">
            <div class="textUp">
              <el-upload
                :disabled="disabledBtn"
                class="avatar-uploader"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleChange2"
                :file-list="fileList_2"
                :before-upload="beforeAvatarUpload">
                <img v-if="receptionImage" :src="receptionImage" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon">上传接待室照片</i>
                <div class="text">上传接待室照片</div>
                <el-button size="mini" type="primary" plain class="btn">+上传</el-button>
              </el-upload>
              <a :href="receptionImage" target="_blank" class="uploadTransparency" v-if="!(receptionImage=='')"></a>
            </div>
            <div class="textUp">
              <el-upload
                :disabled="disabledBtn"
                class="avatar-uploader"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleChange5"
                :file-list="fileList_5"
                :before-upload="beforeAvatarUpload">
                <img v-if="honorImage" :src="honorImage" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon">上传其他荣誉照片</i>
                <div class="text">上传其他荣誉照片</div>
                <el-button size="mini" type="primary" plain class="btn">+上传</el-button>
              </el-upload>
              <a :href="honorImage" target="_blank" class="uploadTransparency" v-if="!(honorImage=='')"></a>
            </div>
            <div class="textUp">
              <el-upload
                :disabled="disabledBtn"
                class="avatar-uploader"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleChange3"
                :file-list="fileList_3"
                :before-upload="beforeAvatarUpload">
                <img v-if="constructionImage" :src="constructionImage" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon">上传施工车间照片</i>
                <div class="text">上传施工车间照片</div>
                <el-button size="mini" type="primary" plain class="btn">+上传</el-button>
              </el-upload>
              <a :href="constructionImage" target="_blank" class="uploadTransparency" v-if="!(constructionImage=='')"></a>
            </div>
            <div class="textUp">
              <el-upload
                :disabled="disabledBtn"
                class="avatar-uploader"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleChange4"
                :file-list="fileList_4"
                :before-upload="beforeAvatarUpload">
                <img v-if="trafficImage" :src="trafficImage" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon">上传交通许可证</i>
                <div class="text">上传交通许可证</div>
                <el-button size="mini" type="primary" plain class="btn">+上传</el-button>
              </el-upload>
              <a :href="trafficImage" target="_blank" class="uploadTransparency" v-if="!(trafficImage=='')"></a>
            </div>
            <div class="textUp">
              <el-upload
                :disabled="disabledBtn"
                class="avatar-uploader"
                action=""
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleChange6"
                :file-list="fileList_6"
                :before-upload="beforeAvatarUpload">
                <img v-if="businessImage" :src="businessImage" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon">上传工商营业照片</i>
                <div class="text">上传工商营业照片</div>
                <el-button size="mini" type="primary" plain class="btn">+上传</el-button>
              </el-upload>
              <a :href="businessImage" target="_blank" class="uploadTransparency" v-if="!(businessImage=='')"></a>
            </div>
          </div>
          <!-- <div>店面形象照片最多上传4张，展示于用户界面轮播图。</div> -->
         </div>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" :loading="loadingBootm" @click="editDialogVisible" v-if="compileBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList , examineDot , dotOssUpload , updateDot , saveDot , dotExport , findCarwashTypeInfos , findYuyueProvinces , findYuyueCityByProvinceid , findYuyueAreasByCityid , findMechanismName , findCarwashTypesInfos } from '@/api/nodeList'
import { findCarwashsTypeById, findCarwashType } from '@/api/volumeList'
import Pagination from "@/components/Pagination"
import { baseUrl } from '@/utils/baseUrl'
// import areaJson from '@/utils/city_data'
import axios from 'axios'
export default {
  name: 'nodeList',
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
      cityListJson: [],
      regionListJson: [],
      serviceItemList: [],
      serviceList: [],
      itemVcheckList: [],
      valueVcheckList: [],
      valueArr: [],
      center: [116.42792, 39.902896], //经度+纬度
      search_key: "", //搜索值
      lanbtn: true,
      lists: [], //地点列表
      search_list: [], //搜索结果列表
      marker: "",
      loadingLialog: false,
      arrLngLat: [],
      noSearchShow: false, //无搜索结果提示，无搜索结果时会显示暂无搜索结果
      lnglatText: "点击选择经纬度",
      dotCode: "",
      dialogTitle: "",
      thishostName: '',
      dialogImageUrl: "",
      loadingBootm: false,
      lngLatDialog: false,
      urlBl: false,
      compileBtn: false,
      alterDisabled: false,
      inputDisabled: false,
      disabledBtn: false,
      passRadio: null,
      loading: false,
      passDialog: false,
      editDialog: false,
      updateDialog: false,
      areaJson: [],
      itemObj: {},
      storeImage: [],
      storeImages: "",
      receptionImage: "",
      honorImage: "",
      constructionImage: "",
      trafficImage: "",
      businessImage: "",
      fileList_1:[],
      fileList_2:[],
      fileList_3:[],
      fileList_4:[],
      fileList_5:[],
      fileList_6:[],
      cityList: [],
      countyList: [],
      menuList: [],
      menu2List: [],
      rules: {
          dotCode: [
            { required: true, message: '网点编号不能为空', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          provinceId: [
            { required: true, message: '请选择区域', trigger: 'change' }
          ],
          cityId: [
            { required: true, message: '请选择区域', trigger: 'change' }
          ],
          regionId: [
            { required: true, message: '请选择区域', trigger: 'change' }
          ],
          dotType: [
            { required: true, message: '请选择网点类型', trigger: 'change' }
          ],
          dotName: [
            { required: true, message: '网点名称不能为空', trigger: 'blur' }
          ],
          date: [
             { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          dotAbbreviation: [
            { required: true, message: '网点简称不能为空', trigger: 'blur' }
          ],
          shopowner: [
            { required: true, message: '经理/店长姓名不能为空', trigger: 'blur' }
          ],
          storePhone: [
            { required: true, message: '经理/店长手机号码不能为空', trigger: 'blur' }
          ],
          dotAddress: [
            { required: true, message: '网点地址不能为空', trigger: 'blur' }
          ],
          recommender: [
            { required: true, message: '网点推荐人不能为空', trigger: 'blur' }
          ],
          longitude: [
            { required: true, message: '请选择经纬度', trigger: 'input'}
          ],
          contractTime: [
            { required: true, message: '请选择合同到期时间', trigger: 'blur'}
          ],
          businessHours: [
            { required: true, message: '请选择营业时间', trigger: 'blur'}
          ],
          accountName: [
            { required: true, message: '户名不能为空', trigger: 'blur'}
          ],
          account: [
            { required: true, message: '账户不能为空', trigger: 'blur'}
          ],
          openingBank: [
            { required: true, message: '开户行不能为空', trigger: 'blur'}
          ]
          // storePhone: [
          //   { required: true, message: '不能为空', trigger: 'blur' },
          //   { validator: storePhone, trigger: 'blur' }
          // ]
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
        dotCode: null,
        status: null,
        dotName: null,
        province: null,
        city: null,
        region: null,
        phone: null,
        nodeTypes: null,
        recommender: null,
        carwashId: null,
        carwashsId: null,
        time: ["" , ""]
      },
      statusList: [
        {
          name: '待审批',
          value: 0
        },
        {
          name: '审批通过',
          value: 1
        },
        {
          name: '已驳回',
          value: 2
        }
      ],
      nodeTypesList: [
        {
          name: '车行',
          mechanismName: 0
        },
        {
          name: '代办机构',
          mechanismName: 1
        },
      ],
      organizationList: []
    }
  },
  created() {
    this.getData()
    // this.apiTypeInfos()
    this.thishostName = `${location.protocol}//${location.hostname}`
    // 省市区
    this.ApiAreaJson()
    // 服务项
    this.serviceItem()
    // 服务项数据
    this.apiFindCarwashType()
  },
  watch: {
    search_key(newv, oldv) {
      if (newv == "") {
        this.search_list = [];
        this.noSearchShow = false;
        setTimeout(() => {
          this.adMap();
        }, 1000);
      }
    }
  },
  methods: {
    // 确定选取位置
    SearchBtn(){
      var arr = this.center
      this.arrLngLat = arr
      this.itemObj.longitude = arr[0] + "/" + arr[1]
      this.itemObj.longitudes = arr[0] + "/" + arr[1]
      this.lngLatDialog = false
    },
    // 以下是地图需要的函数
    adMap() {
      this.loadingLialog = true;
      //初始化地图
      var map = new AMap.Map("container", {
        zoom: 14, //缩放级别
        // center: this.center //设置地图中心点
        //resizeEnable: true,  //地图初始化加载定位到当前城市
      });
      //获取初始中心点并赋值
      var currentCenter = map.getCenter(); //此方法是获取当前地图的中心点
      this.center = [currentCenter.lng, currentCenter.lat]; //将获取到的中心点的纬度经度赋值给data的center
      console.log(this.center);

      //创建标记
      this.marker = new AMap.Marker({
        position: new AMap.LngLat(currentCenter.lng, currentCenter.lat) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      });
      // 将创建的点标记添加到已有的地图实例：
      map.add(this.marker);

      //根据地图中心点查附近地点，此方法在下方
      this.centerSearch();
      //监听地图移动事件，并在移动结束后获取地图中心点并更新地点列表
      var moveendFun = e => {
        // 获取地图中心点
        currentCenter = map.getCenter();
        this.center = [currentCenter.lng, currentCenter.lat];
        // console.log(this.center);
        this.marker.setPosition([currentCenter.lng, currentCenter.lat]); //更新标记的位置
        //根据地图中心点查附近地点
      };
      //更新数据
      var centerSearch = () => {
        this.loadingLialog = true;
        this.centerSearch();
      };

      // 绑定事件移动地图事件
      map.on("mapmove", moveendFun); //更新标记
      map.on("moveend", centerSearch); //更新数据
    },
    centerSearch() {
      AMap.service(["AMap.PlaceSearch"], () => {
        //构造地点查询类
        var placeSearch = new AMap.PlaceSearch({
          type:
            "汽车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|地名地址信息", // 兴趣点类别
          pageSize: 30, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: "全国", // 兴趣点城市
          autoFitView: false // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        //根据地图中心点查附近地点
        placeSearch.searchNearBy(
          "",
          [this.center[0], this.center[1]],
          200,
          (status, result) => {
            if (status == "complete") {
              this.lists = result.poiList.pois; //将查询到的地点赋值
              this.loadingLialog = false;
            }
          }
        );
      });
    },
    keySearch() {
      this.loadingLialog = true;
      AMap.service(["AMap.PlaceSearch"], () => {
        //构造地点查询类
        var placeSearch = new AMap.PlaceSearch({
          type:
            "汽车服务|餐饮服务|购物服务|生活服务|体育休闲服务|医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|交通设施服务|金融保险服务|公司企业|地名地址信息", // 兴趣点类别
          pageSize: 30, // 单页显示结果条数
          pageIndex: 1, // 页码
          city: "全国", // 兴趣点城市
          citylimit: false, //是否强制限制在设置的城市内搜索
          autoFitView: false // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
        });
        //关键字查询
        placeSearch.search(this.search_key, (status, result) => {
          if (status == "complete") {
            if (result.poiList.count === 0) {
              this.noSearchShow = true;
            } else {
              this.search_list = result.poiList.pois; //将查询到的地点赋值
              this.noSearchShow = false;
              this.loadingLialog = false;
            }
          } else {
            this.search_list = [];
            this.noSearchShow = true;
          }
        });
      });
    },
    onAddressLi(e) {
      console.log(e);
      this.marker.setPosition([e.location.lng, e.location.lat]); //更新标记的位置
      var arr = [e.location.lng , e.location.lat]
      this.arrLngLat = arr
      this.itemObj.longitude = arr[0] + "/" + arr[1]
      this.itemObj.longitudes = arr[0] + "/" + arr[1]
      this.lngLatDialog = false
    },
    onSearchLi(e) {
      console.log(e.lng + "-" + e.lat);
      this.center = [e.lng, e.lat];
      // console.log(this.center);
      this.search_key = "";
      // this.loading=true;
      setTimeout(() => {
        this.adMap();
      }, 1000);
    },
    // 以上是地图需要的函数
    getDataProvince(){
      findYuyueCityByProvinceid({provinceid: this.queryList.province}).then(res=>{
        this.cityListJson = res.data
      })
      this.queryList.city = null
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
    getDataCity(){
      findYuyueAreasByCityid({cityid: this.queryList.city}).then(res=>{
        this.regionListJson = res.data
      })
      this.queryList.region = null
      this.getData()
    },
    Vchange(){  // 服务项
      let arr = []
      var itemArr = JSON.parse(JSON.stringify(this.valueVcheckList)) //拷贝选中数组
      var sum = JSON.parse(JSON.stringify(this.serviceItemList)) //拷贝全部数据数组
      itemArr.forEach(v=>{
        var obj = JSON.parse(v)
        sum.forEach(value=>{
          if(obj.id == value.id){
            value.carwashsTypes.forEach(item=>{
              if(item.id == obj.ids && obj.id == value.id){
                let itemObj = {}
                itemObj.carwashsId = item.id
                itemObj.price = item.price
                itemObj.carwashId = obj.id
                arr.push(itemObj)
              }
            })
          }
        })
      })
      this.valueArr = arr
    },
    serviceItem(){
      findCarwashTypesInfos().then(res=>{
        this.serviceItemList = res.data
        this.serviceItemList.forEach(v=>{
          // var obj = {
          //   id: v.id
          // }
          // v.carwashsTypes.forEach(i=>{
          //   obj.ids = i.ids
          //   i.strObj = JSON.stringify(obj) // 2级id字符串
          // })
          v.id = v.dtId
          var obj = {
            id: v.dtId
          }
          v.carwashsTypes.forEach(i=>{
            obj.ids = i.id
            i.strObj = JSON.stringify(obj) // 2级id字符串
          })
        })
        // let arr = []
        // res.data.forEach(v=>{
        //     v.carwashsTypes.forEach(i=>{
        //       arr.push(i)
        //     })
        // })
        // this.serviceList = arr // 备用数据，暂时用不上
      })
    },
    lngLatDia(){
      this.lngLatDialog = true
      // this.inputBtn = false
      //初始化地图
      // this.$nextTick(()=>{
      // })
    },
    regionChange(){
      // console.log(this.itemObj.regionId);
      this.$forceUpdate()
    },
    lnglatlog(){
      this.adMap()
    },
    getData(filter){
      this.loading = true
      let data = {}
      var queryList = this.queryList
      if (queryList.dotCode) {
        data.dotCode = queryList.dotCode
      }
      if(!(queryList.status == null)){
        data.status = queryList.status
      }
      if (queryList.dotName) {
        data.dotName = queryList.dotName
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
      if (queryList.chargePhone) {
        data.chargePhone = queryList.chargePhone   
      }
      if (queryList.recommender) {
        data.recommender = queryList.recommender
      }
      if (!(queryList.mechanismName == null)) {
        data.mechanismName = queryList.mechanismName   
      }
      if (!(queryList.carwashId == null)) {
        data.carwashId = queryList.carwashId   
      }
      if (!(queryList.carwashsId == null)) {
        data.carwashsId = queryList.carwashsId   
      }
      if (queryList.nodeTypes) {
        data.nodeTypes = queryList.nodeTypes
      }
      if (filter && this.data.current_page > 1) {
        data.page = this.data.current_page;
      } else {
        this.data.current_page = 1;
      }
      if (queryList.time[0] && queryList.time[1]) {
        data.startTime = queryList.time[0]
        data.endTime = queryList.time[1]
      }
      // data.username = this.$store.state.user.name
      data.pageNum = this.data.current_page
      data.pageSize = this.data.per_page
      getList(data).then(res=>{
        // console.log(res);
        this.loading = false;
        if( res.data && res.data.length > 0){
          this.data = res;
          this.data.current_page = res.pageNum
          this.data.per_page = res.pageSize
          this.data.total = res.total
          this.data.data.forEach(v=>{
            if(v.status == 0){
              v.statusCopy = "待审核"
            }else if(v.status == 1){
              v.statusCopy = "审批通过"
            }else if(v.status == 2){
              v.statusCopy = "已驳回"
            }       
          })
        }else{
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
      })
    },
    handleFilter(){
      this.getData()
    },
    getPageData(e) {
      this.getData("page");
    },
    apiFindMechanismName(){
      findMechanismName().then(res=>{
        if(res.code == 200){
          this.organizationList = res.data         
        }
      })
    },
    edit(item){
      // 改造数据获取绑定值，后台数据非常混乱，编辑查看新增以下代码均是改造数据
      if(item.dotServices){
        item.dotServices.forEach(v=>{
          var dotObj = {}
          // dotObj.id = Number(v.carwashId)
          dotObj.id = v.carwashId
          // dotObj.ids = Number(v.carwashsId)
          dotObj.ids = v.carwashsId
          this.valueVcheckList.push(JSON.stringify(dotObj))
          this.serviceItemList.forEach(i=>{
              if(i.id == v.carwashId){
                i.carwashsTypes.forEach(t=>{
                  if(t.ids == v.carwashsId){
                    t.price = v.price
                  }
                })
              }
          })
        })
      }
      findYuyueCityByProvinceid({provinceid: item.provinceId}).then(res=>{
        this.cityList = res.data
      })
      findYuyueAreasByCityid({cityid: item.cityId}).then(res=>{
        this.countyList = res.data
      })
      item.cityId = String(item.cityId)
      item.provinceId = String(item.provinceId)
      item.regionId = String(item.regionId)
      item.mechanismId = Number(item.mechanismId)
      item.dotType = Number(item.dotType)
      this.editDialog = true
      this.dialogTitle = "查看"
      this.itemObj = item
      this.itemObj.longitude = item.latitude + "/" + item.longitude
      this.itemObj.businessHours = [item.businessHours,item.businessHours2]
      if(item.trafficImage){
        var trafficImage = JSON.parse(item.trafficImage)
        this.trafficImage = trafficImage[0]
      }
      if(item.receptionImage){
        var receptionImage = JSON.parse(item.receptionImage)
        this.receptionImage = receptionImage[0]
      }
      if(item.honorImage){
         var honorImage = JSON.parse(item.honorImage)
         this.honorImage = honorImage[0]
      }
     if(item.constructionImage){
       var constructionImage = JSON.parse(item.constructionImage)
       this.constructionImage = constructionImage[0]
     }
     if(item.businessImage){
       var businessImage = JSON.parse(item.businessImage)
       this.businessImage = businessImage[0]
     }
     if(item.storeImages){
       this.storeImage = item.storeImages
       this.storeImages = item.storeImages
       var ArrImg = []
       item.storeImages.forEach(v=>{
         var obj = {}
         obj.url = v
         obj.name = v.split("/").pop()
         ArrImg.push(obj)
       })
       this.fileList_1 = ArrImg
     }
      this.alterDisabled = true
      this.inputDisabled = true
      this.disabledBtn = true
      this.compileBtn = false
    },
    compile(item){
      // 改造数据获取绑定值，后台数据非常混乱，编辑查看新增以下代码均是改造数据
      if(item.dotServices){
        item.dotServices.forEach(v=>{
          var dotObj = {}
          // dotObj.id = Number(v.carwashId)
          dotObj.id = v.carwashId
          // dotObj.ids = Number(v.carwashsId)
          dotObj.ids = v.carwashsId
          this.valueVcheckList.push(JSON.stringify(dotObj))
          this.serviceItemList.forEach(i=>{
              if(i.id == v.carwashId){
                i.carwashsTypes.forEach(t=>{
                  if(t.id == v.carwashsId){
                    t.price = v.price
                  }
                })
              }
          })
        })
      }
      findYuyueCityByProvinceid({provinceid: item.provinceId}).then(res=>{
        this.cityList = res.data
      })
      findYuyueAreasByCityid({cityid: item.cityId}).then(res=>{
        this.countyList = res.data
      })
      this.arrLngLat = [item.latitude,item.longitude]
      item.cityId = String(item.cityId)
      item.provinceId = String(item.provinceId)
      item.regionId = String(item.regionId)
      item.mechanismId = Number(item.mechanismId)
      item.dotType = Number(item.dotType)
      this.dotCode = item.dotCode
      this.editDialog = true
      this.dialogTitle = "编辑"
      this.itemObj = item
      this.itemObj.longitude = item.latitude + "/" + item.longitude
      this.itemObj.businessHours = [item.businessHours , item.businessHours2]
      if(item.trafficImage){
        var trafficImage = JSON.parse(item.trafficImage)
        this.trafficImage = trafficImage[0]
      }
      if(item.receptionImage){
        var receptionImage = JSON.parse(item.receptionImage)
        this.receptionImage = receptionImage[0]
      }
      if(item.honorImage){
         var honorImage = JSON.parse(item.honorImage)
         this.honorImage = honorImage[0]
      }
     if(item.constructionImage){
       var constructionImage = JSON.parse(item.constructionImage)
       this.constructionImage = constructionImage[0]
     }
     if(item.businessImage){
       var businessImage = JSON.parse(item.businessImage)
       this.businessImage = businessImage[0]
     }
     if(item.storeImages){
       this.storeImage = item.storeImages
       this.storeImages = item.storeImages
       var ArrImg = []
       item.storeImages.forEach(v=>{
         var obj = {}
         obj.url = v
         obj.name = v.split("/").pop()
         ArrImg.push(obj)
       })
       this.fileList_1 = ArrImg
      }
      this.alterDisabled = true
      this.inputDisabled = false
      this.disabledBtn = false
      this.compileBtn = true
      this.apiFindMechanismName()
    },
    newly(val){
      this.editDialog = true
      this.dialogTitle = "新增"
      this.alterDisabled = false
      this.inputDisabled = false
      this.disabledBtn = false
      this.compileBtn = true
      this.urlBl = val
      this.fileList_1 = []
      this.fileList_2 = []
      this.fileList_3 = []
      this.fileList_4 = []
      this.fileList_5 = []
      this.fileList_6 = []
      this.apiFindMechanismName()
    },
    close2(){
        // this.inputBtn = true
    },
    editDialogVisible(){
      this.itemObj.storeImage = JSON.stringify(this.storeImage)
      // 使用ES6的Object.keys()方法,是ES6的新方法, 返回值也是对象中属性名组成的数组
      // var data = this.itemObj
      // var arr = Object.keys(data);
      this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if(!(this.arrLngLat[0] && this.arrLngLat[1])){
              this.$message({
                    message: '经纬度格式不正确，请点击按钮选择经纬度',
                    type: 'warning'
                  })
              this.lanbtn = false
              return
            }else{
              this.lanbtn = true
            }
            // this.loadingBootm = true
            this.itemObj.longitude = this.arrLngLat[0]
            this.itemObj.latitude = this.arrLngLat[1]
            // this.itemObj.businessHours = JSON.stringify(this.itemObj.businessHours)
            var bus = this.itemObj.businessHours
            this.itemObj.businessHours = bus[0]
            this.itemObj.businessHours2 = bus[1]
            this.itemObj.dotServices = this.valueArr // 服务项绑定数据
            if(this.urlBl){
              saveDot(this.itemObj).then(res=>{
                this.editDialog = false 
                if(res.code == 200){
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                }else{
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
            }else{
              updateDot(this.itemObj).then(res=>{
                if(res.code == 200){
                  this.$message({
                    message: '操作成功',
                    type: 'success'
                  })
                  this.editDialog = false
                }else{
                  this.$message({
                    message: res.msg,
                    type: 'warning'
                  })
                }
              })
            }
          } else {
            console.log('error submit!!');
            this.$message({
              message: "填写有误！",
              type: 'warning'
            })
            return false;
          }
      });
    },
    exportData() {
      // console.log(this.data.data);
      if(this.data.data.length <= 0){
        this.$message({
            message: '暂无数据可导出~',
            type: 'warning'
          })
      }else{
        // axios({
        //     url: 'http://192.168.0.161:8182/yuyuetrip/wash/dotExport',
        //     method: 'get',
        //     params: { pageNum: this.data.current_page , pageSize: this.data.per_page}
        //   })
      //   queryList: {
      //   dotCode: null,
      //   status: null,
      //   dotName: null,
      //   province: null,
      //   city: null,
      //   region: null,
      //   phone: null,
      //   nodeTypes: null,
      //   recommender: null,
      //   time: ["", ""],
      // },
      var {dotCode,status,dotName,province,city,region,phone,nodeTypes,recommender,time} = this.queryList
        var startTime = time[0]
        var endTime = time[1]
        window.location.href = `${baseUrl}/wash/dotExport?pageNum=${this.data.current_page}&pageSize=${this.data.per_page}&status=${status}&dotCode=${dotCode}&dotName=${dotName}&province=${province}&city=${city}&region=${region}&phone=${phone}&nodeTypes=${nodeTypes}&recommender=${recommender}&startTime=${startTime}&endTime=${endTime}`
        // row.exportDatabtn = false
        // dotExport({ pageNum: this.data.current_page , pageSize: this.data.per_page}).then(res => {
        //   console.log(res);
        //   // console.log(res);
        //   // this.$message({
        //   //   message: '操作成功',
        //   //   type: 'success'
        //   // })
        //   // this.down(`${this.thishostName}${res.url}`)

        //   // row.exportDatabtn = false
        // })
      }
    },
    ApiAreaJson(){
      findYuyueProvinces().then(res=>{
        this.areaJson = res.data
      })
    },
    changeCity(){
      findYuyueCityByProvinceid({provinceid: this.itemObj.provinceId}).then(res=>{
        this.cityList = res.data
        this.itemObj.cityId = this.cityList[0].cityid
        this.changeCounty()
      })
    },
    changeCounty(){
      findYuyueAreasByCityid({cityid: this.itemObj.cityId}).then(res=>{
        this.countyList = res.data
        this.itemObj.regionId = this.countyList[0].areaid
      })
    },
    pass(item){
      this.passDialog = true
      this.dialogTitle = "审批"
      this.itemObj = item
    },
    passDialogVisible(){
      if(!this.passRadio){
        this.$message({
          message: '请选择审批状态！',
          type: 'warning'
        });
      }else{
        examineDot({status:this.passRadio,dotCode:this.itemObj.dotCode}).then(res=>{
          if(res.code == 200){
            this.$message({
              message: '操作成功！',
              type: 'success'
            });
            this.passDialog = false
          }else{
            this.$message.error(res.msg);
          }
        })
      } 
    },
    close(){
      this.itemObj = {}
      this.getData()
      this.urlBl = false
      this.storeImage = []
      this.storeImages =  ""
      this.receptionImage = ""
      this.honorImage = ""
      this.constructionImage = ""
      this.trafficImage = ""
      this.businessImage = ""
      this.valueVcheckList = []
      this.serviceItem() // 重置服务项数据
    },
    reset(){
      this.queryList = {
        dotCode: null,
        status: null,
        dotName: null,
        province: null,
        city: null,
        region: null,
        phone: null,
        recommender: null,
        carwashId: null,
        carwashsId: null,
        time: ["", ""],
      }
    },
    resetGetData(){
      this.reset()
      this.getData()
    },
    tableRowClassName({row, rowIndex}) {
        // if (rowIndex === 0 || rowIndex === 3 || rowIndex === 6 ) {
        //   return 'warning-row';
        // }
        return '';
        //  else if (rowIndex === 2 || rowIndex === 5  || rowIndex === 8 ) {
        //   return 'success-row';
        // }
    },
    onExceed(){
      this.$message({
          type: 'info',
          message: "最多上传4张图片！"
       })
    },
    apiUploadImg(formData , num){
      dotOssUpload(formData).then(res => {
            if(res.code == 200){
               this.$message({
                type: 'success',
                message: `上传成功!`
              })
              if(num === 1){
                this.storeImage.push(res.data)
                // this.itemObj.storeImage = JSON.stringify(this.storeImage)
              }else if(num === 2){
                var arr = [res.data]
                this.itemObj.receptionImage = JSON.stringify(arr)
              }else if(num === 3){
                var arr = [res.data]
                this.itemObj.constructionImage = JSON.stringify(arr)
              }else if(num === 4){
                this.itemObj.trafficImage = JSON.stringify([res.data])
              }else if(num === 5){
                this.itemObj.honorImage = JSON.stringify([res.data])
              }else if(num === 6){
                this.itemObj.businessImage = JSON.stringify([res.data])
              }
            }else{
              this.$message({
                type: 'info',
                message: res.msg
              })
            }
      })
    },
    handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.updateDialog = true;
    },
    handleRemove1(file, fileList){
        let a = file
        let b = this.fileList_1.indexOf(a)
        if(this.storeImage[b] == undefined){
          this.$message({ message: '删除失败！' })
          return Promise.reject()
        }else{
          this.storeImage.splice(b,1)
          this.$message({ message: '已删除该照片!' })
          return true
        }
    },
    handleChange1(file, fileList) {
      if(fileList.length>0){
        // this.fileList_1 = [fileList[fileList.length - 1]] //展示最后一次选择文件
         this.fileList_1 = fileList
        //  console.log(this.fileList_1);
         this.storeImagess = URL.createObjectURL(file.raw);
      }
      if (this.fileList_1) {
            var formData = new FormData()
          // formData.append('dotCode', this.dotCode)
            // formData.append('file', this.fileList_1[0].raw)
            formData.append('file', file.raw)
           this.apiUploadImg(formData , 1)
          } else {
            this.$message({ message: '请上传图片!' })
      }
    },
    handleChange2(file, fileList) {
      if(fileList.length>0){
         this.fileList_2 = [fileList[fileList.length - 1]] //展示最后一次选择文件
         this.receptionImage = URL.createObjectURL(file.raw);
         if (this.fileList_2) {
           var formData = new FormData()
          //  formData.append('dotCode', this.dotCode)
            formData.append('file', this.fileList_2[0].raw)
            this.apiUploadImg(formData,2)
          } else {
            this.$message({ message: '请上传图片!' })
          }
      }
    },
    handleChange3(file, fileList) {
      if(fileList.length>0){
         this.fileList_3 = [fileList[fileList.length - 1]] //展示最后一次选择文件
         this.constructionImage = URL.createObjectURL(file.raw);
        //  console.log(this.itemObj.constructionImage);
          if (this.fileList_3) {
            var formData = new FormData()
            // formData.append('dotCode', this.dotCode)
            formData.append('file', this.fileList_3[0].raw)
            this.apiUploadImg(formData,3)
          } else {
            this.$message({ message: '请上传图片!' })
          }
      }
    },
    handleChange4(file, fileList) {
      if(fileList.length>0){
         this.fileList_4 = [fileList[fileList.length - 1]] //展示最后一次选择文件
         this.trafficImage = URL.createObjectURL(file.raw);
          if (this.fileList_4) {
            var formData = new FormData()
            // formData.append('dotCode', this.dotCode)
            formData.append('file', this.fileList_4[0].raw)
            this.apiUploadImg(formData,4)
          } else {
            this.$message({ message: '请上传图片!' })
          }
      }
    },
    handleChange5(file, fileList) {
      if(fileList.length>0){
         this.fileList_5 = [fileList[fileList.length - 1]] //展示最后一次选择文件
         this.honorImage = URL.createObjectURL(file.raw);
         if (this.fileList_5) {
           var formData = new FormData()
          //  formData.append('dotCode', this.dotCode)
            formData.append('file', this.fileList_5[0].raw)
            this.apiUploadImg(formData,5)
          } else {
            this.$message({ message: '请上传图片!' })
          }
      }
    },
    handleChange6(file, fileList) {
      if(fileList.length>0){
         this.fileList_6 = [fileList[fileList.length - 1]] //展示最后一次选择文件
         this.businessImage = URL.createObjectURL(file.raw);
         if (this.fileList_6) {
           var formData = new FormData()
          //  formData.append('dotCode', this.dotCode)
            formData.append('file', this.fileList_6[0].raw)
            this.apiUploadImg(formData,6)
          } else {
            this.$message({ message: '请上传图片!' })
          }
      }
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt5M = file.size / 1024 / 1024 < 5

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!')
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!')
        }
        return isJPG && isLt5M;
    },
  }
}
</script>

<style lang="less" scoped>
.phone_color{
  color: #f00;
  display: block;
  line-height: 20px;

}
.picker_tiem{
  /deep/.el-date-editor .el-range-input{
    width: auto;
  }
}
.fuwu_xan{
  padding: 0px 20px;
  .xian_type{
    .input_checkbox{
      width: 100%;
      padding-left: 20px;
    }
  }
}
// 地图样式
.con-map {
  height: 190px;
  width: 100%;
}
.con-box {
  .mapbox {
    margin-bottom: 10px;
    z-index: 111;
    width: 100%;
    height: 280px;
    padding: 10px 0;
    // background: #eceeee;

    .map {
      width: 100%;
      height: 280px;
    }
  }

  .Hlist-box {
    width: 96%;
    margin: 0 auto;

    background: #fff;
    border-radius: 5px;
    li {
      height: 40px;
      padding: 14px 22px;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      align-items: center;
      cursor: pointer;
      b {
        display: inline-block;
      }
      div {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 15px;
        display: inline-block;
        width: 90%;
        // margin-top: 50px;
      }
      p {
        // margin-bottom: 50px;
        padding: 0;
        margin: 0;
        color: #a6a6a6;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 13px;
        width: 90%;
      }
    }
  }
}
.mymapM {
  .search-box {
    height: 48px;

    line-height: 48px;
    background: #fff;

    border-bottom: 1px solid #bfbec4;

    .search-postion {
      height: 48px;
      line-height: 48px;
      background: #fff;
      border-bottom: 1px solid #bfbec4;
      width: 100%;
      z-index: 99999;
      display: flex;
      align-items: center;
      input {
        flex: 4;
        height: 14px;
        padding: 16px 0;
        border: none;

        text-indent: 10px;
      }
      .clear {
        margin: 2px 6px;
      }
      .buts {
        width: 15%;
        text-align: center;
        display: inline-block;
        flex: 1;
      }
      .border_but {
        border-left: 1px solid #8f8f8f;
        height: 14px;
        line-height: 14px;
        margin: 17px 0;
      }
    }
  }
  .search-list {
    width: 96%;
    margin: 0 auto;
    margin-top: 10px;
    border-radius: 5px;
    background: #fff;
    .listnodata{
      margin-bottom: 70px;
      >p{
        text-align: center;
      }
    }
    li {
      height: 40px;
      padding: 14px 22px;
      border-bottom: 1px solid #d9d9d9;
      display: flex;
      align-items: center;
      cursor: pointer;
      span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 15px;
        display: inline-block;
        width: 90%;
        text-align: center;
      }
      p {
        // margin-top: 10px;
        // text-align: center;
        color: #a6a6a6;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 13px;
        width: 90%;
      }
    }
  }
}
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99999999;
}
</style>

<style lang="less" scoped>
.itembor{
  /deep/.el-input__inner{
    border-color: #F56C6C;
  }
}
.formspan{
  position: relative;
  .spanbtn{
    position: absolute;
    top: 28px;
    left: 0;
    z-index: 100;
  }
}
.title{
  font-size: 18px;
  font-weight: 600;
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
    .item{
      position: relative;
      // float: left;
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
        margin-top: 10px;
      }
      .btn{
        margin-top: 3px;
      }
    }
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
 .lnglatText{
   display: block;
   padding: 0 10px;
   width: 210px;
   color: #ccc;
   border: 1px solid #ccc;
   border-radius: 5px;
   text-align: center;
 }
</style>
