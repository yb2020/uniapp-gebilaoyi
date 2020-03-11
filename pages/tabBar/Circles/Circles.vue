<template>
	<view class="Circles">
		<view class="camera " @click="openText" :style="{'top':statusBarHeight}"><image class="camera-img" src="" mode=""></image></view>
		<view class="top-content">
			<view class="top-background">
				<swiper class="swiper" :indicator-dots="false" :disable-touch="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
					<swiper-item><view class="swiper-item" style="background: #000000;">1</view></swiper-item>
					<swiper-item><view class="swiper-item" style="background-color: #4CA2FF;">2</view></swiper-item>
					<swiper-item><view class="swiper-item" style="background-color: #8A6DE9;">3</view></swiper-item>
				</swiper>
			</view>
			<view class="user p-rl-20">
				<text class="user-name p-rl-20">老哈哈</text>
				<image class="user-img" src="../../../static/shuijiao.jpg" mode=""></image>
			</view>
		</view>

		<view class="list p-rl-20 mb-100">
			<view class="line d-flex-b" v-for="(item, index) of list" :key="index">
				<image class="user-img-s" src="../../../static/shuijiao.jpg" mode=""></image>
				<view class="line-content p-rl-10">
					<view class="line-name d-flex-b">
						{{ item.rootName }}
						<view class="Share" @click="copyBtn(index)">分享</view>
					</view>
					<view class="line-text">{{ item.rootText }}</view>
					<view class="line-imgAll d-flex f-row">
						<image class="image" v-for="(val, i) of item.rootlist" :key="i" :src="val" mode=""></image>

						<image class="image" src="../../../static/shuijiao.jpg" mode=""></image>
					</view>
					<view class="line-bottom d-flex-b ">
						<view class="date">{{ item.rootDate }}</view>
						<view class="remark">
							<view class="remark-off" @click.stop="remarkOff(index)">...</view>
							<view class="d-flex remark-click" :class="remark == index ? 'remark-show' : 'remark-hidden'">
								<view class="Tags" @click.stop="Tags">
									<image class="min p-rl-10" :src="tags ? '../../../static/apiHL.png' : '../../../static/api.png'" mode=""></image>
									<text class="p-rl-10">点赞</text>
								</view>

								<view class="evaluate">
									<image class="min p-rl-10" src="../../../static/api.png" mode=""></image>
									<text class="p-rl-10">评论</text>
								</view>
							</view>
						</view>
					</view>
					<view class="remark-item">
						<view class="remark-tabs"><text></text></view>
						<view class="remark-text"></view>
					</view>
				</view>
			</view>
		</view>

		<uni-popup :show="true" type="middle" msg="popup 文字内容"></uni-popup>
	</view>
</template>

<script>
import app from '../../../App.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

export default {
	components: { uniPopup },
	data() {
		return {
			remark: -1,
			tags: false,

			type: false,
			list: [],
			statusBarHeight:''
		};
	},
	onLoad() {
		//mock数据
		uni.request({
			url: 'https://api.com/api?data=member',
			success: res => {
				this.list = res.data.list;
				console.log(this.list);
			}
		});
		var res = uni.getSystemInfoSync()
		this.statusBarHeight = (res.statusBarHeight+30 + 'px')
		console.log(res)
	},
	
	
	
	methods: {
		openText() {
			uni.navigateTo({
				url: '../../Publications/index'
			});
		},
		//点击展开
		remarkOff(index) {
			console.log(index);
			this.remark = index == this.remark ? -1 : index;
		},
		copyBtn(index) {
			var that = this;
			uni.setClipboardData({
				//去找上面的数据
				data: that.list[index].rootText,
				success: function(res) {
					uni.showToast({
						title: '复制成功',
						icon:"none",
						duration: 2000
					});
				}
			});
		},
		Tags() {
			// this.remark = !this.remark;
			// this.tags = !this.tags;
		}
	}
};
</script>

