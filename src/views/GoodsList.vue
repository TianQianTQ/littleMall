<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:;" class="price" @click="sortGoods()">Price <svg class="icon icon-arrow-short" v-bind:class="{'sort-up':!sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">All</a></dd>
                <dd v-for="(price,index) in priceFilter">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'./static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn-m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div  class="view-more-normal" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                  <img src="./../assets/loading-spinning-bubbles.svg" alt="" v-show="loading"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
        <p slot="message">
          请先登录,否则无法加入到购物车中!
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
        </div>
      </modal>
      <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功~</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
          <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
        </div>
      </modal>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <nav-footer></nav-footer>
    </div>
</template>
<script type="text/ecmascript-6">
    import './../assets/css/base.css'
    import './../assets/css/product.css'
    import NavHeader from '@/components/Header.vue'
    import NavFooter from '@/components/Footer.vue'
    import NavBread from '@/components/NavBread.vue'
    import Modal from '@/components/Modal.vue'
    import axios from 'axios'
    export default{
      data:function(){
      return {
        goodsList:[],
        priceFilter:[
          {
            startPrice: '0.00',
            endPrice: '100.00'
          },{
            startPrice:'100.00',
            endPrice:'500.00'
          },{
            startPrice:'500.00',
            endPrice:'1000.00'
          },{
            startPrice:'1000.00',
            endPrice:'5000.00'
          }

        ],
        priceChecked:'all',
        filterBy:false,
        overLayFlag:false,
        sortFlag:true,
        page:1,
        pageSize:8,
        busy:true,             //加载中
        loading:false,
        mdShow:false,
        mdShowCart:false
      }
     },
      components:{
        NavHeader:NavHeader,
        NavFooter:NavFooter,
        NavBread:NavBread,
        Modal:Modal,
      },
      mounted:function(){
       this.getGoodsList();
      },
      methods:{
        getGoodsList:function(flag){
          var param={
            page:this.page,
            pageSize:this.pageSize,
            sort:this.sortFlag?1:-1,
            priceLevel:this.priceChecked
          }
          this.loading=true;
          axios.get("/goods/list",{
            params:param
          }).then((response) =>{
            let res = response.data;
            this.loading=false;
            if (res.status == "0") {
              if(flag){
                this.goodsList = this.goodsList.concat(res.result.list);    //连接之前的数据
                if(res.result.count==0){
                  this.busy=true;
                }else{
                  this.busy=false;
                }
              }else{
                this.goodsList =res.result.list;
                this.busy=false;
              }
            } else {
              this.goodsList = [];
            }
          })
        },
        sortGoods:function(){
          this.sortFlag=!this.sortFlag;
          this.page=1;              //每次排序之后重新从第一页加载
          this.getGoodsList();
        },
        loadMore:function(){
            this.busy=true;
            setTimeout(() => {
              this.page++;
              this.getGoodsList(true);
            }, 1000);
        },
        showFilterPop:function(){
            this.filterBy=true;
            this.overLayFlag=true;
        },
        closePop:function(){
          this.filterBy=false;
          this.overLayFlag=false;
          this.mdShowCart = false;
        },
        setPriceFilter:function(index){
          this.priceChecked=index;
          this.closePop();
          this.page=1;
          this.getGoodsList();
        },
        addCart:function(productId){
          axios.post("/goods/addCart",{
            productId:productId
          }).then((response)=>{
            var res = response.data;
            if(res.status==0){
              this.mdShowCart = true;  //显示弹框（加入购物车成功）
              this.$store.commit('updateCartCount',1);
            }else{
              this.mdShow = true;    //显示弹框（未登录）
            }
          })
        },
        closeModal:function(){
          this.mdShow = false;
          this.mdShowCart=false;
        }
      }
    }
</script>
