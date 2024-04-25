/** @format */
import http from "./httpService";
import jwtDecode from "jwt-decode";
import * as _env from "./httpConstant";
import Cookies from "js-cookie";
import { setCredential } from "./configService";
import { useRouter } from "next/navigation";
import signout from "./signout";
const apiEndpoint = _env.API_END_POINT;
const token = "token";
const expirationDate = "expirationDate";
const user = "user";
const expiresIn = 3600;
import { redirect } from "next/navigation";

export async function login(email, password, captchaCode) {
  try {
    const { data: access_token } = await http.post(
      `${apiEndpoint}/auth/login`,
      { email, password, captchaCode }
    );

    const expirationDates = new Date(new Date().getTime() + expiresIn * 1000);
    const user = jwtDecode(access_token.access_token);

    Cookies.set(token, access_token.access_token, { expires: 7 });
    Cookies.set(expirationDate, expirationDates, { expires: 7 });
    Cookies.set(user, user.id, { expires: 7 });

    return {
      response: "OK",
    };
  } catch (error) {
    return error;
  }
}

export function loginWithJwt(jwt) {
  console.log("JWT", jwt);
  const expirationDates = new Date(new Date().getTime() + expiresIn * 1000);
  const user = jwtDecode(jwt);

  Cookies.set(token, jwt, { expires: 7 });
  Cookies.set(expirationDate, expirationDates, { expires: 7 });
  Cookies.set(user, user.id, { expires: 7 });

  setCredential(user.id);
}

export function logout() {
  // let router = useRouter();
  Cookies.remove(token);
  Cookies.remove(expirationDate);
  Cookies.remove(user);
  // redirect("/guest/login");
}

export function getJwt() {
  Cookies.get(token);
}

export function getUserData() {
  try {
    return jwtDecode(Cookies.get(token));
  } catch (ex) {
    return null;
  }
}

export const checkAuthTimeOut = (expirationTime) => {
  setTimeout(() => {
    return logout();
  }, expirationTime * 1000);
};

export const authCheckState = () => {
  const token_ = Cookies.get(token);
  if (!token_) {
    return logout();
  } else {
    const expDate = new Date(Cookies.get(expirationDate));
    if (expDate < new Date()) {
      return logout();
    } else {
      return checkAuthTimeOut(
        (expDate.getTime() - new Date().getTime()) / 1000
      );
    }
  }
};

export default {
  login,
  logout,
  getUserData,
  loginWithJwt,
  authCheckState,
  getJwt,
};
