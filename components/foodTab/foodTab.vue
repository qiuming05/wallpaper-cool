<template>
	<view class="bottom">
		<view class="nav-box">
			<view class="nav-tab" :class="{'nav-tab-active':index===0}" @click="handelSwitchTab(0)">
				<u-icon :name="index===0?'/static/tabbar/home_art.png':'/static/tabbar/home.png'" size="50"></u-icon>
				<text>首页</text>
			</view>
			<view class="nav-tab" :class="{'nav-tab-active':index===1}" @click="handelSwitchTab(1)">
				<u-icon :name="index===1?'/static/tabbar/center_art.png':'/static/tabbar/center.png'" size="50">
				</u-icon>
				<text>分类</text>
			</view>
			<view class="nav-tab" :class="{'nav-tab-active':index===2}" @click="handelSwitchTab(2)">
				<u-icon :name="index===2?'/static/tabbar/user_art.png':'/static/tabbar/user.png'" size="50"></u-icon>
				<text>我的</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			index: {
				type: Number,
				default: 0
			}
		},
		methods: {
			handelSwitchTab(index) {
				this.$emit('switchTab', index)
			}
		}
	}
</script>

<style scoped lang="scss">
	.bottom {
		position: fixed;
		bottom: 40rpx;
		left: 4%;
		right: 0;
		width: 92%;
		height: 50px;
		box-shadow: 0 0px 8px 0px rgba(0, 0, 0, 0.2);
		background: rgba(255, 255, 255, 0.86);
		-webkit-backdrop-filter: saturate(180%) blur(20px);
		backdrop-filter: saturate(180%) blur(20px);
		border-radius: 20px;
		z-index: 10;
		padding: 32px 0;
		display: flex;
		align-items: center;

		.nav-box {
			/* position: absolute; */
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
			width: 100%;
			box-sizing: border-box;

			.nav-tab {
				width: 100%;
				height: 50px;
				font-size: 12px;
				color: #909399;
				font-weight: 400;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
			}

			.nav-tab-active text {
				color: #000000;
			}
		}
	}

	/*苹果x适配 H5APP*/
	@media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
		.bottom {
			bottom: 40rpx + 34rpx;
		}
	}

	/*苹果xs适配 H5APP*/
	@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) {
		.bottom {
			bottom: 40rpx + 34rpx;
		}
	}

	/*苹果xr适配 H5APP*/
	@media only screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) {
		.bottom {
			bottom: 40rpx + 34rpx;
		}
	}
</style>
