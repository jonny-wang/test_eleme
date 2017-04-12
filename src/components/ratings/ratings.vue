<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
    	<div class="overview">
    		<div class="overview-left">
    			<h1 class="score">{{seller.score}}</h1>
    			<div class="title">综合评分</div>
    			<div class="rank">高于周边商家{{seller.rankRate}}</div>
    		</div>
    		<div class="overview-right">
    			<div class="score-wrapper">
    				<span class="title">服务态度</span>
						<v-star :size="36" :score="seller.serviceScore"></v-star>
						<span class="score">{{seller.serviceScore}}</span>
    			</div>
    			<div class="score-wrapper">
    				<span class="title">商品评分</span>
						<v-star :size="36" :score="seller.foodScore"></v-star>
						<span class="score">{{seller.foodScore}}</span>
    			</div>
    			<div class="delivery-wrapper">
    				<!-- 文字和文字默认垂直方向对其，不用vertical-align -->
    				<!-- 图片和文字不一样的解构，vertical-align: top垂直对其 -->
    				<span class="title">送达时间</span>
    				<span class="delivery">{{seller.deliveryTime}}分钟</span>
    			</div>
    		</div>
    	</div>
    	<v-split></v-split>
    	<v-ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></v-ratingselect>
    	<div class="rating-wrapper">
    		<ul>
    			<li class="rating-item border-1px" v-for="rating in ratings" v-show="needShow(rating.rateType, rating.text)">
    				<div class="avatar">
    					<img :src="rating.avatar" width="28" height="28" alt="">
    				</div>
    				<div class="content">
    					<h1 class="name">{{rating.username}}</h1>
    					<div class="star-wrapper">
    						<v-star class="star" :size="24" :score="rating.score"></v-star>
    						<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
    					</div>
    					<p class="text">{{rating.text}}</p>
    					<div class="recommend" v-show="rating.recommend.length">
    						<i class="icon-thumb_up" ></i>
    						<span v-for="item in rating.recommend" class="item">{{item}}</span>
    					</div>
    					<div class="time">
    						{{rating.rateTime | formatDate}}
    					</div>
    				</div>
    			</li>
    		</ul>
    	</div>
    </div>
  </div>
</template>

<script>
	import BScroll from 'better-scroll'
	import star from 'components/star/star'
  import split from 'components/split/split'
  import ratingselect from 'components/ratingselect/ratingselect'
  import { formatDate } from 'common/js/date'
  import { eventHub } from 'common/js/eventHub.js'

  const ALL = 2
  const ERR_OK = 0
  export default {
  	props: {
  		seller: {
  			type: Object
  		}
  	},
  	data() {
  		return {
  			ratings: [],
  			showFlag: false,
	      // 依赖追踪评价
	      selectType: ALL,
	      onlyContent: false,
	      desc: {
	        all: '全部',
	        positive: '推荐',
	        negative: '吐槽'
	      }
  		}
  	},
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      }
    },
  	components: {
  		'v-star': star,
  		'v-split': split,
  		'v-ratingselect': ratingselect
  	},
    created() {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body
        if (response.errno === ERR_OK) {
          this.ratings = response.data
          this.$nextTick(() => {
          	this.scroll = new BScroll(this.$refs.ratings, {
          		click: true
          	})
          })
        }
      })
      eventHub.$on('ratingtype.select', (type) => {
        this.selectType = type
        this.$nextTick(() => {
          // vue的dom更新是异步的放在一个队列里
          this.scroll.refresh()
        })
      })
      eventHub.$on('content.toggle', (onlyContent) => {
        this.onlyContent = onlyContent
        this.$nextTick(() => {
          // vue的dom更新是异步的放在一个队列里
          this.scroll.refresh()
        })
      })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin"
	.ratings
		// 固定视口高度,BScroll
		position: absolute
		top: 174px
		bottom: 0
		left: 0
		width: 100%
		overflow: hidden
		.overview
			display: flex
			padding: 18px 0
			.overview-left
				flex: 0 0 137px
				padding: 6px
				width: 137px
				border-right: 1px solid rgba(7, 17,27, 0.1)
				text-align: center
				@media only screen and (max-width: 320px)
					flex: 0 0 129px
					width: 120px
				.score
					margin-bottom: 6px
					line-height: 28px
					font-size: 24px
					color: rgb(255, 153, 0)
				.title
					margin-bottom: 8px
					line-height: 12px
					font-size: 12px
					color: rgb(7, 17, 27)
				.rank
					line-height: 10px
					font-size: 10px
					color: rgb(147, 153, 159)
			.overview-right
				flex: 1
				padding: 6px 0 0 24px
				@media only screen and (max-width: 320px)
					padding-left: 6px
				.score-wrapper
					margin-bottom: 8px
					font-size: 0
					.title
						display: inline-block
						vertical-align: top
						line-height: 18px
						font-size: 12px
						color: rgb(7, 17, 27)
					.star
						display: inline-block
						vertical-align: top
						margin: 0 12px
					.score
						// 居中对其
						display: inline-block
						vertical-align: top
						line-height: 18px
						font-size: 12px
						color: rgb(255, 153, 0)
				.delivery-wrapper
					font-size: 0
					.title
						line-height: 18px
						font-size: 12px
						color: rgb(7, 17, 27)
					.delivery
						margin-left: 12px
						color: rgb(147, 153, 159)
						font-size: 12px
		.rating-wrapper
			padding: 0 18px
			.rating-item
				display: flex
				padding: 18px 0
				border-1px(rgba(7, 17, 27, 0.1))
			.avatar
				flex: 0 0 28px
				width: 28px
				margin-right: 12px
				img
					border-radius: 50%
			.content
				position: relative
				flex: 1
				.name
					margin-bottom: 4px
					line-height: 12px
					font-size: 10px
					color: rgb(7, 17, 27)
				.star-wrapper
					margin-bottom: 6px
					font-size: 0
					.star
						display: inline-block
						vertical-align: top
						margin-right: 6px
					.delivery
						display: inline-block
						vertical-align: top
						line-height: 12px
						font-size: 10px
						color: rgb(147, 153, 159)
				.text
					margin-bottom: 8px
					line-height: 18px
					color: rgb(7, 17, 27)
					font-size: 12px
				.recommend
					line-height: 16px
					font-size: 0
					.icon-thumb_up, .item
						display: inline-block
						margin: 0 8px 4px 0
						font-size: 9px
					.icon-thumb_up
						color: rgb(0, 160, 220)
					.item
						padding: 0 6px
						border: 1px solid rgba(7, 17, 27, 0.1)
						border-radius: 1px
						color: rgb(147, 153, 159)
						background: #fff
				.time
					position: absolute
					top: 0
					right: 0
					line-height: 12px	
					font-size: 10px
					color: rgb(147, 153, 159)
</style>
