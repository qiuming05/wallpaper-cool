import store from "@/store/index.js"
import {
	getTime,
	byte
} from "@/util/util.js"

class DownFile {
	constructor(imgInfo) {
		this.imgInfo = imgInfo
		this.events = {
			update: [],
			finish: [],
		};
		this.last = 0
		this.downloadFile = null
		this.down(imgInfo)
	}
	down(imgInfo) {
		this.downloadFile = uni.downloadFile({
			url: imgInfo.path,
			success: (res) => {
				if (res.statusCode === 200) {
					let benUrl = res.tempFilePath
					//图片保存到本地相册
					uni.saveImageToPhotosAlbum({
						filePath: benUrl,
						//授权成功-start，保存图片
						success: function(res) {
							uni.showToast({
								title: '保存成功',
								duration: 1500,
								icon: 'none',
							});
						},
						//授权成功-end
						//授权失败-start
						fail: function(err) {
							if (err.errMsg) {
								//重新授权弹框确认
								uni.showModal({
									title: '提示',
									content: '无权限，请打开下载权限后再试',
									showCancel: false,
									success(res) {
										if (res.confirm) {
											//重新授权弹框用户点击了确定
											uni.openSetting({
												//进入小程序授权设置页面
												success(settingdata) {
													if (settingdata
														.authSetting[
															'scope.writePhotosAlbum'
														]) {
														//用户打开了保存图片授权开关
														uni.saveImageToPhotosAlbum({
															filePath: benUrl,
															success: function(
																data
															) {
																uni.hideLoading()
															}
														});
													} else {
														//用户未打开保存图片到相册的授权开关
														uni.showModal({
															title: '温馨提示',
															content: '授权失败，请稍后重新获取',
															showCancel: false
														});
													}
												}
											});
										}
									}
								});
							}
						},
						//授权失败-end
					})

				}
			},
			fail: (res) => {
				console.log(res);
			}
		});
		let isUpDate = false // 解决app会重复执行三次的bug
		this.downloadFile.onProgressUpdate((res) => {
			const imgInfoObj = {
				...imgInfo,
				offset: res.totalBytesWritten, // 下载偏移量
				progress: res.progress, // 百分比
			}
			this._update(imgInfo.id, imgInfoObj)
			if (res.progress === 100) {
				if (!isUpDate) {
					const downTime = getTime()
					const size = byte(imgInfo.file_size)
					store.commit("SET_DOWN_DONE_FILE", {
						...imgInfo,
						size,
						downTime
					})
					this._finish(imgInfo)
					this._emit('update', imgInfoObj)
					//结束事件监听
					this.events = null
					isUpDate = true
				}
			}
		});
	}
	// 实现订阅
	on(type, callBack) {
		// 只监听update和finish事件
		if (Array.isArray(this.events[type])) {
			this.events[type] = [callBack];
		} else {
			this.events[type].push(callBack);
		}
	}
	// 触发事件
	_emit(type, ...rest) {
		this.events[type] &&
			this.events[type].forEach((fn) => fn.apply(this, rest));
	}
	_update(id, obj, time = 500) {
		const now = Date.now() //当前时间
		if (now - this.last >= time) {
			this.last = now
			this._emit('update', obj)
		}
	}
	_finish(item) {
		this._emit('finish', item)
	}
	_showToast(message) {
		uni.showToast({
			title: message,
			duration: 1500,
			icon: 'none',
		});
	}

}

export default class DownFileList {
	constructor() {
		this.cacheDownItem = {} // 缓存下载实例
	}
	down(imgInfo) {
		this.cacheDownItem[imgInfo.id] = new DownFile(imgInfo)
		this.cacheDownItem[imgInfo.id].on('update', (data) => {
			console.log(data);
			uni.$emit("down-file", data)
			this.cacheDownItem[data.id] = data
		})
		this.cacheDownItem[imgInfo.id].on('finish', (data) => {
			uni.$emit("del-down-file", data.id)
			delete this.cacheDownItem[data.id]
		})
	}
}
