<template>
	<view>
		<view class="uni-margin-wrap">
			<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item @tap="previewImage(index)" v-for="(item,index) in goods.imageInfo.imageList" :key="index">
					<image class="swiper-item-image" :src="item.url" mode="aspectFill"></image>
				</swiper-item>
				
			</swiper>
		</view>
		<view class="uni-padding-wrap">
			<text class="media-title">
				<text class="media-jd-title">京东</text>
				{{goods.skuName}}
			</text>
		</view>
		<view class="uni-padding-wrap">
			<view class="simpleContent">
				 <view class="simpleInfo">
					<view class="jdPrice">
						京东价<span>￥{{goods.priceInfo.price}}</span>
					</view>
					<view class="comment">
						{{goods.comments}}条评论 好评率{{goods.goodCommentsShare}}%
					</view>
					<view class="detail">
						查看详情>
					</view>
				 </view>
				 <view class="discount">
					<view class="left"><image src="/static/left.png" /></view>
					<view class="label">优惠券￥{{goods.couponInfo.couponList[0].discount}}</view>
					<view class="right"><image src="/static/right.png" /></view>
				 </view>
				 <view class="couponPrice">
					<view class="couponPriceDiscount">
						券后价￥<span>{{goods.priceInfo.lowestCouponPrice}}</span>
					</view>
				 </view>
			</view>
			
		</view>
		<view class="uni-margin-wrapper uni-padding-wrapper">
			<text class="media-jd-info">
				商品来自京东，售后无忧
			</text>
		</view>
		<view class="uni-margin-wrapper uni-padding-wrapper">
			<text class="media-goods-number">
				商品编号：{{goods.skuId}}
			</text>
		</view>
		
		<view class="media-goods-detail">
			<view class="title">商品详情</view>
			<view @tap="previewImage(index)" class="goods-image-item" v-for="(item,index) in goods.imageInfo.imageList" :key="index">
				<image :src="item.url"></image>
			</view>
		</view>
		
		<view class="goods-carts">
			<uni-goods-nav @click="leftClick" @buttonClick="buttonClick" :options="options" :button-group="buttonGroup" />
		</view>
		
		<!-- 插屏弹窗 -->
		<uni-popup ref="showPlaybillImage" type="center" :mask-click="true" @change="change">
			<view class="uni-image-close" @click="cancel('image')">
				<uni-icons type="clear" color="#fff" size="30" />
			</view>
			<view class="image">
				<image :src="jdPlaypillPath" mode="scaleToFill" />
			</view>
			<view class="buttonWapper" style="padding-top: 10px ;">
				<button type="primary" size="default" @tap="saveShare">保存到手机相册</button>
			</view>
			<view class="buttonWapper">
				<button type="normal" size="default" @tap="previewPlaypillImage">点我预览，长按分享</button>
			</view>
		</uni-popup>
		
		<!-- 用于一键保存并生成带有二维码的图片，不可删除 -->
		<view style="position:fixed;top:999999999999999999999rpx;"> 
			<canvas :style="{ width: '100vw', height: canvasHeight }" :canvas-id="canvasId" ></canvas>
		</view>
		
		
		<uni-popup ref="sharePopup" type="bottom" @change="change">
			<view class="uni-share">
				<view class="uni-common-mb">
					<button style="width: 95%; margin-top: 10px;" type="primary" size="default" @tap="shareMiniProgramClick">分享商品海报（锁粉）</button>
					<button style="width: 95%; margin-top: 10px;" type="default" size="default" open-type="share">发送给朋友（锁粉）</button>
				</view>
			</view>
		</uni-popup>
		
	</view>
</template>

