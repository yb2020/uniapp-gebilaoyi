import userApi from "./user"
import store from '@/store'

export default {
	wx:{
		login() {
			let _this = this;
			uni.showLoading({
				title: '登录中...'
			});
		 
		   // 1.wx获取登录用户code
			uni.login({
				provider: 'weixin',
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
										//console.log(store.state.token)
										uni.navigateTo({
											url: '/pages/laoyi/index'
										})
										//console.log(result)
									})
									
								},
								fail(res) {
									uni.hideLoading()
									uni.reLaunch({
										url: '/pages/laoyi/Authorization'
									})
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
				
			 
			  
				