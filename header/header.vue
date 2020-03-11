<template>
	<view class="header" :style="{ height: hieght }">
		<slot name="left"><view class="left" @click="left"></view></slot>

		<slot name="right"><view class="right" @click="open"></view></slot>
	</view>
</template>

<script>
import app from '../App.vue';
export default {
	data() {
		return {
			hieght: app.globalData.phoneHeight
		};
	},
	methods:{
		open(){
			uni.navigateTo({
				url:'/pages/Publications/index'
			})
		},
		left(){
			uni.navigateBack({
			    delta: 1
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.header {
	display: flex;
	padding: 0 40rpx;
	height: 100rpx;
	justify-content: space-between;
	align-items: center;
	.left {
		height: 30rpx;
		width: 30rpx;
		position: relative;
		overflow: hidden;
		transform: rotate(45deg);
		&::after {
			content: '';
			display: block;
			position: absolute;
			width: 5rpx;
			height: 30rpx;
			background: #000000;
			top: 0;
		}
		&::before {
			content: '';
			display: block;
			position: absolute;
			width: 30rpx;
			height: 5rpx;
			background: #000000;
			bottom: 0;
		}
	}
	.right {
		height: 30rpx;
		width: 50rpx;
		background: #000000;
	}
}
</style>
