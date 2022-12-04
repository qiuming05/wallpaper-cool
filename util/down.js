import store from "@/store/index.js"
import {
	getTime,
	byte
} from "@/util/util.js"

class Down {
	//缓存下载项
	cacheDownItem = {}
	// 节流记录事件
	last = 0
	downloadTask(item) {
		const downloadTask = uni.downloadFile({
			url: item.path,
			success: (res) => {
				if (res.statusCode === 200) {
					let benUrl = res.tempFilePath
					//图片保存到本地相册
					uni.saveImageToPhotosAlbum({
						filePath: benUrl,
						//授权成功-start，保存图片
						success: function(res) {
							uni.showToast({
								icon: 'none',
								title: '保存成功', //保存路径
								duration: 1000,
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
		downloadTask.onProgressUpdate((res) => {
			// console.log('下载进度' + res.progress);
			// console.log('已经下载的数据长度' + res.totalBytesWritten);
			// console.log('预期需要下载的数据总长度' + res.totalBytesExpectedToWrite);
			const offset = res.totalBytesWritten // 下载偏移量
			this._updateCache(item.id, {
				...item,
				offset,
				progress: res.progress,
			})
			if (res.progress === 100) {
				if (!isUpDate) {
					const downTime = getTime()
					const size = byte(item.file_size)
					this.showToast(Date.now())
					store.commit("SET_DOWN_DONE_FILE", {
						...item,
						downTime,
						size
					})
					this._deleteCache(item)
					isUpDate = true
				}
			}
		});
		return downloadTask
	}
	_updateCache(id, obj) { // 更新函数
		const update = () => {
			this.cacheDownItem[id] = obj
			uni.$emit("down-file", obj)
		}
		// 开启节流模式
		this._throttle(update).call(this)
	}
	_deleteCache(item) { // 删除函数
		uni.$emit("del-down-file", item.id)
		delete this.cacheDownItem[item.path]
	}
	_throttle(fun, time = 1000) {
		// this.last为上一次触发回调的时间
		return function() {
			let now = new Date() //当前时间
			if (now - this.last >= time) {
				fun.apply(this, arguments)
				this.last = now
			}
		}
	}
	showToast(message) {
		uni.showToast({
			title: message,
			duration: 1500,
			icon: 'none',
		});
	}
}
module.exports = new Down
