import serviceAPI from './request'
import store from '@/store'
import Authorization from "@/common/Authorization"

var baseUrl = 'https://api.wuhuhai.com'
// var baseUrl = 'http://192.168.1.100:9999'
// #ifdef H5
baseUrl = ''
// #endif
serviceAPI.setConfig({
    baseUrl: baseUrl,
    debug: false
})
// 请求拦截
serviceAPI.interceptor.request = (config => {
    // 给header添加全局请求参数token
	config.header.Authorization = config.header.Authorization || store.state.token
	if(!config.data) {
		config.data = {}
	}
	config.data.orgId = config.data.orgId || store.state.orgId
	config.data.appId = config.data.appId || store.state.appName
	
    // 添加一个自定义的参数，默认异常请求都弹出一个toast提示
    if (config.toastError === undefined) {
        config.toastError = false
    }
    return config;
})
// 全局的业务拦截
serviceAPI.interceptor.response = ((res, config) => {
	if(res.code === 50008) {
		//token失效，需要重新登录
		store.state.isLogin = false
		store.state.token = ''
		Authorization.wx.login()
		res.success = true
		return res
	}else if(res.code === 50012 || res.code === 50014) {
		return Promise.reject(res.message || 'error')
	}
	else if(res.status != 1){
		return Promise.reject(res.message || 'error')
	}else {
		res.success = true
	}
    return res;
})

// 全局的错误异常处理
serviceAPI.interceptor.fail = ((res, config) => {
	let msg = res.data.msg
	let ret = res.data
	ret = typeof(ret) === 'string' ? JSON.parse(ret) : ret ;
	
	if(ret.message) {
		uni.showToast({
		    title: ret.message ,
		    duration: 2000,
		    icon: 'none'
		})
	}
	
	
    return ret
})

export default serviceAPI