<template>
	<view>
		<view class="head" :style="{marginTop: menuButtonInfo + 'px'}">
			<text>壁纸酷</text>
			<view class="bg"></view>
		</view>
		<view class="main">
			<view class="store">
				<view class="store-item">
					<view class="num">{{collectionLen}}</view>
					<view class="title">收藏数</view>
				</view>
				<view class="store-item">
					<view class="num">{{downDoneFileLen}}</view>
					<view class="title">下载数</view>
				</view>
				<view class="store-item">
					<view class="num">{{historyLen}}</view>
					<view class="title">预览数</view>
				</view>
			</view>
			<view class="menu">
				<view class="menu-item" hover-stay-time="50" @click="cellClick">
					<view class="left-side">
						<image src="/static/icon/coll_art.png"></image>
						<view class="title">我的收藏</view>
					</view>
					<view class="right-side">
						<u-icon size="32" name="arrow-right" />
					</view>
				</view>
				<view class="menu-item" hover-stay-time="50" @click="downClick">
					<view class="left-side">
						<image src="/static/icon/down.png"></image>
						<view class="title">我的下载</view>
					</view>
					<view class="right-side">
						<u-icon size="32" name="arrow-right" />
					</view>
				</view>
				<view class="menu-item" hover-stay-time="50" @click="historyClick">
					<view class="left-side">
						<image src="/static/icon/see.png"></image>
						<view class="title">我的预览</view>
					</view>
					<view class="right-side">
						<view class=""></view>
						<u-icon size="32" name="arrow-right" />
					</view>
				</view>
				<view class="menu-item" hover-stay-time="50" @click="deleteClick">
					<view class="left-side">
						<image src="/static/icon/delete.png"></image>
						<view class="title">清除缓存</view>
					</view>
					<view class="right-side">
						<view class=""></view>
						<u-icon size="32" name="arrow-right" />
					</view>
				</view>
			</view>
		</view>
		<food-tab :index="2" @switchTab="switchTab"></food-tab>
	</view>
</template>

<script>
	// 获取系统状态栏的高度
	let menuButtonInfo = {};
	// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
	// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
	const {
		top
	} = uni.getMenuButtonBoundingClientRect()
	menuButtonInfo = top
	// #endif
	// #ifdef APP-PLUS
	uni.getSystemInfo({
		success: res => {
			menuButtonInfo = res.statusBarHeight;
		}
	});
	// #endif
	import foodTab from '@/components/foodTab/foodTab.vue'
	import store from '@/store/index.js'; //需要引入store
	export default {
		components: {
			foodTab,
		},
		data() {
			return {
				menuButtonInfo: menuButtonInfo,
				collectionLen: 0,
				downDoneFileLen: 0,
				historyLen: 0
			}
		},
		onShow() {
			this.collectionLen = store.state.$collection.length
			this.downDoneFileLen = store.state.$downDoneFile.length
			this.historyLen = store.state.$history.length
		},
		onLoad() {
			uni.hideTabBar()
		},
		methods: {
			showToast(message) {
				uni.showToast({
					title: message,
					duration: 1500,
					icon: 'none',
				});
			},
			deleteClick() {
				store.commit("DEL_STORAGE_KNOW")
				store.commit("DEL_STORAGE_SCREEN")
				store.commit("DEL_All_HISTORY")
				store.commit("DEL_ALL_COLLECTION")
				store.commit("DEL_ALL_SEARCH_HISTORY")
				store.commit("DEL_ALL_DOWN_DONE_FILE")
				this.showToast("清除成功")
				this.collectionLen = store.state.$collection.length
				this.downDoneFileLen = store.state.$downDoneFile.length
				this.historyLen = store.state.$history.length
			},
			downClick() {
				uni.navigateTo({
					url: "/pages/down/index"
				})
			},
			cellClick() {
				uni.navigateTo({
					url: "/pages/collection/index"
				})
			},
			historyClick() {
				uni.navigateTo({
					url: "/pages/history/index"
				})
			}
		}
	}
</script>

<style lang="scss">
	.head {
		margin: 32rpx 32rpx 32rpx 24rpx;
		height: 250rpx;
		border-radius: 36rpx;
		overflow: hidden;
		/* 设置渐变 */
		background: linear-gradient(to right bottom,
				rgba(255, 255, 255, .6),
				rgba(255, 255, 255, .3),
				rgba(255, 255, 255, .2));
		/* 设置上高光和左高光，使其看起来更加逼真 */
		border-top: 1px solid rgba(255, 255, 255, .8);
		border-left: 1px solid rgba(255, 255, 255, .8);
		position: relative;
		box-shadow: 0px 0px 10px #c2e9fb;
		display: flex;
		align-items: center;
		justify-content: center;

		text {
			font-size: 72rpx;
			color: white;
			font-weight: 900;
		}

		.bg {
			width: 100%;
			height: 100%;
			z-index: -1;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			position: absolute;
			background-image: linear-gradient(135deg, #a1c4fd, #c2e9fb);
			filter: blur(10px);
		}
	}

	.main {
		padding: 32rpx;

		.store {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			.store-item:first-child {
				margin-left: 0;
			}

			.store-item:last-child {
				margin-right: 0;
			}

			.store-item {
				flex: 1;
				padding: 36rpx;
				margin: 0 16rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				color: black;
				border-radius: 24rpx;
				background: white;
				white-space: nowrap;

				.num {
					font-size: 52rpx;
					font-weight: 900;
					color: transparent;
					background-clip: text;
					background-image: linear-gradient(135deg, #a1c4fd, #c2e9fb);
					margin-bottom: 16rpx;
				}
			}
		}

		.menu {
			margin-top: 36rpx;
			background: white;
			border-radius: 24rpx;

			.menu-item:last-child {
				border-bottom: none;
			}

			.menu-item {
				display: flex;
				justify-content: space-between;
				padding: 36rpx;
				box-sizing: border-box;
				border-bottom: 1px solid #efefef;

				.left-side {
					display: flex;

					.title {
						margin-left: 24rpx;
					}
				}
			}

			image {
				width: 38rpx;
				height: 38rpx;
			}
		}
	}
</style>
