<template>
	<scroll-view scroll-y="true" scroll-with-animation="true" :lower-threshold="lowerThreshold" :scroll-top="scrollTop"
		:style="{'height': height}" :refresher-enabled="refresherEnabled" :refresher-triggered="refresherTriggered"
		@scroll="handleScroll" @scrolltolower="scrolltolower" @refresherrefresh="refresherrefresh">
		<slot name="top"></slot>
		<view class="previewList">
			<view class="list-item" v-for="(item,index) of data" :key="index" @click="() => {
				handleClick({item,index})
				redirect(index)
			}">
				<!-- 	<image class="list-item-bg" mode="aspectFill" :src="item.thumbs.original" lazy-load /> -->
				<lazy-image :src="item.thumbs.original"></lazy-image>
			</view>
		</view>
		<slot name="bottom">
			<view class="loading" v-if="isload">
				<u-loading-icon mode="semicircle" text="加载中" textSize="32"></u-loading-icon>
			</view>
		</slot>
	</scroll-view>
</template>

<script>
	import store from '@/store/index.js'; //需要引入store
	export default {
		name: 'img-list',
		props: {
			data: {
				type: Array,
				require: true,
				default: []
			},
			isload: { // 是否处于加载中
				type: Boolean,
				default: false
			},
			lowerThreshold: {
				type: [Number, String],
				default: 100
			},
			height: {
				type: String,
				default: "420px"
			},
			refresherEnabled: {
				type: Boolean,
				default: false
			},
			refresherTriggered: {
				type: Boolean,
				default: false
			},
			scrollTop: {
				type: Number,
				default: 0
			}
		},
		methods: {
			redirect(index) { // 点击后重定向
				store.commit("SET_INDEX", index)
				uni.navigateTo({
					url: "/pages/detail/index"
				})
			},
			scrolltolower() {
				this.$emit("scrolltolower")
			},
			handleScroll(e) {
				this.$emit("scroll", e)
			},
			refresherrefresh(e) {
				this.$emit("refresherrefresh")
			},
			handleClick(e) {
				this.$emit("click", e)
			}
		}
	}
</script>

<style lang="scss">
	.loading {
		margin-bottom: 150px;
	}

	.previewList {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15rpx;

		.list-item {
			position: relative;
			border-radius: 8px;
			overflow: hidden;
			height: 240rpx;
			box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);

			.list-item-bg {
				border-radius: 25rpx;
				width: 100%;
				height: 100%;
			}
		}

		.list-item:last-child {
			margin-bottom: 150px;
		}
	}
</style>
