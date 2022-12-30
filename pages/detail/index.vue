<template>
	<view>
		<view :class="!preview ? 'show' : 'hide'" class="back" @click="backClick">
			<u-icon name="/static/icon/goBack-white.png" :size="66"></u-icon>
		</view>
		<view v-show="!preview" @click="issShowSidebar = false">
			<swiper-position @positionData="getPositionData">
				<swiper style="height: 100vh;width:100%;" vertical :circular="true" @change="swiperChange"
					:current="activeCurrent">
					<swiper-item v-for="(item,index) of imgDate" :key="index">
						<image :src="item.path" style="height:100vh;width:100vw;" mode="aspectFit"
							@click="() => yulan(item.path)" @error="(e)=>error(e,index)" />
					</swiper-item>
				</swiper>
			</swiper-position>
			<view class="bottom" :class="cssTran ? 'closeCss' : 'openCss'">
				<view class="num">{{indexCurrent}} / {{detail.length}}</view>
				<view class="nav-box">
					<view class="nav-tab" @click="downImg">
						<u-icon name="/static/icon/down.png" :size="44"></u-icon>
						<text>下载</text>
					</view>
					<view class="nav-tab" @click="collectClick()">
						<u-icon :name="isColl?'/static/icon/coll_art.png':'/static/icon/coll.png'" :size="44">
						</u-icon>
						<text>{{isColl?'已收藏':'收藏'}}</text>
					</view>
					<view class="nav-tab" @click="show = true">
						<u-icon name="/static/icon/details.png" :size="44"></u-icon>
						<text>详情</text>
					</view>
				</view>
			</view>
		</view>

		<movable-area :class="preview ? 'show' : 'hide'" scale-area class="movable-area" @click="preview=false">
			<movable-view class="movable-view" friction="1" damping="15" direction="all" scale="true" scale-min="1"
				scale-max="10" :scale-value="scale">
				<image style="width:100%;" :src="currentImg" mode="widthFix" id="img" />
			</movable-view>
		</movable-area>
		<u-popup :show="show" :round="10" closeOnClickOverlay @close="show = false">
			<view>
				<uni-section :title="'大小: ' + imgDate[activeCurrent].size" type="line"></uni-section>
				<uni-section :title="'类型: ' +  imgDate[activeCurrent].file_type" type="line"></uni-section>
				<uni-section :title="'分辨率: ' +  imgDate[activeCurrent].resolution" type="line"></uni-section>
				<uni-section :title="'图片源: ' +  imgDate[activeCurrent].url" type="line"></uni-section>
				<uni-section :title="'上传时间: ' +  imgDate[activeCurrent].created_at" type="line"></uni-section>
			</view>
		</u-popup>
		<view class="sidebar" :class="issShowSidebar ? 'show' : 'hide'">
			<scroll-view scroll-y="true" scroll-with-animation="true"
				:style="[{height:safeAreaObj.height + 'px'},{marginTop:safeAreaObj.top + 'px'}]" :scroll-top="scrollTop"
				@scroll="scroll" class="sidebarScrollView">
				<view style="padding: 50vh 0;">
					<view class="sidebar-image" :class="[activeCurrent === index ? 'sidebar-image-focus' : '' ]"
						v-for="(item,index) of detail" :key="index" @click="() => activeCurrent = index">
						<lazy-image :src="item.thumbs.original">
						</lazy-image>
					</view>
				</view>
			</scroll-view>
		</view>

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
				activeCurrent: 0, // swtiper的当前的位置
				contentScrollH: 0, // 获取scroll-view高度
				currentImg: {}, // 当前要缩放的图片地址
				cssTran: false, // 是否隐藏下边菜单栏
				imgDate: [], // 用于实现懒加载的
				isColl: false, // 当前壁纸时候收藏
				issShowSidebar: true, // 是否显示侧边预览,初始化必须显示不然无法获取每个元素的top
				indexCurrent: 1, // 展示下面的index索引
				scrollTop: 0, // 滚动高度
				sidebarImageList: [], // 用于定位
				show: false, // 显示详情
				scale: 1, // 图片缩放倍数
				safeAreaObj: {
					height: 0,
					top: 0,
				}, // 安全区
				detail: [], // 存放原始数据
				oldScrollTop: 0, // 旧滚动高度
				preview: false, // 是否开启预览状态
			}
		},
		onLoad() {
			this.initList()
			const _this = this
			uni.getSystemInfo({
				success(e) {
					_this.safeAreaObj = e.safeArea
				}
			})

		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			this.$nextTick(() => {
				// 拿到 scroll-view 组件高度
				query.select('.sidebarScrollView').boundingClientRect(data => this.contentScrollH = data.height)
					.exec();
				// 获取每个子元素节点的高度
				query.selectAll('.sidebar-image').boundingClientRect(data => {
					this.sidebarImageList = data
					// 右侧图片定位
					this.scrollTop = data[this.activeCurrent].top - this.contentScrollH / 2 +
						data[this.activeCurrent].height / 2;
				}).exec()
			})
		},
		watch: {
			activeCurrent(index) { //这里监听不到初始化,'所以还需要初始化'
				this.currentImg = this.detail[index]
				this.imgDate[index] = this.detail[index]
				this.imgDate[index].size = byte(this.currentImg.file_size)
				this.isCollFn()
				this.scrollTop = this.oldScrollTop
				this.$nextTick(function() {
					this.scrollTop = this.sidebarImageList[index].top - this.contentScrollH / 2 + this
						.sidebarImageList[
							index].height / 2;
				});
				store.commit("SET_HISTORY", this.currentImg)
			},
		},
		methods: {
			getPositionData(e) {
				if (e.direction === "right" && e.x < -100) {
					this.issShowSidebar = true
				} else if (e.direction === "left" && e.x > 50) {
					this.issShowSidebar = false
				}
			},
			scroll(e) {
				this.oldScrollTop = e.detail.scrollTop
			},
			yulan(img) { // 预览图片
				if (!this.issShowSidebar) {
					this.currentImg = img;
					this.scale = 1;
					this.preview = true;
				}
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
				this.detail = store.state.$imgList
				this.activeCurrent = store.state.$index
				this.indexCurrent = this.activeCurrent + 1
				this.currentImg = this.detail[this.activeCurrent]
				this.isCollFn()
				store.commit("SET_HISTORY", this.currentImg)

				const len = this.detail.length
				// 根据图片总数，创建需要渲染的空数组
				let imgDate = new Array(len).fill("")
				// 载入当前图
				imgDate[this.activeCurrent] = this.detail[this.activeCurrent]
				imgDate[this.activeCurrent].size = byte(imgDate[this.activeCurrent].file_size)
				// 渲染页面
				this.imgDate = imgDate;
			},
			swiperChange(e) { // switch发生变化,动态添加图片路径
				this.indexCurrent = e.detail.current + 1 // 当前的位置
				this.activeCurrent = e.detail.current
			},
			backClick() { // 返回上一页面
				uni.navigateBack()
			},
			downImg() { // 下载图片
				this.showToast('下载中...')
				this.$down.down(this.currentImg)
			},
			error(e, index) {
				this.showToast("图片加载出错")
				this.imgDate[index].path = '/static/error.gif'
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
	.hide {
		transition: all 0.5s;
		opacity: 0;
		transform: translateX(100vw);
	}

	.show {
		transition: all 0.5s;
		opacity: 1;
		transform: translateX(0px);
	}

	.back {
		position: fixed;
		top: 5%;
		left: 5%;
		z-index: 1;
		background-color: rgba(0, 0, 0, 0.3);
		padding: 0 6px;
		border-radius: 6px;
	}

	.sidebar {
		width: 33%;
		height: 100%;
		position: fixed;
		top: 0;
		right: 0;


		.sidebarScrollView {
			height: 100%;
			padding: 0 4px;

			.sidebar-image {
				width: 100%;
				height: 80px;
				box-sizing: border-box;
				margin: 15px 0;
				border-radius: 12px;
				overflow: hidden;
				box-shadow:inset -3px -3px 3px rgba(0, 0, 0, 0.25);
			}

			.sidebar-image-focus {
				border: 2px solid #6b76ec;
			}
		}
	}

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
		animation: openLinear 0.8s 1;
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
		animation: closeLinear 0.8s 1;
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
