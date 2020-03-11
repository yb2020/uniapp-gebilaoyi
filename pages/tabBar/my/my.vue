<template>
	<view class="my">
		<view class="my-top">
			<view class="my-user">
				<image class="img" src="../../../static/uni.png" mode=""></image>
				<view class="user-name">李嘉桦同学</view>
			</view>
		</view>
		<view class="list-center m-rl-20 d-felx">
			<view class="gird line">
				<image class="img" src="../../../static/uni.png" mode=""></image>
				<view class="name">中心</view>
			</view>
			<view class="gird line">
				<image class="img" src="../../../static/uni.png" mode=""></image>
				<view class="name">中心</view>
			</view>
			<view class="gird line">
				<image class="img" src="../../../static/uni.png" mode=""></image>
				<view class="name">中心</view>
			</view>
			<view class="gird line">
				<image class="img" src="../../../static/uni.png" mode=""></image>
				<view class="name">中心</view>
			</view>
		</view>
		<view class="list-bottom m-rl-20">
			<view class="line d-felx">
				<view class="name">6</view>
				<view class="icon">6</view>
			</view>
			<view class="line d-felx">
				<view class="name">6</view>
				<view class="icon">6</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	}
};
</script>

<style lang="scss" scoped>
.my-top {
	height: 400rpx;
	background: #07c160;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	overflow: hidden;
}
.list-bottom {
	box-shadow: 0 0 22rpx rgba(0, 0, 0, 0.18);
	margin-top: 50rpx;
	border-radius: 10rpx;
	.line {
		padding: 30rpx;
		justify-content: space-between;
		align-items: center;

		box-sizing: border-box;
		.name {
		}
		&:not(:first-child) {
			border-top: 2rpx solid rgba(0, 0, 0, 0.18);
		}
	}
}
.my-user {
	.img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}
	.user-name {
		font-size: 40rpx;
		color: #f1f1f1;
	}
}
.list-center {
	box-shadow: 0 0 22rpx rgba(0, 0, 0, 0.18);
	border-radius: 10rpx;
	flex-wrap: wrap;

	align-items: center;
	text-align: center;
	margin-top: 40rpx;
	box-sizing: border-box;

	.line {
		box-sizing: border-box;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		.img {
			width: 100rpx;
			height: 100rpx;
			box-sizing: border-box;
			display: block;
			margin: 0 auto;
		}
	}
}
.gird {
	width: 33.3%;
}
.m-rl-20 {
	margin-left: 20rpx;
	margin-right: 20rpx;
}
.d-felx {
	display: flex;
}
</style>
