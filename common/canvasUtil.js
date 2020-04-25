export default {
	device: {
		getSystemInfo() {
			return new Promise((resolve, reject) => {
				uni.getSystemInfo({
					success: e => {
						//返回屏幕大小
						resolve({width: e.windowWidth, height: e.windowHeight})
					},
					fail: e => {
						reject(new Error(e))
					}
				})
			})
		}
	},
	canvas: {
		getCanvasPath(canvasId) {
			return new Promise(async (resolve, reject) => {
				
				setTimeout(() => {
					uni.canvasToTempFilePath({
						canvasId: canvasId,
						success: (res) => {
							//返回canvas图片文件路径
							resolve(res.tempFilePath)
						},
						fail: e => {
							reject(new Error(e.mesage))
						}
					})
				}, 200)
			})
		}
	},
	round: {
		/**
		 * 绘制圆角矩形
		 * @param {Object} ctx - canvas组件的绘图上下文
		 * @param {Number} x - 矩形的x坐标
		 * @param {Number} y - 矩形的y坐标
		 * @param {Number} w - 矩形的宽度
		 * @param {Number} h - 矩形的高度
		 * @param {Number} r - 矩形的圆角半径
		 * @param {String} [c = 'transparent'] - 矩形的填充色
		 */
		roundRect(ctx, x, y, w, h, r, c = '#f00') {
		    if (w < 2 * r) { r = w / 2; }
		    if (h < 2 * r) { r = h / 2; }
		 
		    ctx.beginPath();
			ctx.setFillStyle('transparent')
		    ctx.fillStyle = c;
		 
		    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
		    ctx.moveTo(x + r, y);
		    ctx.lineTo(x + w - r, y);
		    ctx.lineTo(x + w, y + r);
		 
		    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
		    ctx.lineTo(x + w, y + h - r);
		    ctx.lineTo(x + w - r, y + h);
		 
		    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
		    ctx.lineTo(x + r, y + h);
		    ctx.lineTo(x, y + h - r);
		 
		    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
		    ctx.lineTo(x, y + r);
		    ctx.lineTo(x + r, y);
		 
		    ctx.fill()
		    ctx.closePath()
		},
		/**
		 * 绘制圆角矩形
		 * @param {Object} ctx - canvas组件的绘图上下文
		 * @param {Number} x - 矩形的x坐标
		 * @param {Number} y - 矩形的y坐标
		 * @param {Number} w - 矩形的宽度
		 * @param {Number} h - 矩形的高度
		 * @param {Number} r - 矩形的圆角半径
		 * @param {String} [c = 'transparent'] - 矩形的填充色
		 * @param {base64} [c = 'transparent'] - 矩形的填充图片
		 */
		roundRectImage(ctx, x, y, w, h, r, c = '#fff', img) {
		    if (w < 2 * r) { r = w / 2; }
		    if (h < 2 * r) { r = h / 2; }
		 
		    ctx.beginPath();
		    ctx.fillStyle = c;
		 
		    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
		    ctx.moveTo(x + r, y);
		    ctx.lineTo(x + w - r, y);
		    ctx.lineTo(x + w, y + r);
		 
		    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);
		    ctx.lineTo(x + w, y + h - r);
		    ctx.lineTo(x + w - r, y + h);
		 
		    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);
		    ctx.lineTo(x + r, y + h);
		    ctx.lineTo(x, y + h - r);
		 
		    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);
		    ctx.lineTo(x, y + r);
		    ctx.lineTo(x + r, y);
		 
		    ctx.fill();
		    ctx.closePath();
		},
		async drawCircularImage(ctx, x, y, w, h, bc, img) {
			ctx.save(); // 先保存状态 已便于画完圆再用
			ctx.beginPath(); //开始绘制
			//先画个圆
			ctx.arc(x +(w / 2), y + (h / 2), w / 2, 0, Math.PI * 2);
			ctx.setFillStyle(bc)
			ctx.fill()//保证图片无bug填充
			ctx.clip();//画了圆 再剪切 原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
			//ctx.drawImage(img, x, y, w, h) // 推进去图片
			var localImage = await exports.default.image.getImageInfo(img)
			ctx.drawImage(localImage.path, x, y, w, h) // 推进去图片
			ctx.restore()
		},
	},
	image: {
		getImageInfo(url) {
		  return new Promise((resolve, reject) => {
			const objExp = new RegExp(/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
			uni.getImageInfo({
			  src: url,
			  success(res) {
				if (res.errMsg === 'getImageInfo:ok') {
					resolve(res)
				} else {
					reject(new Error('getImageInfo fail'))
				}
			  }
			})
		  })
		},
		async saveImage(path) {
			return new Promise((resolve, reject) => {
				uni.saveImageToPhotosAlbum({
					filePath: path,
					success: res => {
						resolve(true);
					},
					fail: e => {
						resolve(false);
					}
				});
			});
		}
	},
	text: {
		/**
		 * 文本换行 参数：1、canvas对象
		 * 				2、文本 
		 * 				3、距离左侧的距离 
		 * 				4、距离顶部的距离 
		 * 				5、文本高度
		 * 				6、文本的宽度
		 * @param {Object} ctx - canvas组件的绘图上下文
		 * @param {String} str - 文字
		 * @param {Number} leftWidth - 距离x坐标的距离
		 * @param {Number} initHeight - 距离y坐标的距离
		 * @param {Number} titleHeight - 文字高度
		 * @param {Number} canvasWidth - 文字宽度
		 */
		drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
			var lineWidth = 0;
			var lastSubStrIndex = 0; //每次开始截取的字符串的索引
			for (let i = 0; i < str.length; i++) {
				lineWidth += ctx.measureText(str[i]).width
				if (lineWidth > canvasWidth) {
					ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
					initHeight += 20; //16为字体的高度
					lineWidth = 0;
					lastSubStrIndex = i;
					titleHeight += 30;
				}
				if (i == str.length - 1) { //绘制剩余部分
					ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
				}
			}
			// 标题border-bottom 线距顶部距离
			titleHeight = titleHeight + 10;
			return titleHeight
		},
		drawTextVertical(context, text, x, y) {
		  var arrText = text.split('');
		  var arrWidth = arrText.map(function (letter) {
		    return 26;
		    // 这里为了找到那个空格的 bug 做了许多努力，不过似乎是白费力了
		    // const metrics = context.measureText(letter);
		    // console.log(metrics);
		    // const width = metrics.width;
		    // return width;
		  });
		  
		  var align = context.textAlign;
		  var baseline = context.textBaseline;
		 
		  if (align == 'left') {
		    x = x + Math.max.apply(null, arrWidth) / 2;
		  } else if (align == 'right') {
		    x = x - Math.max.apply(null, arrWidth) / 2;
		  }
		  if (baseline == 'bottom' || baseline == 'alphabetic' || baseline == 'ideographic') {
		    y = y - arrWidth[0] / 2;
		  } else if (baseline == 'top' || baseline == 'hanging') {
		    y = y + arrWidth[0] / 2;
		  }
		 
		 
		  // 开始逐字绘制
		  arrText.forEach(function (letter, index) {
		    // 确定下一个字符的纵坐标位置
		    var letterWidth = arrWidth[index];
		    // 是否需要旋转判断
		    var code = letter.charCodeAt(0);
		    if (code <= 256) {
		      context.translate(x, y);
		      // 英文字符，旋转90°
		      context.rotate(90 * Math.PI / 180);
		      context.translate(-x, -y);
		    } else if (index > 0 && text.charCodeAt(index - 1) < 256) {
		      // y修正
		      y = y + arrWidth[index - 1] / 2;
		    }
		    context.fillText(letter, x, y);
		    // 旋转坐标系还原成初始态
		    context.setTransform(1, 0, 0, 1, 0, 0);
		    // 确定下一个字符的纵坐标位置
		    var letterWidth = arrWidth[index];
		    y = y + letterWidth;
		  });
		  // 水平垂直对齐方式还原
		  context.textAlign = align;
		  context.textBaseline = baseline;
		}

	}
}
