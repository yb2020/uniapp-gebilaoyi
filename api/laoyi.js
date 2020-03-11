
import serviceAPI from '@/common/serviceAPI'

const serviceId = '/MICROSERVICE-APP-BLOG'

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
	imageText: {
		getList(params) {
			return serviceAPI.request({
				url: serviceId + '/personal/imageText/list',
				business: null,
				method: 'POST',
				data: params
			})
		}
	},
	person: {
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