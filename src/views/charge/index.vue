<template>
  <div class="charge">
      <div class="noData">该页面已废弃，调试专用页面。。。</div>

      <!-- <div class="info">
          <div>
            <span>序号</span>
            <span>班级</span>
            <span>性别</span>
            <span>课程</span>
            <span>分数</span>
            <span>年份</span>
          </div>
          <div v-for="(v,index) in data" :key="index">
            <span>{{index+1}}</span>
            <span>{{v.a}}</span>
            <span>{{v.b}}</span>
            <span>{{v.c}}</span>
            <span>{{v.d}}</span>
            <span>{{v.e}}</span>
          </div>
      </div>
      <div class="info" style="margin-top: 50px;">
          <div>
            <span>序号</span>
            <span>班级</span>
            <span>性别</span>
            <span>总分</span>
          </div>
          <div>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
      </div> -->
  </div>
</template>

<script>
export default {
    data(){
      return{
        data: [],
        data2: []
      }
    },
    mounted(){
      var data = [
        {
          a: "2班",
          b: "男",
          c: "数学",
          d: 46,
          e: 2015
        },
        {
          a: "1班",
          b: "女",
          c: "英语",
          d: 67,
          e: 2015
        },
        {
          a: "1班",
          b: "男",
          c: "数学",
          d: 78,
          e: 2015
        }
      ]
      this.data = data
      var oneB = []
      var oneA = []
      var twoB = [] 
      var twoA = [] 
      data.forEach(v=>{
        if(v.a == "1班" && v.b == "男"){
          oneA.push(v.d)
        }
        if(v.a == "1班" && v.b == "女"){
          oneB.push(v.d)
        }
        if(v.a == "2班" && v.b == "女"){
          twoB.push(v.d)
        }
        if(v.a == "2班" && v.b == "男"){
          twoA.push(v.d)
        }
      })
    var oneA = this.sum(oneA)
    var oneB = this.sum(oneB)
    var twoB = this.sum(twoB)
    var twoA = this.sum(twoA)
    this.data2 = [oneA,oneB,twoA,twoB]
    },
    methods: {
     sum(arr) {
          var s = 0;
          for (var i=arr.length-1; i>=0; i--) {
              s += arr[i];
          }
          return s;
      }
    }
}
</script>

<style lang="less" scoped>
.info >div{
  display: flex;
  padding-left: 5px;
  &:nth-child(1){
    >span{
      border-top: 1px solid #000;
    }
  }
  >span{
    &:nth-child(1){
      border-left: 1px solid #000;
    }
    display: block;
    width: 60px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
    padding-left: 10px;
  }
}
.noData{
  margin: 30px 40px;
}
</style>