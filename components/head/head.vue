<template>
	<view class="vtop" id="vtop">
		<view class="title" :style="{paddingTop: menuButtonInfo+'px'}">
			<text>壁纸酷</text>
			<u-icon name="/static/icon/flower.png" size="70"></u-icon>
		</view>
	</view>
</template>

<script>
	// 获取系统状态栏的高度
	let menuButtonInfo;
	// 如果是小程序，获取右上角胶囊的尺寸信息，避免导航栏右侧内容与胶囊重叠(支付宝小程序非本API，尚未兼容)
	// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO || MP-QQ
	const {
		top
	} = uni.getMenuButtonBoundingClientRect()
	menuButtonInfo = top
	// #endif
	// #ifdef APP-PLUS
	uni.getSystemInfo({
		success: res => menuButtonInfo = res.statusBarHeight
	});
	// #endif
	export default {
		data() {
			return {
				systemBarHeight: 0, // 系统状态栏的高度
				menuButtonInfo: menuButtonInfo, // 获取小程序顶部的数据，如高度
			}
		},
		created() {
			// this.getSysteminfo();
		},
		methods: {
			// 获取系统栏高度
			getSysteminfo() {
				uni.getSystemInfo({
					success: res => this.systemBarHeight = res.statusBarHeight
				});
			}
		},
		mounted() {
			/* 
			 子组件内，fields回调函数返回null，使用 in(this) 可以获取，如下示例。
			 uni.createSelectorQuery().in(this).select("#id");
			 */
			let view = uni.createSelectorQuery().in(this).select(`#vtop`)
			view.fields({
				size: true
			}, data => {
				this.$emit("VTopH", data)
			}).exec()
		}
	}
</script>

<style lang="scss" scoped>
	.vtop {
		position: sticky;
		top: 0;
		width: 100%;
		background-color: #FFFFFF;
		padding: 0 40rpx 15rpx 40rpx;
		z-index: 101;
		box-shadow: 0 -3px 5px 0px #000;

		.title {
			position: relative;
			color: #303030;
			font-size: 24px;
			line-height: 80rpx;
			display: flex;
			align-items: center;
			flex-direction: row;
		}
	}
</style>
