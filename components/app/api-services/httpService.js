/** @format */

import axios from "axios";

const axiosInstance = axios.create({
  timeout: 6000000,
});


function setJwt(jwt) {
	axios.defaults.headers.common["Authorization"] = 'Bearer ' + jwt;
}

export default {
	get: axiosInstance.get,
	post: axiosInstance.post,
	put: axiosInstance.put,
	patch: axiosInstance.patch,
	delete: axiosInstance.delete,
	setJwt,
};

// axios.interceptors.response.use(null, (error) => {
// 	const ExpectedError =
// 		error.response &&
// 		error.response.status >= 400 &&
// 		error.response.status <= 500;
// 	if (!ExpectedError) {
// 		console.log('Unexpected Error', error);
// 	}

// 	return Promise.reject(error); //pass control to catch
// });


