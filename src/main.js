// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App'
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'

// webpack特性可以在js里import样式
// import 'common/stylus/index.styl'

Vue.use(VueRouter)
Vue.use(VueResource)

Vue.config.productionTip = false

// 1.0语法
// let app = Vue.extend(App)
// let router = new VueRouter()

// router.map({
// 	'/goods': {
// 		component: goods
// 	},
// 	'/ratings': {
// 		component: ratings
// 	},
// 	'/seller': {
// 		component: seller
// 	}
// })

// router.start(app, '#app')


const routes = [
	{ path: '/', redirect: '/goods' },
  { path: '/goods', component: goods },
  { path: '/ratings', component: ratings },
  { path: '/seller', component: seller }
]

const router = new VueRouter({
	linkActiveClass: 'active', // 被激活显示的class
  routes
})

// 路由要挂在根组件上
new Vue({
	components: {
		App
	},
	template: '<App/>',
  router
}).$mount('#app')
