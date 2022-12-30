<template>
	<view class="main">
		<view class="title">{{config.title}}</view>
		<view class="subhead">版本：{{config.version}}</view>
		<view class="subhead">更新时间：{{config.updateTime}}</view>
		
		<view class="disclaimers">
			免责声明：{{config.tips}}
		</view>
	</view>
</template>

<script>
	import config from '@/util/config.js'
	export default {
		data() {
			return {
				config,
			}
		},
		onLoad() {

		}
	}
</script>

<style lang="scss">
	.main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;

		.title {
			font-size: 48rpx;
			font-weight: 900;
		}

		.subhead {
			font-size: 32rpx;
		}

		.disclaimers{
			position: fixed;
			bottom: 3%;
			left: 0;
			width: 100%;
			font-size: 24rpx;
			text-align: center;
			color: #c5c5c5;
		}
	}
</style>
