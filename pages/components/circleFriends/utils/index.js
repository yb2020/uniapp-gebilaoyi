
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
		imageToPlaypill(canvasId, imagePath, wxFile, wxmpFile) {
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
				ctx.fillRect(0, 0, width, canvasHeight + 120)
				
				// 图片
				ctx.save() // 先保存状态 已便于画完圆再用
				ctx.beginPath() //开始绘制
				
				ctx.drawImage(imagePath, 0, 0 , width, canvasHeight)
				
				ctx.restore()
				
				//头像
				// var avatarSize = 70;    //绘制的头像宽度
				// await canvasUtil.round.drawCircularImage(ctx, 40, height - 100 , avatarSize , avatarSize, "#f00", store.state.avatarUrl)
				
				//昵称
				// ctx.setFillStyle('#333333'); // 文字颜色：黑色
				// ctx.setFontSize(14); // 文字字号：22px
				// ctx.fillText('我是' +store.state.nickName, 40 + 50 + 30, height - 100)
				
				//获取推广二维码地址
				//二维码和小程序码
				const wxImgSize = 90
				ctx.save() // 先保存状态 已便于画完圆再用
				ctx.beginPath() //开始绘制
				
				var localImage = await base64src(wxFile, "tmp_wxImg_base64src")
				var x = (width - wxImgSize * 2) / 2
				var y = canvasHeight + 15
				var leftX = x - 5
				ctx.drawImage(localImage, leftX, y, wxImgSize, wxImgSize)
				//左边
				ctx.setFillStyle('#FFFFFF'); // 文字颜色：黑色
				ctx.setFontSize(12); // 文字字号：22px
				//ctx.setStrokeStyle("#FFFFFF")
				//ctx.setLineWidth(2)
				//ctx.strokeText('@' + store.state.nickName, 5, y - 20)
				ctx.fillText('@' + store.state.nickName, 5, y - 20)
				ctx.setFillStyle('#333333'); // 文字颜色：黑色
				ctx.fillText('长按我', leftX - wxImgSize + 45, y + 20)
				ctx.fillText('免费一键转发', leftX - wxImgSize + 10, y + 40)
				ctx.fillText('本条图文', leftX - wxImgSize + 35, y + 60)
				

				var localMpImage = await base64src(wxmpFile, "tmp_wxmpImg_base64src")
				var rightX = x + wxImgSize + 5
				ctx.drawImage(localMpImage, rightX, y, wxImgSize, wxImgSize)
				//右边
				ctx.setFillStyle('#333333'); // 文字颜色：黑色
				ctx.setFontSize(12); // 文字字号：22px
				ctx.fillText('长按我', rightX + wxImgSize + 5, y + 20)
				ctx.fillText('关注这个', rightX + wxImgSize + 5, y + 40)
				ctx.fillText('有趣的有技术的', rightX + wxImgSize + 5, y + 60)
				ctx.fillText('微信公众号', rightX + wxImgSize + 5, y + 80)

				
				ctx.restore()
				
				
				ctx.stroke()
				ctx.draw()
				
				const fsm = uni.getFileSystemManager()
				fsm.removeSavedFile({
					filePath: localImage
				})
				fsm.removeSavedFile({
					filePath: localMpImage
				})

				resolve(canvasId)
			})
		},
		drawHubeiPlaypill(canvasId,report, playfillBackgroundFile, wxmpFile){
			return new Promise(async (resolve, reject) => {
				let _this = this;
				//获取屏幕宽高设置画布宽高
				var device = await canvasUtil.device.getSystemInfo()
				let width = device.width
				let height = device.height
				
				let paddingWidth = 40 ;
				let topheight = 180;//图片距离上边距离
				const ctx = uni.createCanvasContext(canvasId);
				
				// 底色
				// ctx.fillStyle = '#F0F0F0';  //填充颜色
				// ctx.fillRect(0, 0, width, height); 
				ctx.save() // 先保存状态 已便于画完圆再用
				ctx.beginPath() //开始绘制
				
				var localImage = await base64src(playfillBackgroundFile.file)
				ctx.drawImage(localImage, 0, 0 , width, height)
				
				ctx.restore()
				
				//标题开始：
				var title = `所有同在${report.currentRegion[0]}的同胞们`
				ctx.setFontSize(24)
				ctx.setFillStyle('#d7b25e') 
				ctx.fillText("祝" , 20, 40)
				ctx.setFontSize(20)
				canvasUtil.text.drawTextVertical(ctx, title , 50, 70)
				
				
				
				//背景
				canvasUtil.round.roundRect(ctx, 20, height - 100 - 30, width - 40, 100, 5, 'rgba(255,255,255,0.8)')
				//头像
				var avatarSize = 70;    //绘制的头像宽度
				await canvasUtil.round.drawCircularImage(ctx, 40, height - 100 - 15 , avatarSize , avatarSize, "#f00", store.state.avatarUrl)
				//昵称
				ctx.setFillStyle('#333333'); // 文字颜色：黑色
				ctx.setFontSize(14); // 文字字号：22px
				ctx.fillText('我是' +store.state.nickName, 40 + 50 + 30, height - 100)
				if(report.quarantine) {
					ctx.fillText(`我已与${report.count}位网友` , 40 + 50 + 30, height - 100 + 20)
					ctx.fillText('一起居家隔离，' , 40 + 50 + 30 , height - 100 + 40)
					ctx.setFillStyle('#F43F3B')
					ctx.font = 'italic'
					
					ctx.setFontSize(16) // 文字字号：22px
					ctx.fillText('共抗疫情！' , 40 + 50 + 30 , height - 100 + 60)
				}else {
					ctx.fillText(`我是反面教材` , 40 + 50 + 30, height - 100 + 20)
					ctx.fillText('请不要学我！' , 40 + 50 + 30 , height - 100 + 40)
				}
				ctx.restore()
				
				
				//二维码
				// 小程序码
				const wxImgSize = 90
				ctx.save() // 先保存状态 已便于画完圆再用
				ctx.beginPath() //开始绘制
				
				var localImage = await base64src(wxmpFile, "tmp_base64srcHubei")
				ctx.drawImage(localImage,width - wxImgSize - 30, height - wxImgSize - 35 , wxImgSize, wxImgSize)
				
				ctx.restore()
				
				
				ctx.setFillStyle('#d7b25e')
				ctx.setFontSize(14)
				var province = report.currentRegion[0].substring(0, 2)
				canvasUtil.text.drawTextVertical(ctx, `${province}加油！`, width - 80, 280)
				
				ctx.setFontSize(14)
				var city = report.currentRegion[1].substring(0, 2)
				canvasUtil.text.drawTextVertical(ctx,`${city}加油！`, width - 50, 320)
				
				ctx.stroke()
				ctx.draw()
				
				resolve(canvasId)
			})
			
		},
		drawOtherPlaypill(canvasId,report, playfillBackgroundFile, wxmpFile){
			return new Promise(async (resolve, reject) => {
				let _this = this;
				//获取屏幕宽高设置画布宽高
				var device = await canvasUtil.device.getSystemInfo()
				let width = device.width
				let height = device.height
			
				let paddingWidth = 40 ;
				let topheight = 180;//图片距离上边距离
				const ctx = uni.createCanvasContext(canvasId);
				
				// 底色
				// ctx.fillStyle = '#F0F0F0';  //填充颜色
				// ctx.fillRect(0, 0, width, height); 
				ctx.save() // 先保存状态 已便于画完圆再用
				ctx.beginPath() //开始绘制
				
				var localImage = await base64src(playfillBackgroundFile.file)
				ctx.drawImage(localImage,0, 0 , width, height)
				
				ctx.restore()
				
				//标题开始：
				var title = `${report.name}在${report.currentRegion[0]}`
				ctx.setFontSize(30)
				ctx.setFillStyle('#FFFFFF') 
				ctx.fillText(title , (width - ctx.measureText(title).width) / 2, 300)
				ctx.setFontSize(24)
				var subTitle = `祝疫区同胞们早日战胜疫情！`
				ctx.fillText(subTitle , (width - ctx.measureText(subTitle).width) / 2, 350)
				
				
				//背景
				canvasUtil.round.roundRect(ctx, 20, height - 100 - 30, width - 40, 100, 5, 'rgba(255,255,255,0.8)')
				//头像
				var avatarSize = 70;    //绘制的头像宽度
				await canvasUtil.round.drawCircularImage(ctx, 40, height - 100 - 15 , avatarSize , avatarSize, "#f00", store.state.avatarUrl)
				
				//昵称
				ctx.setFillStyle('#333333'); // 文字颜色：黑色
				ctx.setFontSize(14); // 文字字号：22px
				ctx.fillText('我是' +store.state.nickName, 40 + 50 + 30, height - 100)
				if(report.quarantine) {
					ctx.fillText(`我已与${report.count}位网友` , 40 + 50 + 30, height - 100 + 20)
					ctx.fillText('一起居家隔离，' , 40 + 50 + 30 , height - 100 + 40)
					ctx.setFillStyle('#F43F3B')
					ctx.font = 'italic'
					
					ctx.setFontSize(16) // 文字字号：22px
					ctx.fillText('共抗疫情！' , 40 + 50 + 30 , height - 100 + 60)
				}else {
					ctx.fillText(`我是反面教材` , 40 + 50 + 30, height - 100 + 20)
					ctx.fillText('请不要学我！' , 40 + 50 + 30 , height - 100 + 40)
				}
				
				
				
				//二维码
				// 小程序码
				const wxImgSize = 90
				ctx.save() // 先保存状态 已便于画完圆再用
				ctx.beginPath() //开始绘制
				
				var localImage = await base64src(wxmpFile, "tmp_base64srcOther")
				ctx.drawImage(localImage,width - wxImgSize - 30, height - wxImgSize - 35 , wxImgSize, wxImgSize)
				
				ctx.restore()
				
				ctx.setFillStyle('#d7b25e')
				ctx.setFontSize(14)
				var dateText = parseTime(report.createDate, '{y}年{m}月{d}号')
				ctx.fillText(dateText , (width - ctx.measureText(dateText).width) / 2, 400)
				
				ctx.stroke()
				ctx.draw()
				
				resolve(canvasId)
			})
		},
		drawPlaypill(canvasId,report, playfillBackgroundFile, wxmpFile) {
			console.log(canvasId)
			console.log(report)
			console.log(playfillBackgroundFile)
			console.log(wxmpFile)
		}
	}
}
				
			 
			  
				