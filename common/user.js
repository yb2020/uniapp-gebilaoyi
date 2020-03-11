import serviceAPI from '@/common/serviceAPI'

const serviceId = '/MICROSERVICE-USER'

export default {
	user: {
	    getById(id) {
	      return serviceAPI.request({
	        url: serviceId + '/user/getById/' + id,
	        method: 'get',
	        data: null
	      })
	    },
		getByToken(token) {
		  return serviceAPI.request({
			url: serviceId + '/user/getByToken',
			method: 'get',
			data: { token }
		  })
		}
	},
	authorization: {
		wxLogon(params) {
			return serviceAPI.request({
			  url: serviceId + '/user/authorization/wxLogon',
			  method: 'get',
			  data: params
			})
		},
		getWxUserInfo(params) {
			return serviceAPI.request({
			  url: serviceId + '/user/authorization/getWxUserInfo',
			  method: 'get',
			  data: params
			})
		}
	}
}