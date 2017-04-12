<template>
  <div class="shopcart-wrapper">
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleList">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount > 0}">
              <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalCount > 0}">￥{{totalPrice}}</div>
          <div class="desc">令需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div class="ball" v-for="ball in balls">
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div class="outer" v-show="ball.show">
              <div class="inner"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectedFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <v-cartcontrol :food="food"></v-cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
  import { eventHub } from 'common/js/eventHub.js'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'

  export default {
    props: {
      // 选中的商品会影响组件变化，计算属性数据驱动好
      selectedFoods: {
        // vue里如果prop是Array或Object那default要是一个函数
        type: Array,
        default() {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        // 购物车弹出层是否折叠
        fold: true
      }
    },
    computed: {
      // 所有商品总价依赖selectedFoods
      totalPrice() {
        let total = 0
        this.selectedFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount() {
        let count = 0
        this.selectedFoods.forEach((food) => {
          count += food.count
        })
        return count
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元配送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return `去结算`
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return 'enough'
        }
      },
      listShow() {
        if (!this.totalCount) {
          // 没有购买商品是折叠太
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            // show不断变化，不能变化一次就创一次，所以判断有没有，有就刷新下
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
        return show
      }
    },
    created() {
      eventHub.$on('cartAdd', (target) => {
        this._drop(target)
      })
    },
    methods: {
      beforeEnter: function (el) {
        // 找到所有show为true的小球做动画
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            // 获取el位置
            // 返回一个矩形对象，包含四个属性：left、top、right和bottom，相对于视口的位置
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            let oInner = el.firstElementChild
            // ball.el是点击的位置
            // el是实际运动的小球
            // 让小球显示出来，设置初始状态
            el.style.display = ''
            el.style.webkitTransform = `translate3D(0, ${y}px, 0)`
            el.style.transform = `translate3D(0, ${y}px, 0)`
            oInner.style.webkitTransform = `translate3D(${x}px, 0, 0)`
            oInner.style.transform = `translate3D(${x}px, 0, 0)`
          }
        }
      },
      enter: function (el, done) {
        /* eslint-disable no-unused-vars */
        // 必须触发重绘，否则画不出来
        let rf = el.offsetHeight
        let oInner = el.firstElementChild
        // 动画完成
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3D(0, 0, 0)'
          el.style.transform = 'translate3D(0, 0, 0)'
          oInner.style.webkitTransform = `translate3D(0, 0, 0)`
          oInner.style.transform = `translate3D(0, 0, 0)`
          setTimeout(function() {
            // done执行了才能执行afterEnter
            done()
          }, 400)
        })
      },
      afterEnter: function (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      _drop(el) {
        // 找balls里面show为false的第一做动画，动画用动画钩
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            // 保存el
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      empty() {
        this.selectedFoods.forEach((food) => {
          food.count = 0
        })
      },
      hideList() {
        this.fold = true
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return
        } else {
          alert(`支付${this.totalPrice}元`)
        }
      }
    },
    components: {
      'v-cartcontrol': cartcontrol
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin'
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          font-size:0
          // 会有空
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          // 移动端流行ie盒模型width包含padding
          box-sizing: border-box
          // 技巧圆
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin-top: 12px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 225, 255, 0.2)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          background: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        .outer
          // 相对于视口fixed
          position: fixed
          left: 32px
          bottom: 22px
          z-index: 200
          // 纵轴先往负的方向走
          transition: all 0.4s cubic-bezier(0.1, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0, 160,220)
            transition: all 0.4s linear
    .shopcart-list
      position: absolute
      // 从下往上显示
      top: 0
      left: 0
      z-index: -1
      width: 100%
      // 相对自身高度
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        // 过渡时间制定
        transition: all 0.2s linear
      // 进入前的状态和离开后的状态
      // 进入是指显示 离开是指隐藏
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        background: #fff
        overflow: hidden
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px
  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    backdrop-filter: blur(10px)
    &.fade-enter-active, &.fade-leave-active
      // 过渡时间制定
      transition: all 0.2s linear
    // 进入前的状态和离开后的状态
    // 进入是指显示 离开是指隐藏
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
