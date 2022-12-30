<template>
	<view class="sidebar">
		<view class="icon-item">
			<u-icon :size="iconSize" name='/static/icon/search.png' @click="handleToSearch"></u-icon>
		</view>
		<view class="icon-item">
			<u-icon name='/static/icon/screen.png' :size="iconSize" @click="handletoScreen"></u-icon>
		</view>
		<view class="icon-item" :class="isShowBackTop ? 'icon-show' : 'icon-hide'" @click="handleBackTop">
			<u-icon name='/static/icon/rocket.png' :size="iconSize"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'sidebar',
		props: {
			iconSize: {
				type: Number,
				default: 42
			},
			isShowBackTop: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			handleToSearch() {
				uni.navigateTo({
					url: "/pages/search/index"
				})
			},
			handletoScreen() {
				uni.navigateTo({
					url: "/pages/config/index"
				})
			},
			handleBackTop() {
				this.$emit("backTop")
			},
		}
	}
</script>

<style lang="scss" scoped>
	.sidebar {
		position: fixed;
		right: 5px;
		bottom: 250rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.icon-item {
			width: 38px;
			height: 38px;
			background: rgba(0, 0, 0, 0.3);
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 50%;
			margin: 12rpx 0;
			transition: 0.5s;
		}
	}

	.icon-show {
		transform: translateX(0px);
	}

	.icon-hide {
		transform: translateX(50px);
	}
</style>
