import serviceAPI from '@/common/serviceAPI'

const serviceId = '/microService-acl'

export default {
	qr:{
		app: {
			getByIdName(idName) {
			  return serviceAPI.request({
				url: serviceId + '/qr/app/getByIdName/' + idName,
				method: 'get',
				data: null
			  })
			},
			getById(id) {
			  return serviceAPI.request({
				url: serviceId + '/qr/app/getById/' + id,
				method: 'get',
				data: null
			  })
			},
			getPersonalQRCode(params) {
			  return serviceAPI.request({
				url: serviceId + '/qr/app/getPersonalQRCode',
				method: 'POST',
				business: null,
				data: params
			  })
			},
			utils: {
				get(paramters, key) {
					for(var i in paramters) {
						if(paramters[i].name === key) {
							return paramters[i].value
						}
					}
					return null
				}
			}
		}
	}
}