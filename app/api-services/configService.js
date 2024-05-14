/** @format */

import http from "./httpService";
import * as _env from "./httpConstant";

const apiEndpoint = _env.API_END_POINT + "/configurations";
const merchant = _env.API_END_POINT + "/merchant-info";
export const getCredential = async (id) => {
  return http.get(`${merchant}/${id}`);
};

export const setCredential = async (id) => {
  //console.log("User Id", id);
  return http.post(`${apiEndpoint}/${id}`);
};

export const saveCredential = (config) => {
  if (config.id) {
    let { id, ...newConfig } = config;
    return http.put(`${apiEndpoint}/../${id}`, newConfig);
  }
  return http.post(`${apiEndpoint}/...`, config);
};
