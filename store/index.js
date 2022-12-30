import Vue from 'vue'
import Vuex, {
	createLogger
} from 'vuex'

Vue.use(Vuex)
const debug = process.env.NODE_ENV === 'development'

// 过滤默认配置
const filterConfig = {
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

function getStorage(key, def, cb) {
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
		$index: 0, // detail页图片定位， 
		$imgList: [], // detail页图片数据
		$know: getStorage("know", true), // 是否显示弹窗
		$filter: getStorage("filter", filterConfig, (res) => {
			if (res === "") setStorage("filter", filterConfig)
		}), // 配置
		$searchHistory: getStorage("searchHistory", []), // 搜索历史
		$downDoneFile: getStorage("downDoneFile", []), // 存放完成下载列表
		$collection: getStorage("collection", []), // 存放收藏列表
		$history: getStorage("history", []), // 存放历史记录
	},
	mutations: {
		SET_THEME(state, themeName = "light") {
			state.themeName = themeName
		},
		SET_FILTER(state, {
			key,
			val
		}) {
			state.$filter[key] = val
			setStorage('filter', state.$filter)
		},
		SET_FILTER_OBJ(state, obj) {
			state.$filter = obj
			setStorage('filter', state.$filter)
		},
		DEL_STORAGE_FILTER(state) {
			state.$filter = filterConfig
			uni.removeStorageSync("filter")
			setStorage('filter', filterConfig)
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
		filter: (state) => state.$filter,
		history: state => state.$history,
	},
	plugins: debug ? [createLogger()] : []
})

export default store
