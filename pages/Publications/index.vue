<template>
	<view>
		<Header><view slot="right" class="header-r" @click="ClickEnd">发表</view></Header>
		<textarea v-model="text" class="p-rl-20 input-text" maxlength="500" placeholder="这一刻的想法"></textarea>
		<view class="p-rl-20 list flex">
			<view class="item" v-for="(item, index) in imageAll" :key="index">
				<image class="w-100 h-100" @click.stop="preview(index)" :src="item" mode=""></image>
				<view class="close" @click.stop="close(index)"></view>
			</view>
			<view class="item item-add" @click.stop="openImage"></view>
		</view>
	</view>
</template>

<script>
import Header from '../../header/header.vue';
import app from '../../App.vue'
export default {
	components: {
		Header
	},
	data() {
		return {
			imageAll: [],
			text: ''
		};
	},
	methods: {
		close(index) {
			this.imageAll.splice(index, 1);
		},
		ClickEnd(){
			app.globalData.test= '669'
		},
		preview(index) {
			console.log(index);
			uni.previewImage({
				current:index,
				urls: this.imageAll,
				longPressActions: {
					itemList: ['发送给朋友', '保存图片', '收藏'],
					success: function(data) {
						console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					},
					fail: function(err) {
						console.log(err.errMsg);
					}
				}
			});
		},
		openImage() {
			var that = this;
			uni.chooseImage({
				count: 6, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择、摄像头
				success: function(res) {
					that.imageAll = res.tempFilePaths;
					// console.log(res.tempFilePaths);
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.w-100 {
	width: 100%;
}
.h-100 {
	height: 100%;
}
.header-r {
	height: 50rpx;
	width: 90rpx;
	color: #f1f1f1;
	text-align: center;
	background-color: #07c160;
}
.item {
	width: 220rpx;
	height: 220rpx;
	
	border-radius: 10rpx;
	margin-top: 10rpx;
	position: relative;
	.close {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		top: 0;
		right: 0;
		background: #07c160;
		border-radius: 10rpx;
	}
}

.p-rl-20 {
	padding-left: 40rpx;
	padding-right: 40rpx;
}
.flex {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
}
.p-rl-20 {
	padding-left: 40rpx;
	padding-right: 40rpx;
}

.input-text {
	width: 100%;
	height: 300rpx;

	overflow-y: auto;
	box-sizing: border-box;
	padding: 40rpx;
}

.list::after {
	content: '';
	display: block;
	width: 220rpx;
	height: 0;
}

.item-add {
	width: 220rpx;
	height: 220rpx;
	background: #555555;
	border-radius: 10rpx;
	position: relative;
}

.item-add::after {
	content: '';
	display: block;
	width: 10rpx;
	height: 150rpx;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 10rpx;
	background: aliceblue;
}

.item-add::before {
	content: '';
	display: block;
	width: 150rpx;
	height: 10rpx;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	border-radius: 10rpx;
	background: aliceblue;
}
</style>
