<template>
	<view class="main">
		<uni-section title="场景" subTitle="purity" type="line">
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
		<u-divider text="下拉刷新生效" textSize="24"></u-divider>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				filter: {},
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
		onShow() {
			this.filter = store.state.$filter
			// 还原上次配置
			if (this.filter.purity.length === 2) {
				this.purity.value = [0, 1]
			} else {
				this.purity.range.find((val, index) => {
					if (val.text === this.filter.purity[0]) {
						this.purity.value = [this.purity.range[index].value]
						return true
					}
				})
			}
			this.sort.columns.find((val, index) => {
				if (val.value === this.filter.sort) {
					this.sort.value = this.sort.columns[index].value
					return true
				}
			})
			this.atleast.columns.find((val, index) => {
				if (val.value === this.filter.atleast) {
					this.atleast.value = this.atleast.columns[index].value
					return true
				}
			})
		},
		watch: {
			filter: {
				handler: function(val) {
					store.commit("SET_FILTER_OBJ", val)
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
					this.filter.purity = ["SFW"]
				} else {
					this.filter.purity = []
					for (let val of data) {
						this.filter.purity.push(val.text)
					}
				}
			},
			AtleastChange(v) {
				this.filter.atleast = v
			},
			SortChange(v) {
				this.filter.sort = v
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
