<template>
  <div class="lobby">
      <el-dialog
      :title="text"
      :visible.sync="visibleLobby"
      width="60%"
      @close="close"
      center>
        <el-divider content-position="left"><span class="title">基本信息</span></el-divider>
        <div class="query clearFix" style="padding-top:30px;margin-bottom:30px;">
          fsf 
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visibleLobby = false">取 消</el-button>
       <el-button type="primary" :loading="loadingBootm" @click="visibleDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    props: {
        text: {
          type: String,
          default: '大厅信息'
        },
        visibleLobby: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        // Lobby : {
        //      get: () => this.visibleLobby,
        //      set: (value) =>  this.$emit('childByValue', value)
        //     // return this.visibleLobby
        // }
    },
    data(){
        return{
            // Lobby: this.visibleLobby,
            loadingBootm: false
        }
    },
    watch: {
         
    },
    mounted(){
        // this.$store.dispatch('value/valueX', 'aaaa')
        // console.log(this.$store.getters.value);
        // console.log(a);
        // console.log(this.visibleLobby);
    },
    methods: {
        visibleDialog(){

        },
        close(){
            // this.$emit('childByValue', false)
        }
    }
}
</script>

<style>

</style>