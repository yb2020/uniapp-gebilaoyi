
import serviceAPI from '@/common/serviceAPI'

const serviceId = '/microService-app-blog'

export default {
	location: {
		list() {
			return serviceAPI.request({
				url: serviceId + '/location/list',
				method: 'get',
				data: null
			})
		}
	},
	union: {
		jd: {
			jingfen: {
				getListByCategory(params) {
					return serviceAPI.request({
						url: serviceId + '/union/jd/jingfen/getListByCategory',
						business: null,
						method: 'POST',
						data: params
					})
				},
				getNav() {
					return serviceAPI.request({
						url: serviceId + '/union/jd/jingfen/getNav',
						business: null,
						method: 'POST'
					})
				},
				getOtherNav() {
					return serviceAPI.request({
						url: serviceId + '/union/jd/jingfen/getOtherNav',
						business: null,
						method: 'POST'
					})
				}
			},
			goods: {
				getGoodsQrCode(params) {
					return serviceAPI.request({
						url: serviceId + '/union/jd/goods/getGoodsQrCode',
						business: null,
						method: 'POST',
						data: params
					})
				},
				getUnionHref(params) {
					return serviceAPI.request({
						url: serviceId + '/union/jd/goods/getUnionHref',
						business: null,
						method: 'POST',
						data: params
					})
				}
			}
		}
	},
	personal: {
		imageText: {
			getById(params) {
				return serviceAPI.request({
					url: serviceId + '/personal/imageText/getById',
					business: null,
					method: 'POST',
					data: params
				})
			},
			downLoadOriginImage(params) {
				return serviceAPI.request({
					url: serviceId + '/personal/imageText/downLoadOriginImage',
					business: null,
					method: 'POST',
					data: params
				})
			},
			getDetailById(params) {
				return serviceAPI.request({
					url: serviceId + '/personal/imageText/getDetailById',
					business: null,
					method: 'POST',
					data: params
				})
			},
			getList(params) {
				return serviceAPI.request({
					url: serviceId + '/personal/imageText/list',
					business: null,
					method: 'POST',
					data: params
				})
			},
			getImageTextQrCode(params) {
				return serviceAPI.request({
					url: serviceId + '/personal/imageText/getImageTextQrCode',
					business: null,
					method: 'POST',
					data: params
				})
			},
			save(data) {
				return serviceAPI.request({
					url: serviceId + '/personal/imageText/save',
					business: null,
					method: 'POST',
					data: data
				})
			},
			relay(params) {
				return serviceAPI.request({
					url: serviceId + '/personal/imageText/relay',
					business: null,
					method: 'POST',
					data: params
				})
			}
		},
		pillPlay: {
			report(params) {//生成报告
				return serviceAPI.request({
					url: serviceId + '/personal/2019-nCoV/report',
					business: null,
					method: 'POST',
					data: params
				})
			},
			getMyReportList(params) {
				return serviceAPI.request({
					url: serviceId + '/personal/2019-nCoV/getMyReportList',
					method: 'POST',
					data: params
				})
			},
			getReportById(params) {
				return serviceAPI.request({
					url: serviceId + '/personal/2019-nCoV/getById',
					method: 'POST',
					data: params
				})
			},
			getPlaypillTemplateList(params) {
				return serviceAPI.request({
					url: serviceId + '/personal/2019-nCoV/getPlaypillTemplateList',
					method: 'POST',
					data: params
				})
			}
		}
	}
	
}