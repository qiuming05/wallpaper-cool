<template>
	<view>
		<headbar @getHeight="(data) => scrollViewH = data.height + 'px'"></headbar>
		<scroll-view scroll-y="true" lower-threshold="100" :style="{height: 'calc(100vh - ' + scrollViewH + ')'}"
			:scroll-into-view="topItem" scroll-with-animation refresher-enabled :refresher-triggered="isRefresher"
			@scroll="handleScroll" @scrolltolower="scrolltolower" @refresherrefresh="refresherrefresh">
			<!-- 顶部锚点 -->
			<view id="topPosition"></view>
			<view class="main">
				<view class="preview">
					<view class="tabs">
						<scroll-view scroll-x :scroll-with-animation="true">
							<view v-for="(item,index) of tabs[1]" :key="item.name" class="tab-item"
								:class="categoriesVal == item.value ?'tab-active':''"
								@click="() => swiperChange(1,item.value,index)">
								<text>{{item.text}}</text>
							</view>
							<view v-for="(item,index) of tabs[2]" :key="item.C" class="tab-item"
								:class="categoriesVal == item.value ?'tab-active':''"
								@click="() => swiperChange(2,item.value,index)">
								<text>{{item.text}}</text>
							</view>
						</scroll-view>
					</view>
					<uni-section :title="`图片总数: ${meta.total}`" type="line">
					</uni-section>
					<view v-if="data.length !== 0" class="previewList">
						<view class="list-item" v-for="(item,index) of data" :key="index"
							@click="() => imgClick(index)">
							<!-- <image class="list-item-bg" mode="aspectFill" :src="item.thumbs.original" /> -->
							<lazy-image width="100%" height="100%" :src="item.thumbs.original">
							</lazy-image>
						</view>
					</view>
					<view v-else class="empty">
						<view>
							<u-icon name="/static/empty.gif" size="520rpx" />
						</view>
					</view>
				</view>
				<view class="loading" v-if="isload">
					<u-loading-icon mode="semicircle" text="加载中" textSize="32"></u-loading-icon>
				</view>
			</view>
		</scroll-view>
		<sidebar :iconSize="42" :isShowBackTop="isShowBackTop" @backTop="handleBackTop"></sidebar>
		<foot-tab :index="0" @switchTab="switchTab"></foot-tab>
		<u-modal :show="show" title="免责声明" confirmText="知道了" width="580rpx" @confirm="confirm">
			<view class="modal">
				<view class="modal-content">{{config.tips}}</view>
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
	import store from '@/store/index.js'; //需要引入store
	import {
		objToUrl,
	} from "@/util/util.js"
	import config from '@/util/config.js'
	export default {
		data() {
			return {
				categoriesVal: '111', // 选项ID
				scrollViewH: '100px',
				topItem: '', // 用于顶部返回
				data: [], // 图片数据
				tabs: {
					1: [{
						text: "热门",
						value: "111",
					}, {
						text: "动漫",
						value: "010",
					}, {
						text: "人物",
						value: "001",
					}],
					2: [{
						text: "自然",
						value: '37'
					}, {
						text: "风景",
						value: '711'
					}, {
						text: "4k",
						value: '65348'
					}, {
						text: "简约",
						value: '198'
					}, {
						text: "插画",
						value: '24563'

					}, {
						text: "游戏",
						value: '55'
					}]
				}, // 选项卡
				type: 1, // tabs type
				currentTab: {}, // 当前标签数据
				isShowBackTop: false, // 是否显示返回顶部的小火箭
				isRefresher: false, // 下拉状态是否完成
				isload: true, // 是否加载中
				page: 1, // data计数器,第几页的数据
				meta: {}, // 请求数据的详情
				show: store.state.$know, // 显示弹窗
				checked: [], // 近期是否弹出
				config, // 配置
			}
		},
		onLoad() {
			uni.hideTabBar()
			this.currentTab = this.tabs[1][0]
			this.getData(this.currentTab.value).then(res => {
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
				this.getData(this.currentTab.value)
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
			swiperChange(type, value, index) {
				if (value == this.categoriesVal) return
				this.page = 1
				this.type = type
				this.isload = true
				this.categoriesVal = value
				this.currentTab = this.tabs[type][index]
				this.meta = {}
				this.data = []
				this.getData(this.currentTab.value)
					.then(res => {
						this.meta = res.meta
						this.data = res.data
					})
			},
			getData(value) { // 获取数据
				const strategry = {
					1: (value) => {
						store.state.$filter.q = ""
						const obj = {
							...store.state.$filter,
							categories: value
						}
						return this.$request({
							url: config.apiBaseUrl + `search?${objToUrl(obj)}&page=${this.page}`
						})
					},
					2: (value) => {
						store.state.$filter.q = "id:" + value
						return this.$request({
							url: config.apiBaseUrl +
								`search?${objToUrl(store.state.$filter)}&page=${this.page}`
						})
					}
				}
				return strategry[this.type](value)
			},
			scrolltolower() { // 滚动事件
				if (!this.isload) return
				// 底部事件
				this.tabs[this.type].find((item, index) => {
					if (item.value == this.categoriesVal) {
						this.page++;
						this.getData(this.currentTab.value)
							.then(res => {
								this.data = [...this.data, ...res.data]
								if (this.data.length === 0) this.isload = false
							})
						return true
					}
				})
			},
			redirect(index) { // 点击后重定向
				store.commit("SET_INDEX", index)
				uni.navigateTo({
					url: "/pages/detail/index"
				})
			},
			imgClick(index) {
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

		.preview {

			.tabs {
				white-space: nowrap;
				padding: 15rpx 0;
				position: sticky;
				top: 0;
				height: auto;
				z-index: 2;
				background: white;

				.tab-item {
					font-size: 14px;
					background: #F5F6F8;
					color: #909399;
					border-radius: 40rpx;
					line-height: 60rpx;
					padding: 0 40rpx;
					margin-right: 20rpx;
					display: inline-block;
				}

				.tab-active {
					background-image: linear-gradient(135deg, #84fab0, #8fd3f4);
					color: #fff;
					box-shadow: 0px 0px 10px #84fab0;
					animation: anima 0.8s ease-in-out alternate infinite;
					animation-iteration-count: 1;
				}

				@keyframes anima {
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

				.list-item:last-child {
					margin-bottom: 150px;
				}
			}

			.empty {
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.loading {
			margin-bottom: 150px;
		}
	}
</style>
