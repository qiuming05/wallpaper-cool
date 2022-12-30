<template>
	<view>
		<u-navbar :autoBack="true" :title="title" title-width="325" title-color="#333333" title-size="28"
			leftIconSize="38" :border-bottom="false"></u-navbar>
		<view class="main" :style="{paddingTop: navbarHeight +'px'}">
			<img-list :data="data" :isload="isload" :height="'calc(100vh - ' + navbarHeight  + 'px)'" refresherEnabled
				:scrollTop="scrollTop" :refresherTriggered="refresherTriggered" @scroll="scrollFun"
				@scrolltolower="scrolltolower" @refresherrefresh="refresherrefresh">
				<template v-slot:top>
					<uni-section :title="`图片总数: ${meta.total}`" type="line"></uni-section>
				</template>
				<template v-if="data.length === 0" v-slot:bottom>
					<view class="empty">
						<view>
							<u-icon name="/static/empty.gif" size="520rpx" />
						</view>
					</view>
				</template>
			</img-list>
		</view>
		<sidebar :isShowBackTop="isShowBackTop" @backTop="handleBackTop"></sidebar>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	import {
		objToUrl
	} from "@/util/util.js"
	const baseUrl = "https://wallhaven.cc/api/v1/"
	export default {
		data() {
			return {
				title: "", // 标题
				data: [], // 图片数据
				page: 1, // 每页24张
				meta: {}, // 保存请求数据的详情
				isShowBackTop: false,
				refresherTriggered: false,
				scrollTop: 0, // 控制滚动高度
				oldScrollTop: 0,
				isload: true, // 是否加载中
				navbarHeight: 44, //导航栏高度
			}
		},
		onLoad({
			title,
			q
		}) {
			this.title = title
			store.state.$filter.q = q
			this.getData().then((res) => {
				this.meta = res.meta
				this.data = res.data
				if (this.data.length === 0) {
					this.isload = false
				}
			})
			uni.getSystemInfo({
				// 导航栏实际高度等于 = 44(导航栏的高度 )+ statusBarHeight(系统状态栏的高度)
				success: res => this.navbarHeight = res.statusBarHeight + 44
			});
		},
		watch: {
			data: function(newVal) {
				if (newVal.length % 24 !== 0) {
					this.isload = false
				}
				store.commit("SET_IMGLIST", newVal)
			}
		},
		methods: {
			scrollFun(e) {
				this.oldScrollTop = e.detail.scrollTop
				this.isShowBackTop = this.oldScrollTop > 200
			},
			handleBackTop() {
				this.scrollTop = this.oldScrollTop
				this.$nextTick(() => {
					this.scrollTop = 0
				});
			},
			refresherrefresh() {
				this.refresherTriggered = true
				this.page = 1
				this.tabTypeDataFill()
				this.getData().then(res => {
					this.meta = res.meta
					this.data = res.data
					this.refresherTriggered = false
					this.isload = true
				})
			},
			getData() {
				return this.$request({
					url: baseUrl + `search?${objToUrl(store.state.$filter)}&page=${this.page}`
				})
			},
			scrolltolower() {
				if (this.isload) {
					this.page++
					this.getData().then(res => {
						this.data = [...this.data, ...res.data]
					})
				}
			},
			tabTypeDataFill() {
				this.data = new Array(12).fill({
					thumbs: {
						original: "/static/loading.gif"
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		padding: 0 15rpx 15rpx 15rpx;

		.empty {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.loading {
			margin-top: 35rpx;
		}

		.title {
			padding: 24rpx 0;
			font-size: 36rpx;
			font-weight: 700;
			text-align: right;
		}
	}
</style>
