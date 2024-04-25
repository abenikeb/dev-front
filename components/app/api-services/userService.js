/** @format */

import http from "./httpService";
import * as _env from "./httpConstant";
import { request } from "https";
import axios from "axios";
const apiEndpoint = _env.API_END_POINT;

const apiUrl = apiEndpoint + "/user/signup";
const merchantUrl = "https://developer.ethiotelecom.et/v2/merchant-info/";
function userUrl(id) {
  return `${apiEndpoint}/user/${id}`;
}

export function register(firstName, lastName, tel, email, password) {
  return http.post(apiUrl, {
    firstName,
    lastName,
    tel,
    email,
    password,
  });
}
export function registerOnManagementConsole(
  user_id,
  developerTeamName,
  companyName,
  businessCategory,
  officialWebsite,
  contactPersonName,
  contactPhone,
  contactEmail
) {
  return http.post(merchantUrl, {
    user_id,
    developerTeamName,
    companyName,
    contactPersonName,
    contactPhone,
    contactEmail,
    officialWebsite,
    businessCategory,
  });
}
// await axios.get(`https://developer.ethiotelecom.et/v2/appCubeUser/${userId}`)
export async function checkUserStatus(user_id) {
  return await http.get(merchantUrl + user_id);
}

export async function getappCubeUser(userId) {
  return await http.get("https://developer.ethiotelecom.et/v2/appCubeUser/" + userId);
}

export const update = async (userData) => {
  let body = { ...userData };
  delete body._id;
  return http.patch(userUrl(userData._id), body);
};

export const updatePassword = async (id, currentPassword, newPassword) => {
  return http.patch(`${apiEndpoint}/user/updatePassword/${id}`, {
    id,
    currentPassword,
    newPassword,
  });
};
