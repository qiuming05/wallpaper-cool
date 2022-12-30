<template>
	<view class="main">
		<view class="search">
			<u-search searchIconSize="38" placeholder="请使用英文进行搜索" height="38px" v-model="keyword" @search="handleSearch"
				@custom="handleSearch">
			</u-search>
		</view>
		<view class="searchHistory">
			<uni-section title="搜索历史" type="line">
				<template v-slot:right>
					<u-icon name='/static/icon/delete.png' :size="38" @click="delAllSearchHistory"></u-icon>
				</template>
			</uni-section>
			<view class="content">
				<view class="tabs">
					<view class="tab-item" v-for="(key) of searchHistory" @click="() => handleKeyword(key)">
						<text>{{key}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="searchGuess">
			<uni-section title="猜你想搜" type="line"></uni-section>
			<view class="content">
				<view class="tabs">
					<view class="tab-item" v-for="(key) of recommend" @click="() => handleKeyword(key)">
						<text>{{key}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	import {
		objToUrl
	} from "@/util/util.js"
	export default {
		data() {
			return {
				keyword: "",
				searchHistory: store.state.$searchHistory,
				recommend: []
			}
		},
		onLoad() {},
		methods: {
			handleSearch(val) {
				if (this.searchHistory.some(ele => ele === val)) {
					this.searchHistory.find((value, index, arr) => {
						if (value === val) {
							this.searchHistory.splice(index, 1);
							this.searchHistory.unshift(val)
							store.commit("SET_SEARCH_HISTORY", this.searchHistory)
							return true
						}
					})
				} else {
					this.searchHistory.unshift(val)
					store.commit("SET_SEARCH_HISTORY", this.searchHistory)
				}
				uni.navigateTo({
					url: '/pages/preview/index?title=' + val + '&q=' + val,
				})
			},
			delAllSearchHistory() {
				this.searchHistory = []
				store.commit("DEL_ALL_SEARCH_HISTORY")
			},
			handleKeyword(key) {
				this.handleSearch(key)
			}
		}
	}
</script>

<style lang="scss">
	.main {
		padding: 0 15px;

		.search {
			padding-top: 25rpx;
		}

		.searchHistory,
		.searchGuess {
			margin: 15px 0;
		}

		.searchHistory {
			.header {
				display: flex;
				justify-content: space-between;
			}
		}

		.title {
			font-size: 18px;
		}

		.tabs {
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			padding-top: 30rpx;

			.tab-item {
				font-size: 14px;
				background-color: #F5F6F8;
				color: #909399;
				border-radius: 40rpx;
				line-height: 60rpx;
				padding: 0 32rpx;
				text-align: center;
				margin-right: 12rpx;
				margin-bottom: 12rpx;
			}
		}
	}
</style>
