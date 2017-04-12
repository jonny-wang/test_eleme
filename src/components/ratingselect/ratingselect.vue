<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive" :class="{'active': selectTypeSub === 2}" @click="select(2, $event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active': selectTypeSub === 0}" @click="select(0, $event)">{{desc.positive}}<span class="count">{{positives}}</span></span>
      <span class="block negative" :class="{'active': selectTypeSub === 1}" @click="select(1, $event)">{{desc.negative}}<span class="count">{{negatives}}</span></span>
    </div>
    <div class="switch" :class="{'on': onlyContentSub}" @click="toggleContent">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  import { eventHub } from 'common/js/eventHub.js'
  // 定义正向负面和所有0、1、2对应selectType
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  export default {
    // 组件要维护的props
    props: {
      ratings: {
        type: Array,
        default() {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        // 能看到所有的
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    data() {
      return {
        // 一开始赋初值
        selectTypeSub: this.selectType,
        onlyContentSub: this.onlyContent
      }
    },
    computed: {
      // 只要改变就会重计算
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        }).length
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        }).length
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
          return
        }
        // 不要直接去该selectType会影响父组件用计算属性
        this.selectTypeSub = type
        // 传递给父组件
        eventHub.$emit('ratingtype.select', type)
      },
      toggleContent(event) {
        if (!event._constructed) {
          return
        }
        this.onlyContentSub = !this.onlyContentSub
        eventHub.$emit('content.toggle', this.onlyContentSub)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        line-height: 16px
        margin-right: 8px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          font-size: 8px
          margin-left: 2px
        &.positive
          background: rgba(0, 160, 220 , 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        vertical-align: top
        font-size: 12px
</style>
