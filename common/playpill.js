import store from '@/store'
import base64src from '@/common/base64src'
import canvasUtil from '@/common/canvasUtil'
import { formatTime, parseTime } from '@/utils'

export default {
	canvas:{
		drawReport(canvasId, report, wxmpFile) {
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
				ctx.setFillStyle("#FFFFFF")
				ctx.fillRect(0, 0, width, height)
				
				//标题开始
				var title = "新型冠状病毒肺炎自我筛查表"
				ctx.setFontSize(24)
				ctx.font = "仿宋_GB2312"
				ctx.setFillStyle('#333333')  // 文字颜色：黑色
				ctx.fillText(title , (width - ctx.measureText(title).width) / 2, 40)
				
				ctx.setFontSize(14)
				ctx.fillText("自我筛查时间：" + parseTime(report.createDate, '{m}-{d} {h}:{i}') , width - 200 , 65)
				
				
				ctx.save();
				ctx.moveTo(20,75)     //设置起点状态
				ctx.lineTo(width - 20,75)       //设置末端状态
				ctx.lineWidth = 2         //设置线宽状态
				ctx.strokeStyle = '#222'   //设置线的颜色状态
				ctx.stroke()               //进行绘制
				//标题结束
				
				//内容
				//个人信息
				ctx.setFontSize(14)
				ctx.fillText("姓名：" + report.name , 20, 100)
				ctx.fillText("年龄：" + report.age + "岁" , 130, 100)
				ctx.fillText("性别：" + (report.sex ? '男' : '女') , 230, 100)
				
				ctx.fillText("来自：" + report.currentRegion[1] + report.currentRegion[2] , 20, 125)
				ctx.fillText("联系电话：" + report.mobile , 200, 125)
				
				//自我诊断标题开始
				ctx.setFontSize(16)
				ctx.fillText("自我诊断", 20 , 170)
				
				ctx.save();
				ctx.moveTo(20,180)     //设置起点状态
				ctx.lineTo(width - 20,180)       //设置末端状态
				ctx.lineWidth = 1         //设置线宽状态
				ctx.strokeStyle = '#222'   //设置线的颜色状态
				ctx.stroke()               //进行绘制
				ctx.restore()
				//自我诊断标题结束
				
				ctx.setFontSize(14)
				var targetText = report.targetRegion && report.targetRegion[0] ? `,长期工作的地方在${report.targetRegion[0]}` : ""
				
				var text = `我来自${report.currentRegion[0]}${targetText}，今年新冠肺炎肆虐。`
				
				if (report.quarantine) {
					text += `我积极响应国家号召，自疫情发生已来，居家隔离了${report.quarantineDay}天，我已经成了名符其实的“闲疯帝”。但是只要钟南山说不让我动，我就不会动，如果非要在这个时间上加一个期限，我希望是一万年！`
				} else {
					text += `在这里通知大家，我没有进行过自我隔离。我是一个异类，但为了大家的安全，你们看到我时，请远离我，因为我也不知道我带不带毒！`
				}
				
				canvasUtil.text.drawText(ctx, text, 20, 200, 5, width - 50)
				//ctx.fillText("来自：" + report.currentRegion[1] + report.currentRegion[2] , 20, 200)
				
				
				//背景
				canvasUtil.round.roundRect(ctx, 20, height - 100 - 30, width - 40, 100, 5, report.quarantine ? 'rgba(162,243,165,0.7)' : 'rgba(239,168,168,0.7)')
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
				
				var localImage = await base64src(wxmpFile, "tmp_base64src1")
				ctx.drawImage(localImage,width - wxImgSize - 30, height - wxImgSize - 35 , wxImgSize, wxImgSize)
				
				ctx.restore()
				
				
				ctx.stroke()
				ctx.draw()
				
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
				
			 
			  
				