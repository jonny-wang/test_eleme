<template>
  <div class="cartcontrol" @click.stop>
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop="decreaseCart($event)">
        <i class="icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add" @click.stop="addCart($event)">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { eventHub } from 'common/js/eventHub.js'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
    },
    methods: {
      addCart(event) {
        // 如果event对象是原生的不是构造的那不触发，是通过betterscroll派发一个时间实现点
        if (!event._constructed) {
          return
        }
        // this.food.count变化但props里面的food没有该个字段新增或删除某个字段要用vue接口
        // Vue.set()
        if (!this.food.count) {
          // 给this.food添加一个字段count值1
          Vue.set(this.food, 'count', 1)
          // this.food.count = 1
        } else {
          this.food.count++
        }
        eventHub.$emit('cartAdd', event.target)
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count) {
          this.food.count--
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease, .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
      // 最终状态
      opacity: 1
      transform: translate3d(0, 0, 0)
      transform: rotate(0)
    .cart-decrease
      &.move-enter-active, &.move-leave-active
        // 过渡时间制定
        transition: all 0.4s linear
      // 进入前的状态和离开后的状态
      // 进入是指显示 离开是指隐藏
      &.move-enter, &.move-leave-active
        opacity: 0
        transform: translate3d(24px, 0, 0)
        transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
</style>
