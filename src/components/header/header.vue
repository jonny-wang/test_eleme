<template>
  <div class="header">
    <div class="content-wrapper">
    	<div class="avatar">
    		<img width="64" height="64" :src="seller.avatar" alt="">
    	</div>
    	<div class="content">
    		<div class="title">
    			<span class="brand"></span>
    			<span class="name">{{seller.name}}</span>
    		</div>
    		<div class="description">
    			{{seller.description}}/{{seller.deliveryTime}}分钟送达
    		</div>
    		<div class="support" v-if="seller.supports">
    			<span class="icon" :class="classMap[seller.supports[0].type]"></span>
    			<span class="text">{{seller.supports[0].description}}</span>
    		</div>
    		<div v-if="seller.supports" class="support-count" @click="showDetail">
    			<span class="count">{{seller.supports.length}}个</span>
    			<i class="icon-keyboard_arrow_right"></i>
    		</div>
    	</div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
    	<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
    	<i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
    	<img :src="seller.avatar" alt="" width="100%" height="100%">
    </div>
    <!-- 过度效果加transition起个name，最终会加在.detail上所以样式还是写在.detail上 -->
    <transition name="fade">
	    <div class="detail" v-show="detailShow">
	    	<div class="detail-wrapper clearfix aaa">
	    		<div class="detail-main">
	    			<h1 class="name">{{seller.name}}</h1>
	    			<div class="star-wrapper">
	    				<v-star :size="48" :score="seller.score"/></v-star>
	    			</div>
	    			<div class="title">
	    				<div class="line"></div>
	    				<div class="text">优惠信息</div>
	    				<div class="line"></div>
	    			</div>
	    			<ul class="supports" v-if="seller.supports">
	    				<li class="support-item" v-for="item in seller.supports">
	    					<span class="icon" :class="classMap[item.type]"></span>
	    					<span class="text">{{item.description}}</span>
	    				</li>
	    			</ul>
	    			<div class="title">
	    				<div class="line"></div>
	    				<div class="text">商家公告</div>
	    				<div class="line"></div>
	    			</div>
	    			<div class="bulletin">
	    				<p class="content">{{seller.bulletin}}</p>
	    			</div>
	    		</div>
	    	</div>
	    	<div class="detail-close" @click="hideDetail">
	    		<i class="icon-close"></i>
	    	</div>
	    </div>
    </transition>
  </div>
</template>

