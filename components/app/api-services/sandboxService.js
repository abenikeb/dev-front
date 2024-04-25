/** @format */

import http from "./httpService";
import * as _env from './httpConstant'

const urlEndpoints = _env.API_END_POINT;

export const getCredentials = () => {
  return http.get(urlEndpoints + "/...");
};

export const getCredential = async (id) => {
  return http.post(`${urlEndpoints}/${id}`);
};

export const saveCode = (codeSnippt) => {
  return http.post(`${urlEndpoints}`, codeSnippt);
};

export const saveCredential = (config) => {
  if (config.id) {
    let { id, ...newConfig } = config;
    return http.put(`${urlEndpoints}/../${id}`, newConfig);
  }

  return http.post(`${urlEndpoints}/...`, config);
};
