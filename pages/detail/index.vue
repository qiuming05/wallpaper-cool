<template>
	<view>
		<view v-show="!preview">
			<swiper style="height: 100vh;width: 100vw;" :circular="true" @change="swiperChange"
				:current="activeCurrent">
				<swiper-item v-for="(item,index) of imgData" :key="index">
					<image :src="item.path" style="height:100vh;width:100vw;" mode="aspectFit"
						@click="() => yulan(item.path)" @error="(e)=>error(e,index)" />
				</swiper-item>
			</swiper>
			<view class="bottom" :class="cssTran ? 'closeCss' : 'openCss'">
				<view class="num">{{indexCurrent}} / {{detail.length}}</view>
				<view class="nav-box">
					<view class="nav-tab" @click="backClick">
						<u-icon name="/static/icon/back.png" :size="44"></u-icon>
						<text>返回</text>
					</view>
					<view class="nav-tab" @click="downImg">
						<u-icon name="/static/icon/down.png" :size="44"></u-icon>
						<text>下载</text>
					</view>
					<view class="nav-tab" @click="collectClick()">
						<u-icon :name="isColl?'/static/icon/coll_art.png':'/static/icon/coll.png'" :size="44"></u-icon>
						<text>{{isColl?'已收藏':'收藏'}}</text>
					</view>
					<view class="nav-tab" @click="details">
						<u-icon name="/static/icon/details.png" :size="44"></u-icon>
						<text>详情</text>
					</view>
				</view>
			</view>
		</view>
		<movable-area v-show="preview" scale-area class="movable-area"
			:style="{'backgroundColor':previewMenu ? 'white' : 'black'}">
			<movable-view class="movable-view" friction="1" damping="15" direction="all" scale="true" scale-min="1"
				scale-max="10" :scale-value="scale" @click="toogleClick">
				<image style="width:100%;" :src="currentImg" mode="widthFix" id="img" />
			</movable-view>
			<view class="bottom" :class="previewMenu ? 'openCss' : 'closeCss'">
				<view class="nav-box">
					<view class="nav-tab" @click="preview=false">
						<u-icon name="/static/icon/back.png" :size="44"></u-icon>
						<text>返回</text>
					</view>
					<view class="nav-tab" @click="downImg">
						<u-icon name="/static/icon/down.png" :size="44"></u-icon>
						<text>下载</text>
					</view>
				</view>
			</view>
		</movable-area>
		<u-popup :show="show" :round="10" closeOnClickOverlay @close="show = false">
			<view>
				<uni-section :title="'大小: ' + imgData[activeCurrent].size" type="circle"></uni-section>
				<uni-section :title="'类型: ' +  imgData[activeCurrent].file_type" type="circle"></uni-section>
				<uni-section :title="'分辨率: ' +  imgData[activeCurrent].resolution" type="circle"></uni-section>
				<uni-section :title="'图片源: ' +  imgData[activeCurrent].url" type="circle"></uni-section>
				<uni-section :title="'上传时间: ' +  imgData[activeCurrent].created_at" type="circle"></uni-section>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import store from '@/store/index.js'; //需要引入store
	import {
		byte,
	} from "@/util/util.js"
	export default {
		data() {
			return {
				scale: 1, // 图片缩放倍数
				show: false, // 显示详情
				currentImg: {}, // 当前要缩放的图片地址
				preview: false, // 是否开启预览状态
				previewMenu: true, // 预览时的菜单栏是否开启
				detail: [], // 存放原始数据
				imgData: [], // 用于实现懒加载的
				cssTran: false, // 是否隐藏下边菜单栏
				indexCurrent: 1, // 展示下面的index索引
				activeCurrent: 0, // swtiper的当前的位置
				isColl: false, // 当前壁纸时候收藏
			}
		},
		onLoad() {
			this.detail = store.state.$imgList
			this.activeCurrent = store.state.$index
			this.indexCurrent = this.activeCurrent + 1
			// 初始化一下this.currentImg
			this.currentImg = this.detail[this.activeCurrent]
			store.commit("SET_HISTORY", this.currentImg)
			this.initList()
		},
		watch: {
			activeCurrent(index) { //这里监听不到初始化,'所以还需要初始化'
				this.currentImg = this.detail[index]
				this.imgData[index].size = byte(this.currentImg.file_size)
				this.imgData[index].loading = true
				this.isCollFn()
				store.commit("SET_HISTORY", this.currentImg)
			},
		},
		methods: {
			details() {
				this.show = true
			},
			// 预览图片
			yulan(img) {
				this.currentImg = img;
				this.scale = 1;
				this.preview = true;
			},
			toogleClick() {
				this.previewMenu = !this.previewMenu
			},
			cssClick() { // 是否显示下方菜单栏
				this.cssTran = !this.cssTran
			},
			isCollFn() { // 判断是否收藏
				if (store.state.$collection.length > 0) {
					store.state.$collection.find((item, index) => {
						if (item.path === this.currentImg.path) {
							this.isColl = true
							return true
						} else {
							this.isColl = false
						}
					})
				} else {
					this.isColl = false
				}
			},
			collectClick() {
				if (this.isColl) {
					this.showToast('取消收藏')
					store.commit("DEL_COLLECTION", this.currentImg.path)
				} else {
					this.showToast('已收藏')
					store.commit("SET_COLLECTION", this.currentImg)
				}
				this.isCollFn()
			},
			initList() { // 初始化用于图片懒加载的数据
				this.isCollFn()
				const len = this.detail.length
				// 根据图片总数，创建需要渲染的空数组
				let imgData = new Array(len).fill("")
				// 载入当前图
				imgData[this.activeCurrent] = this.detail[this.activeCurrent]
				imgData[this.activeCurrent].size = byte(imgData[this.activeCurrent].file_size)
				// 渲染页面
				this.imgData = imgData;
			},
			swiperChange(e) { // switch发生变化,动态添加图片路径
				this.indexCurrent = e.detail.current + 1 // 当前的位置
				let oldPageIndex = this.activeCurrent // 之前展示的页面索引
				let newPageIndex = e.detail.current // 滑动后新展示的页面索引
				this.activeCurrent = newPageIndex
				const len = this.detail.length
				newPageIndex = Math.max(0, newPageIndex)
				newPageIndex = Math.min(len - 1, newPageIndex);
				console.log("旧:", oldPageIndex + 1, "新", newPageIndex + 1)
				// 判断是否由用户触摸引起的
				if (e.detail.source == 'touch') {
					// 判断滑动方向
					this.imgData[this.activeCurrent] = this.detail[this.activeCurrent]
				}
			},
			backClick() { // 返回上一页面
				uni.navigateBack()
			},
			downImg() { // 下载图片
				this.showToast('下载中...')
				this.$down.downloadTask(this.currentImg)
			},
			error(e, index) {
				this.showToast("图片加载出错")
				this.imgData[index].path = '/static/error.gif'
			},
			showToast(title, icon = "none", duration = 1000) {
				uni.showToast({
					icon,
					title,
					duration,
				});
			}
		}
	}
