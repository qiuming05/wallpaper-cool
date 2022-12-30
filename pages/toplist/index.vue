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
						<scroll-view scroll-x="true">
							<view class="tab-item" :class="index == item.id ?'tab-active':''" v-for="item of tabs"
								:key="item.id" hover-stay-time="50" @click="() => swiperChange(item)">
								<view>{{item.text}}</view>
							</view>
						</scroll-view>
					</view>
					<uni-section :title="`图片总数: ${meta.total}`" type="line" />
					<view v-if="data.length !== 0" class="previewList">
						<view class="list-item" v-for="(item,index) of data" :key="index"
							@click="() => imgClick(index)">
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
		<foot-tab :index="1" @switchTab="switchTab"></foot-tab>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	import config from '@/util/config.js';
	import {
		objToUrl
	} from "@/util/util.js";
	export default {
		data() {
			return {
				index: 0,
				page: 1,
				tabs: [{
						text: '最新榜',
						value: 'date_added',
						id: 0
					},
					{
						text: '热门榜',
						value: 'hot',
						id: 1
					},
					{
						text: '排行榜',
						value: 'toplist',
						id: 2
					},
					{
						text: '收藏榜',
						value: 'favorites',
						id: 3
					}, {
						text: '随机榜',
						value: 'random',
						id: 4
					}
				],
				scrollViewH: '100px',
				topItem: '', // 用于顶部返回
				data: [], // 图片数据
				isShowBackTop: false, // 返回顶部的标记点
				isRefresher: false, // 下拉状态是否完成
				isload: true, // 是否加载中
				meta: {}, // 请求数据的详情
				isShowBackTop: false, // 是否显示返回顶部的小火箭
			}
		},
		onLoad() {
			uni.hideTabBar()
			this.getData().then(res => {
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
			getData() {
				store.state.$filter.q = ""
				let obj = {
					...store.state.$filter,
					sorting: this.tabs[this.index].value
				}
				obj.sort = ""
				return this.$request({
					url: config.apiBaseUrl + `search?${objToUrl(obj)}&page=${this.page}`
				})
			},
			swiperChange(item) {
				if (item.id === this.index) return
				this.index = item.id
				this.page = 1
				this.isload = true
				this.meta = {}
				this.data = []
				this.getData().then(res => {
					this.meta = res.meta
					this.data = res.data
				})
			},
			handleBackTop() {
				this.topItem = 'topPosition'
			},
			imgClick(index) {
				store.commit("SET_IMGLIST", this.data)
				this.redirect(index)
			},
			refresherrefresh() {
				this.isRefresher = true
				this.page = 1
				this.isload = true
				this.getData()
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
			scrolltolower() { // 滚动事件
				if (!this.isload) return
				// 底部事件
				this.page++;
				this.getData()
					.then(res => {
						this.data = [...this.data, ...res.data]
						if (this.data.length === 0) this.isload = false
					})
			},
			redirect(index) { // 点击后重定向
				store.commit("SET_INDEX", index)
				uni.navigateTo({
					url: "/pages/detail/index"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		padding: 15rpx;


		/* 	 .tab:nth-child(1) {
				background-image: linear-gradient(135deg, #84fab0, #8fd3f4);
			}
			
			.tab:nth-child(2) {
				background-image: linear-gradient(135deg, #d4fc79, #96e6a1);
			}
			
			.tab:nth-child(3) {
				background-image: linear-gradient(135deg, #c2e9fb, #a1c4fd);
			}
			
			.tab:nth-child(4) {
				background-image: linear-gradient(135deg, #e6dee9, #fdcbf1);
			}
			
			.tab:nth-child(5) {
				margin-right: 0rpx;
				background-image: linear-gradient(135deg, #f6d365, #fda085);
			} */

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
