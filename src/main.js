// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import infiniteScroll  from 'vue-infinite-scroll'
import VueLazyLoad from 'vue-lazyload'
import axios from 'axios'
import Vuex from 'vuex'
Vue.config.productionTip = false;
import {currency} from './util/currency'        //货币格式化
/*eslint-disable no-new*/

Vue.filter("currency",currency);
//状态管理
Vue.use(Vuex);


/*滚动插件*/
Vue.use(infiniteScroll);
/*图片懒加载*/
Vue.use(VueLazyLoad,{
loading:"/static/loading-svg/loading-balls.svg"                     //效果
});

const store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{    //更新用户状态
    updateUserInfo(state,nickName){
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    }
  }
});

new Vue({
  el:"#app",
  store,               //注册之后vue所有子组件都具备vuex功能
  router,
  template:'<App/>',    //模板
  components:{App},      //组件
  mounted:function(){
    this.checkLogin();
    this.getCartCount();
  },
  methods:{
    checkLogin:function(){
      axios.get('/users/checkLogin').then((res)=>{
        var res = res.data;
        if(res.status=='0'){
          this.$store.commit('updateUserInfo',res.result);
        }else{
          if(this.$store.path!='/goods'){
            this.$router.push('/');
          }
        }
      })
    },
    getCartCount:function(){
      axios.get('users/getCartCount').then((res)=>{
        var res = res.data;
        if(res.status=='0'){
          this.$store.commit('updateCartCount',res.result);
        }
      })
    }
  }
});
