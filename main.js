import Vue from 'vue'
import App from './App'
// vuex
import store from './store'

import request from "./request/index"

import Down from "./util/down" // 下载模块

// 引入全局uView
import uView from '@/uni_modules/uview-ui'

// 引入图片懒加载

// import lazy from "@/util/lazy.js"
// Vue.use(lazy)
import mixin from './common/mixin'

Vue.prototype.$store = store

Vue.prototype.$request = request

Vue.prototype.$down = Down

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)
// 调用setConfig方法，方法内部会进行对象属性深度合并，可以放心嵌套配置
// 需要在Vue.use(uView)之后执行
//将默认单位改为rpx
uni.$u.config.unit = 'rpx'
/* uni.$u.setConfig({
	// 修改$u.config对象的属性
	config: {
		// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
		unit: 'rpx'
	},
}) */

Vue.mixin(mixin)

const app = new Vue({
	store,
	...App
})

app.$mount()
