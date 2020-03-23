<template>
	<view class="uni-container">
		<view class="view userinfo-avatar-wapper">
			<image class="userinfo-avatar" :src="data.createUser.avatarUrl"></image>
			<text class="media-title" :class="{'media-title2': true}">{{data.createUser.nickName}}</text>
		</view>
		
		
		<view class="uni-textarea">
			{{data.content}}
		</view>
		
		<view class="uni-common-mt">
			<view class="uni-uploader-body">
				<view class="uni-uploader__files">
					<block v-for="(image,index) in data.imagesThumbnailBase64Array" :key="index">
						<text v-if="deleteImgButtonShow" class="uni-badge-red" style="position: absolute; top: 0;right: 0;" @tap="deleteImage(index)">删除</text>
						<view class="uni-uploader__file">
							<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage(data.id, index)"></image>
						</view>
					</block>
				</view>
			</view>
		</view>
		
		<view class="uni-btn-v" v-if="user.isLogin">
			<button v-if="data.creator === user.username" class="uni-bg-blue" :loading="isSaveLoading" :disabled="isSaveLoading" @tap="onePressSave">一键保存</button>
			<button v-if="data.creator !== user.username" :loading="isLoading" :disabled="isLoading" @tap="onePressRelay" type="primary">一键转发</button>
			<button type="default" @tap="toBack">返回</button>
		</view>
		
		<view class="uni-btn-v" v-else>
			<button class="uni-bg-blue" @tap="toLogin">登录</button>
			<button type="default" @tap="toBack">返回</button>
		</view>
		
		<publicAccount />
		
		<!-- 用于一键保存并生成带有二维码的图片，不可删除 -->
		<view style="position:fixed;top:999999999999999999999rpx;">
			<canvas :style="{ width: '100vw', height: canvasHeight }" :canvas-id="canvasId" ></canvas>
		</view>
		
		<Login ref="login" @close="closeLogin" @done="doneLogin"></Login>

	</view>
</template>

