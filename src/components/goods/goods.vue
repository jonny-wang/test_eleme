<template>
  <div class="goods-wrapper">
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li class="menu-item" v-for="(item, index) in goods" :class="{'current': currentIndex === index}" @click="selectMenu(index, $event)">
            <span class="text">
              <span class="icon" :class="classMap[item.type]" v-show="item.type>0"></span>{{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <!-- hook是js选择而本身并没有什么样式 -->
          <li class="food-list food-list-hook" v-for="item in goods">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li class="food-item border-1px" v-for="food in item.foods" @click="selectFood(food, $event)">
                <div class="icon">
                  <img width="57" height="57" :src="food.image" alt="">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <v-cartcontrol :food="food"></v-cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <v-shopcart :selectedFoods="selectedFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-shopcart>
    </div>
    <!-- ref用在组件上可this.$refs.food.子组件方法 -->
    <v-food :food="selectedFood" ref="food"></v-food>
  </div>
</template>

<script>
  // better-scroll支持npm安装由iscroll进化来 BScroll接收dom
  import BScroll from 'better-scroll'
  import shopcart from 'components/shopcart/shopcart'
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import food from 'components/food/food'

  const ERR_OK = 0

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        // 是滚动而不是点击
        isScroll: 1,
        selectedFood: {}
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          // 区间低
          let height1 = this.listHeight[i]
          // 区间高
          let height2 = this.listHeight[i + 1]
          // !height2落在最后一个
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
      },
      selectedFoods() {
        let foods = []
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
    created() {
      // 组件一创建就去拿数据，数据一渲染nextTick就初始化iscroll
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      this.$http.get('/api/goods').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          // vue是异步更新dom
          this.goods = response.data
          // 异步dom并没变化，高度还不对
          // $nextTick相当于ready
          // 当内容高度大于容器高度就可以滚
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
    },
    methods: {
      selectMenu(index, event) {
        // 一开始点击没效果，因为iscroll监听了点击阻止了默认的所以在初始化iscroll初始化可点击
        // 点击会弹出两次index，pc页面一开始不被阻止，避免在点击的时候把事件传过来$event
        // event._constructed自己默认派发事件BScroll为true浏览器原生没有
        if (!event._constructed) {
          return
        }
        // 关闭滚动监
        this.isScroll = 0
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index]
        // 计算属性不能赋值
        // this.currentIndex = index
        this.scrollY = this.listHeight[index]
        this.foodsScroll.scrollToElement(el, 300)
      },
      _initScroll() {
        var _this = this
        // vue获取dom
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          // 在滚动时能实时返回scrollY
          probeType: 3
        })
        // 配合上面的probeType，监听滚动拿到pos.y赋给this.scrollY
        this.foodsScroll.on('scroll', (pos) => {
          if (_this.isScroll) {
            _this.scrollY = Math.abs(Math.round(pos.y))
          }
        })
        this.foodsScroll.on('scrollEnd', () => {
          _this.isScroll = 1
        })
        // scrollY和左边做映射用vue的computed计算
      },
      _calculateHeight() {
        // 可通过原生js方法去选取dom
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        // 每个高度是标题加内容区高度
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        this.$refs.food.show()
      }
    },
    components: {
      'v-shopcart': shopcart,
      'v-cartcontrol': cartcontrol,
      'v-food': food
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .goods
    // 绝对定位视口高度
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    // 不能滚
    overflow: hidden
    .menu-wrapper
      // flex: 等分 宽度不够压缩 固定宽度
      // 不等分不压缩
      flex: 0 0 80px
      // 解决android兼容性
      width: 80px
      background: #f3f5f7
      .menu-item
        // table是垂直居中最好的布局
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          background: #fff
          font-weight: 700
          .text
            border-none
        .icon
          display: inline-block
          width: 12px
          height: 12px
          vertical-align: top
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          // 当前的子样式
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.2))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rbg(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        // 上下margin有重叠效果
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(174, 153, 159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 18px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
