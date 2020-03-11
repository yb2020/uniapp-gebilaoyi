import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		loginProvider: "",
		openid: null,
		testvuex:false,
        colorIndex: 0,
        colorList: ['#FF5000','#00FF00','#0000FF']
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
			state.avatarUrl = ''
			state.nickName = ''
			state.username = ''
			state.orgId = ''
			state.appName = ''
		},
		setOpenid(state, openid) {
			state.openid = openid
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
				if (state.openid) {
					resolve(state.openid)
				} else {
					uni.login({
						success: (data) => {
							commit('login')
							setTimeout(function () { //模拟异步请求服务器获取 openid
								const openid = '123456789'
								console.log('uni.request mock openid[' + openid + ']');
								commit('setOpenid', openid)
								resolve(openid)
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