<style lang="scss" scoped>
.swiper {
	height: 100%;
	.swiper-item {
		height: 100%;
	}
}
.camera {
	position: fixed;
	width: 80rpx;
	height: 80rpx;
	background: #000000;
	top: 50rpx;
	right: 0;
	z-index: 989999;
	display: flex;
	justify-content: center;
	align-items: center;
	.camera-img {
		width: 40rpx;
		height: 40rpx;
		background: red;
	}
}
.Circles {
	.top-content {
		height: 500rpx;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
		.top-background {
			height: 450rpx;
			// background: #ff5000;
		}
	}
}
.Share {
	color: #07c160;
}
.line {
	flex-wrap: wrap;
	.line-content {
		.line-name {
			align-items: center;
		}
	}

	&:not(:first-child) {
		border-top: 2rpx solid #cccccc;
		padding-top: 30rpx;
	}
	margin-bottom: 20rpx;
	.remark-item {
		width: 100%;
	}
}
.user {
	height: 150rpx;
	box-sizing: border-box;
	position: absolute;
	bottom: 0;
	right: 0;
	display: flex;
	align-items: center;
}
.user-name {
	display: inline-block;
}
.user-img {
	width: 100rpx;
	height: 100rpx;
	border-radius: 10rpx;
	background: #07c160;
}
.line-text {
	width: 590rpx;
}
.user-img-s {
	width: 80rpx;
	height: 80rpx;
	border-radius: 10rpx;
	background: #07c160;
	box-sizing: border-box;
}
.line-imgAll {
	width: 590rpx;
	overflow: hidden;
	&::after {
		content: '';
		display: block;
		width: 190rpx;
		height: 0;
	}
	.image {
		width: 190rpx;
		height: 190rpx;
		margin-right: 1%;
		margin-bottom: 1%;
	}
}
.line-bottom {
	position: relative;
	align-items: center;
	height: 80rpx;
	box-sizing: border-box;
}
.remark-click {
	width: 300rpx;
	height: 100%;
	position: absolute;
	align-items: center;
	top: 0;
	right: 60rpx;
	background: #323233;
	border-radius: 10rpx;
	color: #f1f1f1;
	transition: opacity 1s;
	&::after {
		border: 10rpx solid transparent;
		border-left: 15rpx solid #323233;
		position: absolute;
		content: '';
		top: 50%;
		margin-top: -10rpx;
		left: 100%;
	}
	.min {
		width: 40rpx;
		height: 40rpx;
	}
	.Tags {
		flex: 6;
		display: flex;

		align-items: center;
	}
	.evaluate {
		@extend .Tags;
	}
}
.remark-off {
	width: 40rpx;
	height: 40rpx;
	background: #6d6d72;
	border-radius: 10rpx;
	color: #f1f1f1;
	display: flex;
	align-items: flex-end;
	justify-content: center;
}
.remark-show {
	opacity: 1;
}
.remark-hidden {
	opacity: 0;
	z-index: -9999;
}
.p-rl-20 {
	padding-left: 20rpx;
	padding-right: 20rpx;
}
.p-rl-10 {
	padding-left: 10rpx;
	padding-right: 10rpx;
}
.p-t-10 {
	padding-top: 10rpx;
}
.p-t-20 {
	padding-top: 20rpx;
}
.p-t-30 {
	padding-top: 30rpx;
}
.p-t-40 {
	padding-top: 40rpx;
}
.p-b-10 {
	padding-bottom: 10rpx;
}
.p-b-20 {
	padding-bottom: 20rpx;
}
.p-b-30 {
	padding-bottom: 30rpx;
}
.p-b-40 {
	padding-bottom: 40rpx;
}
.p-b-20 {
	padding-right: 20rpx;
}
.d-flex {
	display: flex;
}
.d-flex-b {
	display: flex;
	justify-content: space-between;
}
.f-row {
	flex-wrap: wrap;
}
.mb-100 {
	margin-bottom: 150rpx;
}
</style>