</script>
<style lang="scss">
	.movable-area {
		position: fixed;
		z-index: 99999;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;

		.movable-view {
			width: 100vw;
			height: 100vh;
			justify-content: center;
			/*子元素水平居中*/
			align-items: center;
			/*子元素垂直居中*/
			display: -webkit-flex;

			.swiperImg {
				height: 80%;
			}
		}

	}

	.bottom {
		position: fixed;
		right: 0;
		left: 0;
		margin: 0 auto;
		width: 65%;
		height: 52px;
		box-shadow: 0 0px 8px rgba(0, 0, 0, 0.06);
		background: rgba(0, 0, 0, 0.94);
		border-radius: 32rpx;
		z-index: 10;
		opacity: 0.8;

		.num {
			position: absolute;
			top: -70rpx;
			left: 50%;
			background: rgba(0, 0, 0, 0.6);
			color: #FFF;
			padding: 4rpx 20rpx;
			font-size: 12px;
			border-radius: 36px;
			transform: translateX(-50%);
		}
	}

	.nav-tab {
		position: relative;
		width: 100%;
		height: 52px;
		font-size: 12px;
		color: #D8D8D8;
		font-weight: 400;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.nav-box {
		/* position: absolute; */
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		width: 100%;
		box-sizing: border-box;
	}

	.openCss {
		animation-name: openLinear;
		animation-duration: 0.8s;
		animation-iteration-count: 1;
		bottom: 40px;
	}

	@keyframes openLinear {
		0% {
			transform: translateY(92px);
		}

		100% {
			transform: translateY(0px);
		}
	}

	.closeCss {
		animation-name: closeLinear;
		animation-duration: 0.8s;
		animation-iteration-count: 1;
		bottom: -52px;
	}

	@keyframes closeLinear {
		0% {
			transform: translateY(-92px);
		}

		100% {
			transform: translateY(0px);
		}
	}

	.u-indicator-item-number {
		padding: 6rpx 16rpx;
		line-height: 1;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 100rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
	}
</style>
