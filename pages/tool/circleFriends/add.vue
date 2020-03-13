<template>
	<view class="uni-container">
		<form @submit="formSubmit" @reset="formReset">
			<view class="uni-textarea">
				<!--auto-height-->
				<textarea name="content" v-model="form.content" class="uni-common-p-all" placeholder="请输入您要传播的文字" styl="height:150upx;" maxlength="500"/>
			</view>
			
			<view class="uni-common-mt">
				<view class="uni-uploader">
					<view class="uni-uploader-head">
						<view class="uni-uploader-title uni-text-small">点击图片预览，长按图片删除</view>
						<view class="uni-uploader-info">{{imageList.length}}/9</view>
					</view>
					<view class="uni-uploader-body">
						<view class="uni-uploader__files">
							<block v-for="(image,index) in imageList" :key="index">
								<text v-if="deleteImgButtonShow" class="uni-badge-red" style="position: absolute; top: 0;right: 0;" @tap="deleteImage(index)">删除</text>
								<view class="uni-uploader__file">
									<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage" @longpress="prepareDeleteImage()"></image>
								</view>
							</block>
							<view class="uni-uploader__input-box">
								<view class="uni-uploader__input" @tap="chooseImage"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="uni-common-mt">
				<uni-list>
					<uni-list-item title="所在位置" @tap="chooseLocation" :show-extra-icon="true" :extra-icon="{color: '#4cd964',size: '22',type: 'location'}" />
				</uni-list>
			</view>
			
			<view class="uni-btn-v">
				<button form-type="submit" type="primary">保存图文</button>
				<button type="default" form-type="reset">重置</button>
			</view>
		</form>


	</view>
</template>

<script>
	var graceChecker = require("@/common/graceChecker.js");
	var util = require('@/common/util.js');
	
	var formatLocation = util.formatLocation;
	
	export default {
		components: {
		},
		data() {
			return {
				form: {
					content: '',
					imagesBase64Array: [],
					position: '',
					location: {}
				},
				imageList: [],
				deleteImgButtonShow: false,
				text: ''
			};
		},
		methods: {
			formSubmit(e) {
				var formData = e.detail.value;
				
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(formData))
				//定义表单规则
				var rule = [
				    {name:"content", checkType : "notnull", checkRule:"",  errorMsg:"文字内容不能为！"}
				];
				//进行表单检查
				var checkRes = graceChecker.check(formData, rule);
				if(checkRes){
				    uni.showToast({title:"验证通过!", icon:"none"});
				}else{
				    uni.showToast({ title: graceChecker.error, icon: "none" });
					return false
				}
			},
			formReset(e) {
				console.log('清空数据')
			},
			chooseLocation() {
				uni.chooseLocation({
					success: (res) => {
						this.hasLocation = true
						this.location = formatLocation(res.longitude, res.latitude)
						this.locationAddress = res.address
						console.log(res)
						console.log("位置：" + location)
						console.log(res.address)
					},
					fail(e) {
						console.log(e)
					}
				})
			},
			previewImage(e) {
				var current = e.target.dataset.src
				console.log(e.target)
				uni.previewImage({
					current: current,
					urls: this.imageList,
					// longPressActions: {
					// 	itemList: ['发送给朋友', '保存图片', '收藏'],
					// 	success: function(data) {
					// 		console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
					// 	},
					// 	fail: function(err) {
					// 		console.log(err.errMsg);
					// 	}
					// }
				})
			},
			deleteImage(index) {
				this.imageList.splice(index, 1)
			},
			prepareDeleteImage() {
				this.deleteImgButtonShow = true
			},
			getImageData(filepath) {
				console.log(filepath)
				return new Promise((resolve, reject) => {
					uni.getFileSystemManager().readFile({
						filePath: filepath, //选择图片返回的相对路径
						encoding: 'base64',
	                    success: ress => {
	                        let base64 = 'data:image/'+ filepath.substring(filepath.lastIndexOf(".")+1)+';base64,'  + ress.data
							resolve(base64)
						},
						fail: e => {
							resolve(false)
						}
					})
				})
			},
			async chooseImage() {
				var _this = this
				// #ifdef APP-PLUS
				// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
				if (this.sourceTypeIndex !== 2) {
					let status = await this.checkPermission();
					if (status !== 1) {
						return;
					}
				}
				// #endif
			
				if (this.imageList.length === 9) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera','album'], //从相册选择、摄像头
					count: this.imageList.length < 9 ? 9 - this.imageList.length : 0 ,
					success: res => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
						console.log(this.imageList)
						// for(var imagePath of this.imageList) {
						// 	var result = await _this.getImageData(imagePath)
						// 	if(result) {
						// 		this.form.imagesBase64Array.push(result)
						// 		console.log(this.form.imagesBase64Array)
						// 	}
						// }
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			isFullImg() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								this.form.imagesBase64Array = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
						'android.permission.READ_EXTERNAL_STORAGE');
		
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
		
				return status;
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
	
</style>
