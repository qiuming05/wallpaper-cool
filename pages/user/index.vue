<template>
	<view>
		<image class="bg" src="/static/bg.gif" mode="scaleToFill"></image>
		<view class="main">
			<uni-section title="数据统计" subTitle="点击查看" type="line" />
			<view class="store">
				<view class="store-item" @click="historyClick">
					<view class="num">{{historyLen}}</view>
					<view class="title">预览数</view>
				</view>
				<view class="store-item" @click="cellClick">
					<view class="num">{{collectionLen}}</view>
					<view class="title">收藏数</view>
				</view>
				<view class="store-item" @click="downClick">
					<view class="num">{{downDoneFileLen}}</view>
					<view class="title">下载数</view>
				</view>
			</view>
			<view class="menu">
				<view class="menu-item" hover-stay-time="50" @click="githubCopy">
					<view class="left-side">
						<image src="/static/icon/github.png"></image>
						<view class="title">Github</view>
					</view>
					<view class="right-side">
						<u-icon size="32" name="arrow-right" />
					</view>
				</view>
				<view class="menu-item" hover-stay-time="50" @click="deleteClick">
					<view class="left-side">
						<image src="/static/icon/delete.png"></image>
						<view class="title">清除缓存</view>
					</view>
					<view class="right-side">
						<u-icon size="32" name="arrow-right" />
					</view>
				</view>
				<view class="menu-item" hover-stay-time="50" @click="aboutClick">
					<view class="left-side">
						<image src="/static/icon/about.png"></image>
						<view class="title">关于</view>
					</view>
					<view class="right-side">
						<u-icon size="32" name="arrow-right" />
					</view>
				</view>
			</view>
		</view>
		<foot-tab :index="2" @switchTab="switchTab"></foot-tab>
	</view>

</template>

<script>
	import store from '@/store/index.js';
	import config from '@/util/config.js'
	export default {
		data() {
			return {
				config,
				collectionLen: 0,
				downDoneFileLen: 0,
				historyLen: 0,
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
			githubCopy() {
				//uni.setClipboardData 内容复制到粘贴板
				uni.setClipboardData({
					data: config.github, //要被复制的内容
					success: () => { //复制成功的回调函数
						this.showToast('已复制开源链接')
					}
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
			aboutClick() {
				uni.navigateTo({
					url: "/pages/about/index"
				})
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
	.bg {
		width: 100vw;
		-webkit-mask: linear-gradient(0deg, transparent, #fff 65%);
	}

	.main {
		padding: 0 32rpx;

		.store {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			background: #f7fbff;
			border-radius: 24rpx;

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
			background: #f7fbff;

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
