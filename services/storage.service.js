// 管理账号信息
const USER_KEY = "userInfo";
const AUTH_USER = {
  authenticated: false,
  token: "",
  user: null
};

/**
 * Storage 存储
 * @param key 存储名
 * @param data 存储数据
 */
const set = function(key, data) {
  uni.setStorageSync(key, data);
};

/**
 * 获取存储信息
 * @param key 存储名
 */

const get = function(key) {
  return uni.getStorageSync(key);
};

/**
 * 获取默认存储信息
 */
const getUser = function() {
  let ret = get(USER_KEY);
  if (!ret) {
    ret = "[]";
  }
  return JSON.parse(ret);
};
/**
 * 设置默认存储信息
 * @param user 默认用户
 */
const setUser = function(user) {
  return set(USER_KEY, JSON.stringify(user));
};

/**
 * 删除存储信息
 * @param key 存储名
 */
const remove = function(key) {
  uni.removeStorageSync(key);
};
/**
 * 删除用户信息
 */
const removeUser = function() {
  return resetToken();
};

/**
 *获取token
 */
const getToken = function() {
  let data =  getUser()
  if (data) {
    AUTH_USER = data;
  }
  return AUTH_USER;
};
/**
 * 存储token
 */

const setToken = function(token) {
  AUTH_USER.token = token;
  if (token) {
    AUTH_USER.authenticated = true;
    return setUser(AUTH_USER);
  }
};

/**
 * 重置token
 */
const resetToken = function() {
  AUTH_USER = {
    authenticated: false,
    token: "",
    user: null
  };
  setUser(AUTH_USER);
};

export default {
  set,
  get,
  getUser,
  setUser,
  setToken,
  getToken,
  remove,
  removeUser,
  resetToken,
  AUTH_USER
};
