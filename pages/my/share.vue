<template>
	<view class="uni-container">
		<view class="padding flex flex-direction">
			<canvas style="width:100%;" :style="{ height: height + 'px' }" canvas-id="canvas" ></canvas>
			
			<view class="uni-btn-v">
				<button :loading="isLoading" :disabled="isLoading" form-type="submit" type="primary" @tap="saveShare">保存到手机</button>
				<button type="default" form-type="reset" open-type="share">分享</button>
			</view>
			
			<publicAccount />
			
		</view>
		
	</view>
</template>

<script>
	import ACLApi from '@/common/ACL'
	import publicAccount from "@/pages/components/publicAccount"
	import base64src from '@/common/base64src'
	
	export default {
		data() {
			return {
				qrCode: '',
				height: 400,
				menuArrow: true,
				avatorUrl: "",
				nickName: "",
				username: "",
				isAgent: false,
				agent: ""
			};
		},
		components:{
			publicAccount
		},
		onLoad() {
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
			
			ACLApi.qr.app.getPersonalQRCode({
				agent: this.$store.state.agent,
				appId: this.$store.state.appName
			}).then(result => {
				this.qrCode = result.data
				_this.toDrawCanvas()
			})
			
		},
		onShareAppMessage(res) {
			return {
				title: '来自' + this.$store.state.nickName + '的分享',
				desc: '来看看老易做的新玩意吧！',
				path: '/pages/home/index?scene=' + this.$store.state.agent
			}
		},
		methods: {
			toDrawCanvas() {
				let that=this
				
				uni.getSystemInfo({
					success: function(e) {
						//获取屏幕宽高设置画布宽高
						let width = e.windowWidth;
						let height = that.height;
						let paddingWidth = 40 ;
						let topheight = 180;//图片距离上边距离
						const ctx = uni.createCanvasContext('canvas');
						// 底色
						ctx.fillStyle = '#FFFFFF';  //填充颜色
						ctx.fillRect(0, 0, width, height); 
						
						var avatarSize = 100;    //绘制的头像宽度
						var avatarurl_heigth = 100;   //绘制的头像高度
						var avatarurl_x = 50;   //绘制的头像在画布上的位置
						var avatarurl_y = 50;   //绘制的头像在画布上的位置
						
						uni.getImageInfo({
							src: that.$store.state.avatarUrl,
							success(res) {
								// ctx.arc(
								// 	avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false
								// ); 
								// ctx.clip()  //裁剪
								ctx.drawImage(res.path, (width - avatarSize - paddingWidth) / 2, 30 , avatarSize, avatarSize);
								
								//绘制序列从上到下， 通过距离上边高度来排列显示
								// 文字内容
								ctx.setTextAlign('center'); // 文字居中
								
								ctx.setFillStyle('#333333'); // 文字颜色：黑色
								ctx.setFontSize(14); // 文字字号：22px
								ctx.fillText(that.$store.state.nickName, (width - paddingWidth) / 2, topheight - 30);
								
								ctx.setFillStyle('#FF5000'); 
								ctx.setFontSize(20); 
								ctx.fillText('一起探索更多的可能吧！', (width - paddingWidth) / 2, topheight);
								// 小程序码
								const qrImgSize = 170;
								base64src(that.qrCode).then(filePath =>{
									ctx.drawImage(filePath, (width - qrImgSize - paddingWidth) / 2, topheight + 20 , qrImgSize, qrImgSize);
									ctx.stroke();
									ctx.draw();
								})
								
							}
						})
						
					}
				});
				
			},
			saveShare() {
				let that = this
				uni.canvasToTempFilePath({
					canvasId: 'canvas',
					success: (res) => {
						//返回文件路径
						that.imageUrl=res.tempFilePath
						//保存图片到系统相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: (res) => {
								uni.showToast({
									title: '保存成功'
								})
							},
							fail() {
								uni.showToast({
									icon: 'none',
									title: '保存小程序码失败'
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
	@import '../../common/uni-nvue.css';
	
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.page.show {
		overflow: hidden;
	}

</style>
