<script>
	import store from '@/store'
	import ACLApi from '@/common/ACL'
	import Authorization from "@/common/Authorization"
	
    export default {
        onLaunch: async options => {
            console.log('App Launch');
            // #ifdef APP-PLUS
            // 检测升级
            uni.request({
                url: 'https://uniapp.dcloud.io/update', //检查更新的服务器地址
                data: {
                    appid: plus.runtime.appid,
                    version: plus.runtime.version,
                    imei: plus.device.imei
                },
                success: (res) => {
                    if (res.statusCode == 200 && res.data.isUpdate) {
                        let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
                        // 提醒用户更新
                        uni.showModal({
                            title: '更新提示',
                            content: res.data.note ? res.data.note : '是否选择更新',
                            success: (showResult) => {
                                if (showResult.confirm) {
                                    plus.runtime.openURL(openUrl);
                                }
                            }
                        })
                    }
                }
            })
            // #endif
			
			var _this = this
			let systemParams = uni.getStorageSync("systemParams")
			let scene = options.query.scene
			
			//记录当前登录
			Authorization.getProvider()
			
			if(scene) { //只要有scene,优先重新获取
				let paramters = await ACLApi.qr.app.getByIdName(scene)
				if(!paramters) {
					paramters = await ACLApi.qr.app.getById(scene)
				}
				paramters = paramters.paramters
				console.log(paramters)
				
				store.commit("init",{
					orgId: ACLApi.qr.app.utils.get(paramters, "orgId") || "8041b3e636d54b8db78f49572ba414bf",
					appName: ACLApi.qr.app.utils.get(paramters, "appId") || "yiblog",
					agent: ACLApi.qr.app.utils.get(paramters, "agent") || ""
				})
			}else if(systemParams) {
				store.commit("setInit", systemParams)
			}else { //两个都为空，搜索进的小程序？
				store.commit("init",{
					orgId: "8041b3e636d54b8db78f49572ba414bf",
					appName: "yiblog",
					agent: ""
				})
			}
			
        },
        onShow: function() {
            console.log('App Show')
        },
        onHide: function() {
            console.log('App Hide')
        },
		globalData: {
			test: ''
		}
	}

</script>

<style>
/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';

/* 以下样式用于 hello uni-app 演示所需 */
page {
	background-color: #f4f5f6;
	height: 100%;
	font-size: 28upx;
	line-height: 1.8;
}

.uni-header-logo {
	padding: 30upx;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 10upx;
}

.uni-header-image {
	width: 100px;
	height: 100px;
}

.uni-hello-text {
	color: #7a7e83;
}

.uni-hello-addfile {
	text-align: center;
	line-height: 300upx;
	background: #fff;
	padding: 50upx;
	margin-top: 10px;
	font-size: 38upx;
	color: #808080;
}

/* #endif*/
</style>
