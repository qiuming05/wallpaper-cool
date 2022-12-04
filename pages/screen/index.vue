<template>
	<view class="main">
		<uni-section title="purity" subTitle="观看场景" type="line">
			<view class="checkbox">
				<uni-data-checkbox mode="tag" multiple v-model="purity.value" :localdata="purity.range"
					@change="checkboxChange">
				</uni-data-checkbox>
			</view>
		</uni-section>
		<uni-section title="排序" :subTitle="sort.value" type="line" @click="() => SortShow()">
			<template v-slot:right>
				<u-icon name="arrow-down" color="#909399" size="28"></u-icon>
			</template>
			<uni-data-select v-model="sort.value" :placeholder="sort.value" :localdata="sort.columns"
				@change="SortChange">
			</uni-data-select>
		</uni-section>

		<uni-section title="分辨率" :subTitle="atleast.value" type="line" @click="() => AtleastShow()">
			<template v-slot:right>
				<u-icon name="arrow-down" color="#909399" size="28"></u-icon>
			</template>
			<uni-data-select v-model="atleast.value" :placeholder="atleast.value" :localdata="atleast.columns"
				@change="AtleastChange" label="">
			</uni-data-select>
		</uni-section>
		</u-picker>
		<u-divider text="配置完下拉刷新即可生效" textSize="24"></u-divider>
	</view>
</template>

<script>
	import store from '@/store/index.js'; //需要引入store
	export default {
		data() {
			return {
				screen: {},
				purity: {
					value: [1],
					range: [{
						"value": 0,
						"text": "SFW"
					}, {
						"value": 1,
						"text": "Sketchy"
					}],
				},
				sort: {
					value: '请选择',
					columns: [{
						text: '最新',
						value: "date_added",
						id: 0
					}, {
						text: '最热',
						value: "hot",
						id: 1
					}, {
						text: '随机',
						value: "random",
						id: 2
					}, {
						text: '热门列表',
						value: "toplist",
						id: 3
					}, {
						text: '最多收藏',
						value: "favorites",
						id: 4
					}],
				},
				atleast: {
					value: '请选择',
					columns: [{
						text: '不限',
						value: "",
						id: 0
					}, {
						text: '1080p',
						value: "1920x1080",
						id: 1
					}, {
						text: '2k+',
						value: "2560x1080",
						id: 2
					}, {
						text: '4k+',
						value: "3840x2160",
						id: 3
					}, {
						text: '8k+',
						value: "7680x4320",
						id: 4
					}],
				}
			}
		},
		onLoad() {},
		onShow() {
			this.screen = store.state.$screen
			// 初始化还原上次配置
			if (this.screen.purity.length === 2) {
				this.purity.value = [0, 1]
			} else {
				this.purity.range.find((val, index) => {
					if (val.text === this.screen.purity[0]) {
						this.purity.value = [this.purity.range[index].value]
						return true
					}
				})
			}
			this.sort.columns.find((val, index) => {
				if (val.value === this.screen.sort) {
					this.sort.value = this.sort.columns[index].value
					return true
				}
			})
			this.atleast.columns.find((val, index) => {
				if (val.value === this.screen.atleast) {
					this.atleast.value = this.atleast.columns[index].value
					return true
				}
			})
		},
		watch: {
			screen: {
				handler: function(val) {
					store.commit("SET_OBJ_SCREEN", val)
				},
				deep: true
			}
		},
		methods: {
			checkboxChange(e) {
				const {
					data
				} = e.detail

				if (data.length === 0) {
					this.purity.value[0] = 0
					this.screen.purity = ["SFW"]
				} else {
					this.screen.purity = []
					for (let val of data) {
						this.screen.purity.push(val.text)
					}
				}
			},
			AtleastChange(v) {
				this.screen.atleast = v
			},
			SortChange(v) {
				this.screen.sort = v
			}
		}
	}
</script>

<style lang="scss">
	.main {
		padding: 0 20rpx;

		.checkbox {
			padding-left: 24px;
		}
	}
</style>