<script>
	import star from 'components/star/star'
  export default {
  	props: {
  		seller: {
  			type: Object
  		}
  	},
  	data() {
  		return {
  			detailShow: false
  		}
  	},
  	methods: {
  		showDetail() {
  			this.detailShow = true
  		},
  		hideDetail() {
  			this.detailShow = false
  		}
  	},
  	created() {
  		this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  	},
  	components: {
  		'v-star': star
  	}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
	// 不可以写成common因为那个配置是js
	@import "../../common/stylus/mixin"
	.header
		position: relative
		overflow: hidden
		color: #fff
		background: rgba(7, 17, 27, 0.5)
		.content-wrapper
			position: relative
			padding: 24px 12px 18px 24px
			// 去除间隙但子元素要设置大小
			font-size: 0
			.avatar
				display: inline-block
				vertical-align: top
				img
					border-radius: 2px
			.content
				display: inline-block
				margin-left: 16px
				.title
					margin: 2px 0 8px 0
					.brand
						display: inline-block
						width: 30px
						height: 18px
						// 垂直向上齐
						vertical-align: top
						bg-image('brand')
						background-size: 30px 18px
						background-repeat: no-repeat
					.name
						margin-left: 6px
						font-size: 16px
						line-height: 18px
						font-weight: bold
				.description
					margin-bottom: 10px
					line-height: 12px
					font-size: 12px
				.support
					.icon
						display: inline-block
						width: 12px
						height: 12px
						vertical-align: top						
						margin-right: 10px
						background-size: 12px 12px
						background-repeat: no-repeat
						// 当前的子样式
						&.decrease
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.guarantee
							bg-image('guarantee_1')
						&.invoice
							bg-image('invoice_1')
						&.special
							bg-image('special_1')
					.text
						// css书写规则影响到宽高的写在前面
						line-height: 12px
						// chrome最小字体12如果用手机正常
						font-size: 10px
			.support-count
				position: absolute
				right: 12px
				bottom: 18px
				padding: 0 8px
				height: 24px
				line-height: 24px
				border-radius: 14px
				background: rgba(0, 0, 0, 0.2)
				text-align: center
				.count
					font-size: 10px
				.icon-keyboard_arrow_right
					margin-left: 2px
					line-height: 24px
					font-size: 10px
		.bulletin-wrapper
			position: relative
			height: 28px
			line-height: 28px
			padding: 0 22px 0 12px
			// 两个sapn中间白，或者将两个中间空格删
			// font-size: 0
			// 文字超出显...
			white-space: nowrap
			overflow: hidden
			text-overflow: ellipsis
			background: rgba(7, 17, 27, 0.2)
			.bulletin-title
				display: inline-block
				vertical-align: top
				margin-top: 8px
				width: 22px
				height: 12px
				bg-image('bulletin')
				background-size: 22px 12px
				background-repeat: no-repeat
			.bulletin-text
				font-size: 10px
				margin: 0 4px
				vertical-align: top
			.icon-keyboard_arrow_right
					position: absolute
					right: 9px
					top: 8px
					font-size: 10px
		.background
			position: absolute
			top: 0
			left: 0
			width: 100%
			height: 100%
			z-index: -1
			// 加滤镜blur模糊，下面会有阴影
			filter: blur(10px)
		// sticky-footer
		.detail
			position: fixed
			top: 0
			left: 0
			z-index: 100
			width: 100%
			height: 100%
			overflow: auto
			// 最终展现效果
			opacity: 1
			background: rgba(7, 17, 27, 0.8)
			// 背景模糊效果只有在ios上能实现
			backdrop-filter: blur(10px)
			// 用多长时间干什么事情 transiton animate
			&.fade-enter-active, &.fade-leave-active
				// 过渡时间制定
				transition: all 0.5s
			// 进入前的状态和离开后的状态
			// 进入是指显示 离开是指隐藏
			&.fade-enter, &.fade-leave-active
				opacity: 0
				background: rgba(7, 17, 27, 0)
			.detail-wrapper
				width: 100%
				min-height: 100%
				.detail-main
					margin-top: 64px
					// padding是必须的也就是给下面预留的位置
					padding-bottom: 64px
					.name
						line-height: 16px
						text-align: center
						font-size: 16px
						font-weight: 700
					.star-wrapper
						margin-top: 18px
						padding: 2px 0
						text-align: center
					.title
						// vue-loader在编译.vue会使用postcss工具解决兼容性
						// caniuse.com
						display: flex
						width: 80%
						margin: 28px auto 24px auto
						.line
							flex: 1
							position: relative
							top: -6px
							border-bottom: 1px solid rgba(255, 255, 255, 0.2)
						.text
							padding: 0 12px
							font-weight: 700
							font-size: 14px
					.supports
						width: 80%
						margin: 0 auto
						.support-item
							padding: 0 12px
							margin-bottom: 12px
							font-size: 0
							&:last-child
								margin-bottom: 0
							.icon
								display: inline-block
								width: 16px
								height: 16px
								vertical-align: top
								margin-right: 6px
								background-size: 16px 16px
								background-repeat: no-repeat
								// 当前的子样式
								&.decrease
									bg-image('decrease_2')
								&.discount
									bg-image('discount_2')
								&.guarantee
									bg-image('guarantee_2')
								&.invoice
									bg-image('invoice_2')
								&.special
									bg-image('special_2')
							.text
								line-height: 16px
								font-size: 12px
					.bulletin
						width: 80%
						margin: 0 auto
						.content
							padding: 0 12px
							line-height: 24px
							font-size: 12px
			.detail-close
				position: relative
				width: 32px
				height: 32px
				// 因为上面满屏不会占用
				margin: -64px auto 0 auto
				clear: both
				font-size: 32px
</style>
