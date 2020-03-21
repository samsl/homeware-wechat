import Constant from "@/utils/constant"

const API_HOST = 'https://www.edith.fun'
// const API_HOST = 'http://localhost:8080'

export default ({
	request: function (url, method, data, header = {}) {
		if (url != 'login') {
			header[Constant.AUTHENTICATION] = wx.getStorageSync(Constant.AUTHENTICATION);
		}
		return new Promise((resolve, reject) => {
			wx.request({
				url: API_HOST + '/' + url,
				method: method,
				data: data,
				header: header,
				success: function (res) {
					if ([200, 201].includes(res.statusCode)) {
						if (Constant.AUTHENTICATION in res.header) {
							wx.setStorageSync(Constant.AUTHENTICATION, res.header[Constant.AUTHENTICATION]);
						}
						return resolve(res);
					}
					const pages = getCurrentPages();			
					const pageUrl = pages[pages.length-1].route;
					console.log("url: " + pageUrl);
					if (res.statusCode == 401 && pageUrl !=="pages/login/main") {
						const url = "/pages/login/main";
						wx.navigateTo({ url });
					}
					return reject(res);
				},
				fail: function (res) {
					reject({
						msg: 'call api failed'
					})

				}
			})
		})
	},
	get: function (path, data, header) {
		return this.request(path, 'GET', data, header);
	},
	post: function (path, data, header) {
		return this.request(path, 'POST', data, header)
	},
	update: function (path, data, header) {
		return this.request(path, 'PUT', data, header)
	}

});