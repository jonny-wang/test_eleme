<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
        <!-- <a v-link="{path: '/goods'}">商品</a> -->
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
        <!-- <a v-link="{path: '/ratings'}">评价</a> -->
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
        <!-- <a v-link="{path: '/seller'}">商家</a> -->
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import header from 'components/header/header'

  const ERR_OK = 0

  export default {
    data() {
      return {
        seller: {
          id: this.$route.query.id
        }
      }
    },
    created() {
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          // 里面没有id
          // this.seller = response.data
          // 在this.seller基础上添加response.data其他属性，extend
          // vue推荐给对象拓展属性
          this.seller = Object.assign({}, this.seller, response.data)
        }
      })
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  // webpack特性可以在js里import样式
  @import './common/stylus/base'
  @import './common/stylus/mixin'
  .tab 
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color:  rgb(77, 85, 93)
        &.active
          color:  rgb(240, 20, 20)
</style>
