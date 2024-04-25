/** @format */

import http from "./httpService";
import * as _env from "./httpConstant";
const apiEndpoint = _env.API_END_POINT;

const apiUrl = apiEndpoint + "/user/signup";
const apiVerifyUrl = apiEndpoint + "/verification/send";
const merchantUrl = "https://developer.ethiotelecom.et/v2/merchant-info/";
function userUrl(id) {
  return `${apiEndpoint}/user/${id}`;
}

export function sendEmailVerification(email) {
  return http.post(apiVerifyUrl, { email });
}

export function register(
  firstName,
  lastName,
  tel,
  email,
  password,
  emailVerification,
  captchaCode
) {
  return http.post(apiUrl, {
    firstName,
    lastName,
    tel,
    email,
    password,
    captchaCode,
    otp: emailVerification,
    verifyed: true,
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
  contactEmail,
  activity,
  tenantId,
  tenantName,
  username,
  orderId,
  skuCode,
  productId,
  agent_id
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
    activity,
    tenantId,
    tenantName,
    username,
    orderId,
    skuCode,
    productId,
    agent_id,
  });
}
// await axios.get(`https://developer.ethiotelecom.et/v2/appCubeUser/${userId}`)
export async function checkUserStatus(user_id) {
  return await http.get(merchantUrl + user_id);
}

export async function checkUserStatusWithUserId(userId) {
  return await http.get(merchantUrl + userId);
}

export async function getappCubeUser(userId) {
  return await http.get(
    "https://developer.ethiotelecom.et/v2/appCubeUser/" + userId
  );
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