<script>
	import laoyiApi from "@/api/laoyi"
	import base64src from '@/common/base64src'
	import ACLApi from '@/common/ACL'
	import Login from "@/pages/components/login"
	import canvasUtil from '@/common/canvasUtil'
	import {createUniqueString} from '@/utils'
	import publicAccount from "@/pages/components/publicAccount"
	import toolUtils from '@/pages/components/circleFriends/utils'
	import Authorization from "@/common/Authorization"
	
	var util = require('@/common/util.js');
	
	export default {
		components: {
			publicAccount,Login
		},
		onLoad(scene) {
			this.id = scene.id
			if(this.user.isLogin) {
				this.initData()
			}
			
		},
		data() {
			return {
				id: '',
				user: this.$store.state,
				data: {
					content: '请登录后查看并转发'
				},
				originImageArray: [],
				isLoading: false,
				isSaveLoading: false,
				canvasHeight: 0,
				canvasId: 'reportCanvas'
			};
		},
		methods: {
			toLogin() {
				if(!Authorization.checkLogin()) {
					this.$refs["login"].open()
					return false
				}else {
					this.init()
					return true
				}
				
			},
			closeLogin() {
				console.log("stop login")
			},
			async initData() {
				var {data} = await laoyiApi.personal.imageText.getDetailById({id: this.id})
				this.data = data	
			},
			doneLogin(bool) {
				if(bool) {
					this.initData()
				}
			},
			toBack() {
				this.$store.dispatch('toggleRefreshTool')
				uni.switchTab({//跳转到图文详情页
					url: '/pages/tabBar/tool/tool',
					success: (e) => {
						console.log(e)
					},
					fail: (e) => {
						console.log(e)
					}
				})
			},
			downLoadOriginImage(id) {
				let _this = this
				return new Promise((resolve, reject) => {
					if(!_this.originImageArray || _this.originImageArray.length === 0) {
						laoyiApi.personal.imageText.downLoadOriginImage({id: id}).then(result => {
							_this.originImageArray = result.data
							resolve(_this.originImageArray)
						}).catch(e => {
							reject(e.getMessage)
						})
					}else {
						resolve(_this.originImageArray)
					}
					
				})
			},
			async previewImage(id, index) {
				//var current = e.target.dataset.src;
				uni.showLoading({
					title: '正在下载原图'
				})
				let imagesBase64Array = await this.downLoadOriginImage(id)
				
				uni.previewImage({
					current: imagesBase64Array[index],
					urls: imagesBase64Array,
					success() {
						uni.hideLoading()
					},
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							//console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			copyText(content) {
				uni.setClipboardData({
				    data: content,
				    success: function () {
						uni.showToast({
						    title: "文字已经复制，长按粘贴即可使用！" ,
						    duration: 2000,
						    icon: 'none'
						})
				    }
				});
			},
			onePressRelay() {
				let _this = this
				let row = this.data
				this.isLoading = true
				uni.showLoading({
					title: '转发中...'
				})
				laoyiApi.personal.imageText.relay({id: row.id}).then(result => {
					uni.hideLoading()
					uni.showToast({
						title: result.message,
						duration: 2000,
						success() {
							//跳转到自己的列表
							_this.$store.dispatch('toggleRefreshTool')
							uni.switchTab({
								url: '/pages/tabBar/tool/tool'
							})
						}
					})
					
					this.isLoading = false
				})
				
				return false 
				if(row.creator === this.user.username) {
					uni.showToast({
					    title: "自己不能转发自己的图文！" ,
					    duration: 2000,
					    icon: 'none'
					})
				}else {
					
				}
			},
			async onePressSave() {
				let _this = this
				let row = this.data
				//this.isSaveLoading = true
				
				uni.showLoading({
					title: '正下载原图并合成海报'
				})
				let imagesBase64Array = await this.downLoadOriginImage(row.id)
				
				_this.copyText(row.content)
				
				let j = 0 //计算成功保存的张数
				let size = imagesBase64Array.length
				//获取二维码
				let qrCodeObject = await laoyiApi.personal.imageText.getImageTextQrCode({id: row.id})
				const fsm = uni.getFileSystemManager()
				
				for(var i = 0 ; i < size ; i ++) {
					//图片
					let path = await base64src(imagesBase64Array[i], createUniqueString())
					if (i === 0) {
						//获取图片大小
						let imageInfo = await canvasUtil.image.getImageInfo(path);
						let imageWidth = imageInfo.width
						let imageHeight = imageInfo.height
						let scale = imageHeight/imageWidth
						//console.log(“宽长比” +scale)
						
						//获取设备宽高，设置canvas画布的高度
						let systemInfo = await canvasUtil.device.getSystemInfo()
						let canvasHeight = systemInfo.width * scale + 120 //120是给二维码留的
						this.canvasHeight = canvasHeight + "px"
						
						let canvasId = await toolUtils.canvas.imageToPlaypill(this.canvasId, path, qrCodeObject.data.wxQrFile, qrCodeObject.data.wxMpQrFile)
						//避免缓存无限膨胀，删除图片
						fsm.removeSavedFile({
							filePath: path
						})
						
						path = await canvasUtil.canvas.getCanvasPath(canvasId)
					}
					
					var isCompleted = await _this.saveImage(path)
					if(isCompleted) {
						j ++ 
						//避免缓存无限膨胀，删除图片
						fsm.removeSavedFile({
							filePath: path
						})
					}
				}
				
				if(j === size) {
					uni.showToast({
						title: '保存成功'
					})
				}else {
					uni.showToast({
						icon: 'none',
						title: '成功保存' + j + '张图片，'+(size - j)+'张保存失败！'
					})
				}
				this.isSaveLoading = false
			},
			async saveImage(path) {
				return new Promise((resolve, reject) => {
					uni.saveImageToPhotosAlbum({
						filePath: path,
						success: (res) => {
							resolve(true)
						},
						fail: e => {
							resolve(false)
						}
					})
				})
			}
			
		}
	};
	
</script>

<style lang="scss" scoped>
	@import '../../../common/uni-nvue.css';
	
	.circles-friend-body {
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}
	
	.media-title2 {
		padding-left: 10upx;
	}
	
	.userinfo-avatar-wapper{
		display: flex;
		align-items: center;
		height: 128upx;
		margin-bottom: 20upx;
		.userinfo-avatar {
			border-radius: 128upx;
			width: 128upx;
			height: 128upx;
			border: 4upx solid #F0F0F0 ;
		}
	}
	.uni-textarea {
		padding: 10upx;
	}
	
</style>
