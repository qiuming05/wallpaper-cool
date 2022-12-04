<template>
	<view>
		<headBar @VTopH="vTopHeight"></headBar>
		<scroll-view scroll-y="true" @scrolltolower="scrolltolower" lower-threshold="100"
			:style="{height: 'calc(100vh - ' + scrollViewH + ')'}" :scroll-into-view="topItem" scroll-with-animation
			@scroll="handleScroll" refresher-enabled :refresher-triggered="isRefresher"
			@refresherrefresh="refresherrefresh">
			<view id="topPosition"></view>
			<view class="main">
				<view class="preview">
					<view class="tab">
						<scroll-view scroll-x :scroll-with-animation="true">
							<view v-for="(item,index) of tabType" :key="item.name" class="tags"
								:class="categoriesID == item.id ?'tag-active':''"
								@click="() => categoriesClick(item.id,index)">
								<text>{{item.name}}</text>
							</view>
							<view v-for="(item,index) of tabType2" :key="item.C" class="tags"
								:class="categoriesID == item.id ?'tag-active':''"
								@click="() => cateClick(item.id,index)">
								<text>{{item.C}}</text>
							</view>
						</scroll-view>
					</view>
					<uni-section :title="`图片总数: ${meta.total}`" type="line"></uni-section>
					<view class="previewList">
						<view class="list-item" v-for="(item,index) of data" :key="index"
							@click="() => tabTypeClick(index)">
							<!-- <image class="list-item-bg" mode="aspectFill" :src="item.thumbs.original" /> -->
							<lazyImage width="100%" height="100%" :src="item.thumbs.original">
							</lazyImage>
						</view>
					</view>
				</view>
				<view class="loading" v-if="isload">
					<u-loading-icon mode="semicircle" text="加载中" textSize="32"></u-loading-icon>
				</view>
			</view>
		</scroll-view>
		<sidebar :iconSize="iconSize" :isShowBackTop="isShowBackTop" @backTop="handleBackTop"></sidebar>
		<food-tab :index="0" @switchTab="switchTab"></food-tab>
		<u-modal :show="show" title="免责声明" confirmText="知道了" width="580rpx" @confirm="confirm">
			<view class="modal">
				<view class="modal-content">壁纸均源于 wallhaven.cc 本程序仅供学习</view>
				<view class="modal-checkbox">
					<u-checkbox-group v-model="checked">
						<u-checkbox name="know" size="16px" labelSize="16px" label="近期不再弹出"></u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import foodTab from '@/components/foodTab/foodTab.vue'
	import headBar from "@/components/head/head.vue"
	import sidebar from "@/components/sidebar/index.vue"
	import lazyImage from "@/components/lazy-image/index.vue"
	import store from '@/store/index.js'; //需要引入store
	import {
		tabType,
		tabType2
	} from "@/util/categories.js"
	import {
		objToUrl,
	} from "@/util/util.js"
	const baseUrl = "https://wallhaven.cc/api/v1/"
	export default {
		data() {
			return {
				categoriesID: '111', // 选项ID
				scrollViewH: '144rpx',
				topItem: '', // 用于顶部返回
				data: [], // 图片数据
				tabType,
				tabType2,
				type: 1,
				tabCurType: {}, // 当前标签数据
				iconSize: 42, // 返回的按钮是否显示
				isShowBackTop: false, // 返回顶部的标记点
				isRefresher: false, // 下拉状态是否完成
				isload: true, // 是否加载中
				page: 1, // data计数器,第几页的数据
				meta: {}, // 请求数据的详情
				show: store.state.$know, // 显示弹窗
				checked: []
			}
		},
		components: {
			foodTab,
			headBar,
			sidebar,
			lazyImage
		},
		onLoad() {
			uni.hideTabBar()
			this.tabCurType = this.tabType[0]
			this.getData(this.tabCurType.id).then(res => {
				this.meta = res.meta
				this.data = res.data
			})
		},
		watch: {
			data: function(newVal) {
				if (newVal.length % 24 !== 0) {
					this.isload = false
				}
			}
		},
		methods: {
			confirm() {
				this.show = false
				if (this.checked[0] === "know") {
					store.commit("SET_STORAGE_KNOW", false)
				} else {
					store.commit("SET_KNOW", false)
				}
			},
			refresherrefresh() {
				this.isRefresher = true
				this.page = 1
				this.isload = true
				this.getData(this.tabCurType.id, this.page)
					.then(res => {
						this.meta = res.meta
						this.data = res.data
						this.isRefresher = false
					})
			},
			handleScroll(e) {
				// 滑动大于200让按钮显示
				this.isShowBackTop = e.detail.scrollTop > 200
				// 因为点第二次不行，这里记得重置清空一下
				this.topItem = ''
			},
			handleBackTop() {
				this.topItem = 'topPosition'
			},
			vTopHeight(data) { // 获取head组件高度
				this.scrollViewH = data.height + "px"
			},
			categoriesClick(id, index) {
				if (id == this.categoriesID) return
				this.page = 1
				this.type = 1
				this.isload = true
				this.categoriesID = id
				this.tabCurType = this.tabType[index]
				this.data = []
				this.getData(this.tabCurType.id, this.page)
					.then(res => {
						this.meta = res.meta
						this.data = res.data
					})
			},
			cateClick(id, index) {
				if (id == this.categoriesID) return
				this.page = 1
				this.type = 2
				this.isload = true
				this.categoriesID = id
				this.tabCurType = this.tabType2[index]
				this.data = []
				this.getData(this.tabCurType.id, this.page)
					.then(res => {
						this.meta = res.meta
						this.data = res.data
					})
			},
			getData(value, page = 1) { // 获取数据
				if (this.type === 1) {
					return this.getCategoriesData(value, page)
				} else if (this.type === 2) {
					return this.getTypeData(value, page)
				}
			},
			getCategoriesData(categories, page = 1) {
				store.state.$screen.q = ""
				const obj = {
					...store.state.$screen,
					categories
				}
				return this.$request({
					url: baseUrl + `search?${objToUrl(obj)}&page=${page}`
				})
			},
			getTypeData(id, page = 1) {
				store.state.$screen.q = "id:" + id
				return this.$request({
					url: baseUrl + `search?${objToUrl(store.state.$screen)}&page=${page}`
				})
			},
			scrolltolower() { // 滚动事件
				if (!this.isload) return
				// 底部事件
				if (this.type === 1) {
					this.tabType.find((item, index) => {
						if (item.id == this.categoriesID) {
							this.page++;
							this.getData(this.tabType[index].id, this.page)
								.then(res => {
									this.data = [...this.data, ...res.data]
								})
							return true
						}
					})
				} else if (this.type === 2) {
					this.tabType2.find((item, index) => {
						if (item.id == this.categoriesID) {
							this.page++;
							this.getData(this.tabType2[index].id, this.page)
								.then(res => {
									this.data = [...this.data, ...res.data]
								})
							return true
						}
					})
				}
			},
			redirect(index) { // 点击后重定向
				store.commit("SET_INDEX", index)
				uni.navigateTo({
					url: "/pages/detail/index"
				})
			},
			tabTypeClick(index) {
				store.commit("SET_IMGLIST", this.data)
				this.redirect(index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modal {
		.modal-content {
			font-size: 16px;
		}

		.modal-checkbox {
			float: right;
			margin-top: 12px;
		}
	}

	.main {
		padding: 15rpx;
		margin-bottom: 350rpx;

		.loading {
			margin-bottom: 150px;
		}

		.scroll-view {
			width: 100%;
			height: 450rpx;
			margin-top: 20rpx;
			white-space: nowrap;

			.scroll-view-item {
				max-width: 240rpx;
				display: inline-block;
				height: inherit;
				margin: 0 10rpx;
				border-radius: 15rpx;
				overflow: hidden;

				// 将图片曝光提高
				.scroll-view-itemImg:active {
					filter: brightness(130%);
				}

				.scroll-view-itemImg {
					height: inherit;
				}
			}
		}

		.preview {

			.tab {
				white-space: nowrap;
				padding: 15rpx 0;
				position: sticky;
				top: 0;
				height: auto;
				background: white;
				z-index: 2;

				.tags {
					font-size: 14px;
					background-color: #F5F6F8;
					color: #909399;
					border-radius: 40rpx;
					line-height: 60rpx;
					padding: 0 40rpx;
					margin-right: 20rpx;
					display: inline-block;
				}

				.tag-active {
					background-image: linear-gradient(135deg, #84fab0, #8fd3f4);
					color: #fff;
					box-shadow: 0px 0px 10px #84fab0;
					animation: tiaobig 0.8s ease-in-out alternate infinite;
					animation-iteration-count: 1;
				}

				@keyframes tiaobig {
					0% {
						transform: scale(0.98);
					}

					25% {
						transform: scale(1.08);
					}

					50% {
						transform: scale(0.94);
					}

					75% {
						transform: scale(1.06);
					}

					100% {
						transform: scale(1);
					}
				}
			}

			.previewList {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 15rpx;
				padding: 25rpx 0;

				.list-item {
					position: relative;
					border-radius: 8px;
					overflow: hidden;
					height: 240rpx;
					box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);

				}

				/* .list-item-bg {
					border-radius: 25rpx;
					width: 100%;
					height: 100%;
				} */
				.list-item:last-child {
					margin-bottom: 150px;
				}
			}
		}
	}
</style>
