import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		loginProvider: "",
		provider:{ 
			login: {
				id: 'weixin',
				name: '微信登录'
			},
		},
		testvuex:false,
        colorIndex: 0,
        colorList: ['#FF5000','#00FF00','#0000FF'],
		
		isLogin: false,
		token: '',  
		avatarUrl: '/static/user.png',
		nickName: '点击登录',
		username: '',
		mobile: '',
		orgId: '',
		openId: '',
		appName: '',
		isAgent: false,
		agent: '',
		expiresAt: 0,
		level: -1
	},
	mutations: {
		init(state, initParams) {
			state.orgId = initParams.orgId
			state.appName = initParams.appName
			state.agent = initParams.agent
			uni.setStorage({
				key: "systemParams",
				data: initParams
			})
		},
		setInit(state, initParams) {
			state.orgId = initParams.orgId
			state.appName = initParams.appName
			state.agent = initParams.agent
		},
		login(state, user) {
			state.token = user.token
			state.avatarUrl = user.avatarUrl
			state.username = user.username
			state.nickName = user.nickName
			state.agent = user.agent
			state.isAgent = user.isAgent
			state.isLogin = true
			state.level = user.level
			state.expiresAt = user.expiresAt
			
			//let storeUser = uni.getStorageSync("userInfo") 
			uni.setStorage({
				key: "userInfo",
				data: user
			})
			
		}, 
		refreshUserInfo(state, user) {
			state.token = user.token
			state.avatarUrl = user.avatarUrl
			state.username = user.username
			state.nickName = user.nickName
			state.agent = user.agent
			state.isAgent = user.isAgent
			state.isLogin = true
			state.level = user.level
			state.expiresAt = user.expiresAt
		},
		refreshToken(state, token) {
			state.token = token
			uni.getStorage({
				key: "userInfo",
				success:(res) => {
					res.token = token
					uni.setStorage({
						key: "userInfo",
						data: res
					})
				}
			})
		}, 
		logout(state) {
			state.isLogin = false
			state.token = '' 
			state.avatarUrl = '/static/user.png'
			state.nickName = '点击登录'
			state.username = ''
			state.expiresAt = 0
			//state.orgId = ''
			//state.appName = ''
			uni.removeStorage({
				key: "userInfo"
			})
		},
		setOpenId(state, openId) {
			state.openId = openId
		},
		setTestTrue(state){
			state.testvuex = true
		},
		setTestFalse(state){
			state.testvuex = false
		},
        setColorIndex(state,index){
            state.colorIndex = index
        }
	},
    getters:{
        currentColor(state){
            return state.colorList[state.colorIndex]
        }
    },
	actions: {
		// lazy loading openid
		getUserOpenId: async function ({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				if (state.openId) {
					resolve(state.openId)
				} else {
					uni.login({
						success: (data) => {
							commit('login')
							setTimeout(function () { //模拟异步请求服务器获取 openId
								const openId = '123456789'
								console.log('uni.request mock openid[' + openId + ']');
								commit('setOpenid', openId)
								resolve(openId)
							}, 1000)
						},
						fail: (err) => {
							console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
							reject(err)
						}
					})
				}
			})
		}
	}
})

export default store
