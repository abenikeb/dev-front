/** @format */

import http from "./httpService";
import * as _env from "./httpConstant";

const urlEndpoints = _env.API_END_POINT;

export const getForums = () => {
  return http.get(urlEndpoints + "/forumPost");
};

export const getForum = async (id) => {
  return http.post(`${urlEndpoints}/${id}`);
};

export const saveFroum = (forum) => {
  //console.log("forum", forum);
  if (forum.id) {
    let { id, ...newForum } = forum;
    return http.put(`${urlEndpoints}/${id}`, newForum);
  }

  return http.post(`${urlEndpoints}/forumPost`, forum);
};
