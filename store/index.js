import Vue from 'vue'
import Vuex, {
	createLogger
} from 'vuex'

Vue.use(Vuex) // vue的插件机制
const debug = process.env.NODE_ENV === 'development' // 开发环境

// 过滤默认配置
const screenConfig = {
	purity: ["SFW"],
	sort: "date_added",
	atleast: "",
	q: ""
}

function setStorage(key, data = "", success = () => {}, fail = () => {}) {
	if (key !== undefined && data !== undefined) {
		uni.setStorage({
			key,
			data,
			success,
			fail
		});
	}
}

function getData(key, def, cb) {
	const val = uni.getStorageSync(key)
	if (cb !== undefined && typeof cb === "function") {
		cb(val)
	}
	if (val === "") {
		return def
	}
	return val
}

const store = new Vuex.Store({
	state: {
		$index: 0, // 用于图片定位
		$imgList: [], // 图片数据列表 , detail页面
		$know: getData("know", true), // 是否显示弹窗
		$screen: getData("screen", screenConfig, (res) => {
			if (res === "") setStorage("screen", screenConfig)
		}), // 图片过滤配置
		$searchHistory: getData("searchHistory", []), // 搜索历史
		$downDoneFile: getData("downDoneFile", []), // 存放完成下载列表
		$collection: getData("collection", []), // 存放收藏列表
		$history: getData("history", []), // 存放历史记录
	},
	mutations: {
		SET_SCREEN(state, {
			key,
			val
		}) {
			state.$screen[key] = val
			setStorage('screen', state.$screen)
		},
		SET_OBJ_SCREEN(state, obj) {
			state.$screen = obj
			setStorage('screen', state.$screen)
		},
		DEL_STORAGE_SCREEN(state) {
			state.$screen = screenConfig
			uni.removeStorageSync("screen")
			setStorage('screen', screenConfig)
		},
		SET_KNOW(state, bool) {
			state.$know = bool
		},
		SET_STORAGE_KNOW(state, bool) {
			state.$know = bool
			setStorage('know', bool)
		},
		DEL_STORAGE_KNOW(state) {
			state.$know = true
			uni.removeStorageSync("know")
		},
		SET_SEARCH_HISTORY(state, arr) {
			state.$searchHistory = arr
			setStorage("searchHistory", state.$searchHistory)
		},
		SET_UNSHIFT_SEARCH_HISTORY(state, obj) {
			state.$searchHistory.unshift(obj)
			setStorage("searchHistory", state.$searchHistory)
		},
		DEL_ALL_SEARCH_HISTORY(state) {
			state.$searchHistory = []
			uni.removeStorageSync("searchHistory")
		},
		SET_IMGLIST(state, list) {
			state.$imgList = list
		},
		SET_INDEX(state, index) {
			state.$index = index
		},
		SET_DOWN_DONE_FILE(state, obj) {
			state.$downDoneFile.unshift(obj)
			setStorage('downDoneFile', state.$downDoneFile)
		},
		DEL_DOWN_DONE_FILE(state, name) {
			state.$downDoneFile.find((item, index) => {
				if (item.path === name) {
					state.$downDoneFile.splice(index, 1)
					return true
				}
			})
			setStorage('downDoneFile', state.$downDoneFile)
		},
		DEL_ALL_DOWN_DONE_FILE(state) {
			state.$downDoneFile = []
			uni.removeStorageSync("downDoneFile")
		},
		SET_COLLECTION(state, obj) {
			state.$collection.unshift(obj)
			setStorage('collection', state.$collection)
		},
		DEL_COLLECTION(state, name) {
			state.$collection.find((item, index) => {
				if (item.path === name) {
					state.$collection.splice(index, 1)
					return true
				}
			})
			setStorage('collection', state.$collection)
		},
		DEL_ALL_COLLECTION(state) {
			state.$collection = []
			uni.removeStorageSync("collection")
		},
		SET_HISTORY(state, val) {
			if (state.$history.some(ele => ele === val)) {
				state.$history.find((value, index, arr) => {
					if (value === val) {
						state.$history.splice(index, 1);
						state.$history.unshift(val)
						return true
					}
				})
			} else {
				state.$history.unshift(val)
			}
			setStorage('history', state.$history)
		},
		DEL_All_HISTORY(state) {
			state.$history = []
			uni.removeStorageSync("history")
		},
	},
	getters: {
		screen: (state) => state.$screen,
		history: state => state.$history,
	},
	plugins: debug ? [createLogger()] : []
})
/* 
 state：VueX的数据中心，相当于vue中的data。
 getter：返回对state数据的装饰，相当于vue中的computed。<例：返回格式化后的时间、返回多个state数据的计算结果>
 */

export default store