<script>
	import ACLApi from '@/common/ACL'
	import laoyiApi from '@/api/laoyi';
	import publicAccount from "@/pages/components/publicAccount"
	import uniGoodsNav from '@/components/uni-goods-nav/uni-goods-nav.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import goodsPlaypillUtils from '@/pages/components/home/utils'
	import base64src from '@/common/base64src'
	import canvasUtil from '@/common/canvasUtil'
	import { formatTime, parseTime, createUniqueString } from '@/utils'
	
	export default {
		data() {
			return {
				goods: {},
				userInfo: this.$store.state,
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				
				canvasId: 'reportCanvas',
				canvasHeight: '100vh',
				qrCode: '',
				height: 400,
				menuArrow: true,
				avatorUrl: "",
				nickName: "",
				username: "",
				isAgent: false,
				agent: "",
				
				jdPlaypillPath: '',
				
				options: [{
					icon: '/static/index.png',
					text: '首页'
				}, {
					icon: '/static/feedback.png',
					text: '反馈'
				}, {
					icon: '/static/miniProgram.png',
					//info: 2
					text: '小程序'
				}],
				buttonGroup: [{
						text: '分享海报',
						backgroundColor: '#ffa200 ',
						color: '#fff'
					},
					{
						text: '去购买',
						backgroundColor: '#ff0000',
						color: '#fff'
					}
				]
				
			};
		},
		components:{
			publicAccount, uniGoodsNav, uniPopup
		},
		onLoad(options) {
			if(!options || !options.item) {
				uni.showToast({
				    title: '参数错误！无法访问页面' ,
				    duration: 2000,
				    icon: 'none'
				})
				uni.navigateBack({
					animationDuration: 1000
				})
			}
			this.goods = JSON.parse(decodeURIComponent(options.item))
			uni.setNavigationBarTitle({
				title: this.goods.categoryInfo.cid3Name + "-" + this.goods.brandName
			})
			
			let _this = this
			if(!_this.$store.state.isLogin) {
				uni.showToast({
					title: '没有登录，无法使用小程序的功能！',
					duration: 2000,
					icon: 'none'
				})
				return false 
			}
			if(!_this.avatorUrl) {
				_this.avatorUrl = 'background-image:url("' + this.$store.state.avatarUrl + '");'
			}
			if(!_this.nickName) {
				_this.nickName = this.$store.state.nickName
			}
			if(!_this.username) {
				_this.username = this.$store.state.username
			}
			if(!_this.agent) {
				_this.agent = this.$store.state.agent
			}
			if(!_this.isAgent) {
				_this.isAgent = this.$store.state.isAgent
			}
			
		},
		onShareAppMessage(res) {
			this.$refs['sharePopup'].close()
			return {
				title: '来自' + this.$store.state.nickName + '的分享',
				desc: "【京东】仅需" + this.goods.priceInfo.lowestCouponPrice + "元，即可购买" + this.goods.skuName,
				path: '/pages/home/index?scene=' + this.$store.state.agent
			}
		},
		methods: {
			change(e) {
				console.log(e)
			},
			cancel(type) {
				this.$refs['showPlaybillImage'].close()
			},
			leftClick(info) {
				switch(info.index) {
					case 0 :
						// uni.reLaunch({
						// 	url: '/pages/tabBar/home/home'
						// })
						uni.navigateBack({
							url: '/pages/tabBar/home/home'
						})
						break 
					case 1 :
						
						break ;
					case 2 :
						this.$nextTick(() => {
							this.$refs["sharePopup"].open()
						})
						break ;
				}
			},
			async shareMiniProgramClick() {
				uni.showLoading({
					title: '合成中...'
				})
				let qrCodeObject = await laoyiApi.union.jd.goods.getGoodsQrCode({skuId:this.goods.skuId})
				let imageInfo = await canvasUtil.image.getImageInfo(this.goods.imageInfo.imageList[0].url)
				let imageWidth = imageInfo.width
				let imageHeight = imageInfo.height
				let scale = imageHeight / imageWidth
				
				let systemInfo = await canvasUtil.device.getSystemInfo()
				let canvasHeight = systemInfo.width * scale + 160  //160是给二维码留的
				this.canvasHeight = canvasHeight + "px" //修改画布高度
				
				let playpillPath = imageInfo.path
				
				let canvasId = await goodsPlaypillUtils.canvas.imageToPlaypill(this.canvasId, playpillPath, qrCodeObject.data.wxQrFile, this.goods);
				const fsm = uni.getFileSystemManager();
				
				playpillPath = await canvasUtil.canvas.getCanvasPath(canvasId);
				
				this.jdPlaypillPath = playpillPath
				
				uni.hideLoading()
				
				//生成京东成购买海报
				this.$nextTick(() => {
					this.$refs['showPlaybillImage'].open()
				})
				this.$refs["sharePopup"].close()
				
			},
			async buttonClick(info) {
				switch(info.index) {
					case 0 :
						uni.showLoading({
							title: '合成中...'
						})
						let qrCodeObject = await laoyiApi.union.jd.goods.getGoodsQrCode({skuId:this.goods.skuId})
						let imageInfo = await canvasUtil.image.getImageInfo(this.goods.imageInfo.imageList[0].url)
						let imageWidth = imageInfo.width
						let imageHeight = imageInfo.height
						let scale = imageHeight / imageWidth
						
						let systemInfo = await canvasUtil.device.getSystemInfo()
						let canvasHeight = systemInfo.width * scale + 160  //120是给二维码留的
						this.canvasHeight = canvasHeight + "px" //修改画布高度
						
						let playpillPath = imageInfo.path
						
						let canvasId = await goodsPlaypillUtils.canvas.imageToPlaypill(this.canvasId, playpillPath, qrCodeObject.data.wxQrFile, this.goods);
						const fsm = uni.getFileSystemManager();
						
						playpillPath = await canvasUtil.canvas.getCanvasPath(canvasId);
						
						this.jdPlaypillPath = playpillPath
						
						uni.hideLoading()
						//生成京东成购买海报
						this.$nextTick(() => {
							this.$refs['showPlaybillImage'].open()
						})
						break 
					case 1 :
						uni.showLoading({
							title: '生成购买链接...'
						})
						laoyiApi.union.jd.goods.getUnionHref({
							materialId: this.goods.materialUrl,
							couponUrl: this.goods.couponInfo.couponList[0].link || ""
						}).then(result => {
							if(result.status === 1) {
								let unionGoodsHref = encodeURIComponent(result.data.unionGoodsHref) //牛奶"https://u.jd.com/kQOWls"，测试成功
								let customerinfo = result.data.customerinfo  //3000446153必须传入网站ID
								console.log(result)
								
								let path = ""
								path = `/pages/proxy/union/union?spreadUrl=${unionGoodsHref}&customerinfo=${customerinfo}` //京东爆款详情页
								path = `/pages/union/proxy/proxy?spreadUrl=${unionGoodsHref}&customerinfo=${customerinfo}` //京东购物详情页
								
								uni.navigateToMiniProgram({
									appId: 'wx91d27dbf599dff74',
									path: path ,
									extraData: {
									},
									success(res) {
										console.log(res)
									},
									fail(e) {
										console.log(e)
									}
								})
								setTimeout(() => {
									uni.hideLoading()
								}, 1000)
								
							}
						}).catch(e => {
							console.log(e)
							uni.hideLoading()
							uni.showToast({
								icon: "none" ,
								title: '获取京东推广链接失败!'
							})
						}) 
						
						break ;
				}
			},
			previewImage(index) {
				
				let imageArray = []
				for(var i = 0 ; i < this.goods.imageInfo.imageList.length ; i ++) {
					imageArray.push(this.goods.imageInfo.imageList[i].url)
				}
				uni.previewImage({
					current: imageArray[index],
					urls: imageArray,
					success() {
					},
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			previewPlaypillImage() {
				let that = this
				console.log(that.jdPlaypillPath)
				uni.previewImage({
					urls: [that.jdPlaypillPath],
					success(result) {
						console.log(result)
					},
					fail(e) {
						console.log(e)
					},
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			saveShare() {
				let that = this
				uni.canvasToTempFilePath({
					canvasId: that.canvasId,
					success: (res) => {
						//返回文件路径
						that.imageUrl=res.tempFilePath
						//保存图片到系统相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: (res) => {
								uni.showToast({
									title: '已保存至相册！',
								})
							},
							fail() {
								uni.showToast({
									icon: 'none',
									title: '保存海报失败！'
								})
							}
						})
						
					}
				})
			},
			appShare() {
				//unii-app分享,我在这里是微信分享好友
				uni.canvasToTempFilePath({
					canvasId: 'canvas',
					success: (res) => {
						uni.share({
							provider: "weixin",
							scene: "WXSceneSession",
							type: 2,
							imageUrl: res.tempFilePath,
							success: function (res) {
								console.log(res);
							},
							fail: function (err) {
								console.log("fail:" + JSON.stringify(err));
							}
						});
					}
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../../common/uni-nvue.css';
	
	.uni-margin-wrapper {
		margin-top: 10upx ;
	} 
	.uni-padding-wrapper {
		padding: 10upx ;
		background: #FFFFFF ;
	}
	.media-goods-detail {
		margin-top: 10upx ;
		padding-bottom: 140upx ;
		background: #FFFFFF ;
		.title {
			padding: 10upx 20upx;
		}
	}
	.goods-image-item {
		width: 100% ;
		height: 750rpx;
		overflow: hidden;
		will-change: transform;
	}
	.goods-image-item image{
		width: 100% ;
		height: 100% ;
	}
	
	/* 插屏广告 */
	.uni-image {
		position: relative;
	}
	
	.image {
		width: 280px;
		height: 420px;
		> image {
			width: 100%;
			height: 100%;
		}
	}
	
	.uni-image-close {
		text-align: right;
		padding-right: -20px ; 
	}
	
	.uni-margin-wrap {
		width: 100%;
		margin:0 0;
	}
	.swiper {
		height: 750rpx;
	}
	.swiper-item {
		display: block;
		height: 750rpx;
		line-height: 750rpx;
		text-align: center;
	}
	.swiper-item-image {
		width: 100%;
		height: 100%;
	}
	.uni-padding-wrap {
		padding: 15upx 15upx 0upx 15upx;
		width: auto;
		background: #FFFFFF ;
	}
	.media-jd-title {
		flex: 1;
		color: #FFFFFF;
		background-color: #FF5000;
		padding: 0upx 6upx;
		border-radius: 6upx;
		font-size: 30upx;
		margin-right: 4upx;
		font-weight: normal;
	}
	
	.media-title {
		flex: 1;
		color: #000000 ;
	}
	.buttonWapper {
		padding: 5px ;
		text-align: center;
	}
	
	.media-title {
		lines: 2;
		text-overflow: ellipsis;
		font-size: 30upx;
		color: #333;
	}
	.media-jd-info {
		color: #f00000 ;
		font-weight: normal;
		padding-left: 10upx ;
	}
	.media-goods-number {
		font-weight: normal;
		padding-left: 10upx ;
	}
	
	.goods-carts {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}
	
	.simpleContent {
		padding-left: 10upx;
		
		.simpleInfo {
			display: flex;
			justify-content: space-between;
			
			.jdPrice {
				font-size: 24upx ;
				color: #999999 ;
				flex-direction: row;
				
				> span {
					font-size: 24upx ;
					color: #999999 ;
					text-decoration: line-through;
				}
			}
			.comment {
				font-size: 24upx ;
				color: #999999 ;
			}
			.detail {
				font-size: 24upx ;
				color: #999999 ;
			}
		}
		
		.discount {
			margin-top: 10upx ;
			flex-direction: row;
			display: flex;
			
			.left image {
				width: 4px ;
				height: 24px ;
			}
			.label {
				background: #f00000 ;
				color: #FFFFFF ;
				font-size: 24upx ;
				line-height: 24px ;
				padding: 0upx 5upx ;
				height: 24px ;
			}
			.right image {
				width: 20px ;
				height: 24px ;
			}
		}
		
		
		.couponPrice {
			flex-direction: row;
			justify-content: space-between ;
			align-items: center;
			display: flex;
			
			.couponPriceDiscount {
				font-size: 28upx ;
				flex-direction: row;
				color: #FF3333 ;
				> span {
					font-size: 56upx ;
					font-weight: bolder ;
				}
			}
		}
	}
	
	/* 用户登录 */
	.uni-share {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		background-color: #fff;
	}
	
	
	.uni-share-content-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		width: 200rpx;
	}
	
	.uni-share-content-image {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		width: 180upx;
		height: 180upx;
		overflow: hidden;
		border-radius: 10rpx;
	}
	
	.uni-share-cancel-btn {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 14px;
		border-top-color: #f5f5f5;
		border-top-width: 1px;
		border-top-style: solid;
		text-align: center;
		color: #666;
	}

</style>
