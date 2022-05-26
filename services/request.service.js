import storage from "../services/storage.service.js";
import BASE_URL from "../services/environment.service.js";

const get = function(url, data, header){
  return uni.request({
    method: "GET",
    url: BASE_URL + url,
    data: data,
    header: header
  });
};

const post = function(url, data, header) {
  return uni.request({
    method: "POST",
    url: BASE_URL + url,
    data: data,
    header: header
  });
};

const put = function(url, data, header) {
  return uni.request({
    method: "PUT",
    url: BASE_URL + url,
    data: data,
    header: header
  });
};

const del = function(url, data, header) {
  return uni.request({
    method: "DELETE",
    url: BASE_URL + url,
    data: data,
    header: header
  });
};

let token = storage.AUTH_USER.token;

const authGet = function(url, data) {
  return uni.request({
    method: "GET",
    url: BASE_URL + url,
    data: data,
    header: { Authorization: `Bearer ${token}` }
  });
};

const authPost = function(url, data) {
  return uni.request({
    method: "POST",
    url: BASE_URL + url,
    data: data,
    header: { Authorization: `Bearer ${token}` }
  });
};

const authPut = function(url, data) {
  return uni.request({
    method: "PUT",
    url: BASE_URL + url,
    data: data,
    header: { Authorization: `Bearer ${token}` }
  });
};

const authDel = function(url, data) {
  return uni.request({
    method: "DELETE",
    url: BASE_URL + url,
    data: data,
    header: { Authorization: `Bearer ${token}` }
  });
};

export default {
  get,
  put,
  post,
  del,
  authGet,
  authPost,
  authPut,
  authDel
};
