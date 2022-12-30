<template>
	<view class="bottom">
		<view class="nav-box">
			<view class="nav-tab" :class="{'nav-tab-active':index===0}" @click="handelSwitchTab(0)">
				<u-icon :name="index===0?'/static/tabbar/home_art.png':'/static/tabbar/home.png'" size="42"></u-icon>
			</view>
			<view class="nav-tab" :class="{'nav-tab-active':index===1}" @click="handelSwitchTab(1)">
				<u-icon :name="index===1?'/static/tabbar/crown_art.png':'/static/tabbar/crown.png'" size="42">
				</u-icon>
			</view>
			<view class="nav-tab" :class="{'nav-tab-active':index===2}" @click="handelSwitchTab(2)">
				<u-icon :name="index===2?'/static/tabbar/user_art.png':'/static/tabbar/user.png'" size="42"></u-icon>
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
		left: 50%;
		transform: translateX(-50%);
		border-radius: 65rpx;
		z-index: 6;
		display: flex;
		align-items: center;
		box-shadow: 0 0px 8px 0px rgba(0, 0, 0, 0.2);
		background: rgba(255, 255, 255, 0.86);
		-webkit-backdrop-filter: saturate(180%) blur(20px);
		backdrop-filter: saturate(180%) blur(20px);

		.nav-box {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
			width: 375rpx;
			height: 100%;
			box-sizing: border-box;
			padding: 12rpx 0;

			.nav-tab {
				border-radius: 50%;
				width: 88rpx;
				height: 88rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				transition: .5s;
				box-shadow: 3px 2px 5px rgba(0, 0, 0, 0.25);
			}

			.nav-tab-active {
				box-shadow: inset 3px 2px 5px rgba(255, 255, 255, 0.25);
				background: #6b76ec;
			}
		}
	}
</style>
