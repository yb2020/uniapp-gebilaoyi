import userApi from "./user"
import store from '@/store'

export default {
	getProvider() {
		uni.getProvider({
			service: 'oauth',
			success: (result) => {
				this.providerList = result.provider.map((value) => {
					let providerName = '';
					switch (value) {
						case 'weixin':
							providerName = '微信登录'
							break;
						case 'qq':
							providerName = 'QQ登录'
							break;
						case 'sinaweibo':
							providerName = '新浪微博登录'
							break;
						case 'xiaomi':
							providerName = '小米登录'
							break;
						case 'alipay':
							providerName = '支付宝登录'
							break;
						case 'baidu':
							providerName = '百度登录'
							break;
						case 'toutiao':
							providerName = '头条登录'
							break;
						case 'apple':
							providerName = '苹果登录'
							break;
					}
					store.state.provider.login.name = providerName
					store.state.provider.login.id = value
				});
		
			},
			fail: (error) => {
				console.log('获取登录通道失败', error);
			}
		});	
	},
	toLogin() {
		uni.getUserInfo({
			success: (res) => {
				console.log('userInfo success:', res);
				
			},
			fail: (err) => {
			    console.log('userInfo fail:', err);
			}
		})
		
	},
	checkLogin() {
		let user = uni.getStorageSync("userInfo")
		
		let nowTime = new Date().getTime()
		
		if(user && user.isLogin && nowTime < user.expiresAt) {
			user = JSON.parse(JSON.stringify(user))
			store.commit("refreshUserInfo", user)
		}else {
			uni.showModal({
				title: "登录提示",
				content: "应用需要登录才能使用，请先登录！",
				success(result) {
					if(!result.cancel)  {
						_this.login()
					}else {
						uni.showToast({
						    title: '没有登录，将无法使用小程序的功能！',
						    duration: 2000,
							icon: 'none'
						})
					}
				},
				fail() {
				}
			})
		}
	},
	wx:{
		login(loginDone) {
			let _this = this;
			uni.showLoading({
				title: '登录中...'
			});
			
		   // 1.wx获取登录用户code
			uni.login({
				provider: store.state.provider.login.id,
				// #ifdef MP-ALIPAY
				scopes: 'auth_user', //支付宝小程序需设置授权类型
				// #endif
				success: function(loginRes) {
					let code = loginRes.code;
					userApi.authorization.wxLogon({code: code, orgId: store.state.orgId, appName: store.state.appName}).then(result => {
						//先登录微信，拿到openId后，给用户提示登录成功
						let openId = result.openId
						let unionid = result.unionid
						
						if(!unionid && openId) {
							uni.hideLoading();
							uni.showLoading({
								title: '初始化用户信息...'
							});
							
							//微信需要登录成功后，才能根据信息拿到unionid
							uni.getUserInfo({
								withCredentials: true,
								success: function(infoRes) {
									let nickName = infoRes.userInfo.nickName; //昵称
									let avatarUrl = infoRes.userInfo.avatarUrl; //头像
									//JSON.stringify()
									//通过拿到的用户信息，后台去找用户相关的unionid,同时，如果unionid在平台中不存在，那么初化一个用户并绑定到这个用户的unionid
									userApi.authorization.getWxUserInfo({
										sessionKey: result.sessionKey ,
										rawData: infoRes.rawData,
										signature: infoRes.signature ,
										encryptedData: infoRes.encryptedData ,
										iv: infoRes.iv,
										orgId: store.state.orgId, 
										appName: store.state.appName,
										agent: store.state.agent
									}).then(result2 => {
										console.log(result2)
										store.commit("login", {
											nickName: nickName,
											avatarUrl: avatarUrl,
											token: result2.token,
											username: result2.username,
											isAgent: result2.isAgent,
											agent: result2.agent,
											level: result2.level,
											expiresAt: result2.expiresAt,
											isLogin: true
										})
										uni.hideLoading()
										//console.log(result)
										if(loginDone) {
											loginDone(true)
										}
									})
									
								},
								fail(res) {
									uni.hideLoading()
								}
							});
						}else {
							uni.showModal({
								title: "提示",
								content: "登录失败！",
								success: () => {
									//TODO: 退出小程序
								}
							})
							
							
						}
						
						
					}).catch(e => {
						console.log(e)
					})
		
				},
			});
		}
	}
}
				
			 
			  
				