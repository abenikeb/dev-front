import axios from "axios";

const baseURL = '/gateway/payment/v1/';

 const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
 });

 export default axiosInstance