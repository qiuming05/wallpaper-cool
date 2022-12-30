import Vue from 'vue'
import App from './App'
import store from './store'
import mixin from './common/mixin'
import request from "./request/index"
import DownFileList from "./util/down" // 下载模块
import uView from '@/uni_modules/uview-ui' // 引入全局uView
// 引入组件
import circleProgressBar from "@/components/circle-progress-bar/circle-progress-bar.vue"
import footTab from '@/components/foot-tab/foot-tab.vue'
import headBar from "@/components/headbar/headbar.vue"
import imgList from "@/components/img-list/img-list.vue"
import lazyImage from "@/components/lazy-image/lazy-image.vue"
import sidebar from "@/components/sidebar/sidebar.vue"
import swiperPostion from "@/components/swiper-position/swiper-position.vue"

Vue.component('circle-progress-bar', circleProgressBar);
Vue.component('foot-tab', footTab);
Vue.component('headbar', headBar);
Vue.component('img-list', imgList);
Vue.component('lazy-image', lazyImage);
Vue.component('sidebar', sidebar);
Vue.component('swiper-postion', swiperPostion);

Vue.prototype.$store = store
Vue.prototype.$request = request
Vue.prototype.$down = new DownFileList
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
