
import store from '@/store'
import base64src from '@/common/base64src'
import canvasUtil from '@/common/canvasUtil'
import { formatTime, parseTime } from '@/utils'
import {createUniqueString} from '@/utils'

export default {
	canvas:{
		/* *
		 * canvasId: 画布Id
		 * image: 图片Id
		 * wxFile: 小程序二维码
		 * wxmpFile： 公众号二维码
		 * **/
		imageToPlaypill(canvasId, imagePath, wxFile, goods) {
			return new Promise(async (resolve, reject) => {
				let _this = this;
				//获取图片大小
				let imageInfo = await canvasUtil.image.getImageInfo(imagePath)
				let imageWidth = imageInfo.width
				let imageHeight = imageInfo.height
				
				//获取设备宽高
				let systemInfo = await canvasUtil.device.getSystemInfo()
				let width = systemInfo.width
				let height = systemInfo.height
				
				let scale = imageHeight/imageWidth
				
				//获取画布高度
				let canvasHeight = systemInfo.width * scale
				
				let paddingWidth = 40 ;
				
				let topheight = 180;//图片距离上边距离
				const ctx = uni.createCanvasContext(canvasId);
				
				// 底色
				ctx.setFillStyle("#FFFFFF")
				ctx.fillRect(0, 0, width, canvasHeight + 160)
				
				// 图片
				ctx.save() // 先保存状态 已便于画完圆再用
				ctx.beginPath() //开始绘制
				
				ctx.drawImage(imagePath, 0, 0 , width, canvasHeight)
				
				ctx.restore()
				
				
				//获取推广二维码地址
				//二维码和小程序码
				const wxImgSize = 60
				ctx.save() // 先保存状态 已便于画完圆再用
				ctx.beginPath() //开始绘制
				
				var y = canvasHeight + 15
				var leftX = 10
				
				//左边的@昵称
				ctx.setFillStyle('#FFFFFF'); // 文字颜色：黑色
				ctx.setFontSize(12); // 文字字号：22px
				ctx.fillText('@' + store.state.nickName, 5, y - 20)
				
				
				//画标题
				ctx.setFillStyle('#333333'); // 文字颜色：黑色
				ctx.setFontSize(14); // 文字字号：22px
				canvasUtil.text.drawText(ctx, "          " + goods.skuName, 10, y + 10, 32, width - 10)
				//画京东label
				ctx.save() // 先保存状态 已便于画完圆再用
				ctx.beginPath() //开始绘制
				
				ctx.setFillStyle('#FF5000')
				canvasUtil.round.roundRect(ctx, 10, y - 5, 40, 20, 5, '#FF5000')
				
				ctx.setFillStyle('#FFFFFF'); // 文字颜色：黑色
				ctx.setFontSize(14); // 文字字号：22px
				canvasUtil.text.drawText(ctx, "京东", 15, y + 10, 32, width - 10)
				
				ctx.restore()
				//画头像
				var avatarSize = 40;    //绘制的头像宽度
				await canvasUtil.round.drawCircularImage(ctx, 10, y + 95 , avatarSize , avatarSize, "#999999", store.state.avatarUrl)
				
				//昵称
				ctx.setFillStyle('#333333'); // 文字颜色：黑色
				ctx.setFontSize(14); // 文字字号：22px
				ctx.fillText(`好友${store.state.nickName}`, 10 + avatarSize + 10, y +  110)
				
				ctx.setFillStyle('#AAAAAA'); // 文字颜色：黑色
				ctx.setFontSize(10); // 文字字号：22px
				ctx.fillText('推荐您享受京东购物内购优惠', 10 + avatarSize + 10, y + 130)
				
				//画券后价
				ctx.setFillStyle('#FF0000'); // 文字颜色：黑色
				ctx.setFontSize(14); // 文字字号：22px
				canvasUtil.text.drawText(ctx, "券后价：￥" , leftX, y + 54, 32, width - 10)
				ctx.setFontSize(20); // 文字字号：22px
				canvasUtil.text.drawText(ctx, `${goods.priceInfo.lowestCouponPrice}` , leftX + 70 , y + 54, 32, width - 10)
				
				//画评论数据
				ctx.setFillStyle('#999999'); // 文字颜色：黑色
				ctx.setFontSize(12); // 文字字号：22px
				canvasUtil.text.drawText(ctx, `${goods.comments}条评论` , width - wxImgSize - 100 - leftX, y + 52, 32, width - 10)
				
				//画好评率
				ctx.setFillStyle('#999999'); // 文字颜色：黑色
				ctx.setFontSize(12); // 文字字号：22px
				canvasUtil.text.drawText(ctx, `好评率${goods.goodCommentsShare}%`, width - wxImgSize - 10 - leftX, y + 52, 32, width - 10)
				
				//画京东价，优惠券
				ctx.setFillStyle('#999999'); // 文字颜色：黑色
				ctx.setFontSize(14); // 文字字号：22px
				canvasUtil.text.drawText(ctx, `京东价：￥${goods.priceInfo.price}` , leftX, y + 75, 32, width - 10)
				
				ctx.setFillStyle('#FF5000'); // 文字颜色：黑
				ctx.setFontSize(14); // 文字字号：22px
				canvasUtil.text.drawText(ctx, `优惠券：￥${goods.couponInfo.couponList[0].discount}`  , leftX + 120, y + 75, 32, width - 10)
				
				
				//画小程序码
				var localImage = await base64src(wxFile, "tmp_wxImg_base64src")
				ctx.drawImage(localImage, width - wxImgSize - leftX , y + 60, wxImgSize, wxImgSize)
				ctx.setFillStyle('#999999'); // 文字颜色：黑色
				ctx.setFontSize(10); // 文字字号：22px
				ctx.fillText('长按识别', width - wxImgSize + 8 , y + 60 + wxImgSize + 10)
				
				ctx.restore()
				
				
				ctx.draw()
				
				const fsm = uni.getFileSystemManager()
				fsm.removeSavedFile({
					filePath: localImage
				})

				resolve(canvasId)
			})
		},
		downLoadOriginImage(url) {
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
		}
	}
}
				
			 
			  
				