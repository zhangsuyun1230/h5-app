/**
     * 设置cookie
     * @param {string} name
     * @param {any} value
     * @param {number} time
     * @returns void
     */
export const setCookie = function (name, value, time) {
  let Days = time;
  let exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie =
    name +
    '=' +
    escape(value) +
    ';expires=' +
    exp.toGMTString() +
    ';path=/';
  sessionStorage.setItem('Timestamp', exp.getTime());
}
/**
     * 读取ookie
     * @param {string} name
     * @returns any
     */
export const getCookie = function (name) {
  let arr;
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  // eslint-disable-next-line no-cond-assign
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

/**
 * 安卓的toLocaleDateString只是年份，所以手动获取格式化时间
 */
export const getLocaleDateString = function(time) {
  const date = time ? new Date(time) : new Date();
  let taskStartTime = ''
  if (date.getMonth() < 9) {
    taskStartTime = date.getFullYear() + "/0" + (date.getMonth() + 1) + "/"
  } else {
    taskStartTime = date.getFullYear() + "/" + (date.getMonth() + 1) + "/"
  }
  if (date.getDate() < 10) {
    taskStartTime += "0" + date.getDate()
  } else {
    taskStartTime += date.getDate()
  }
  // 在ios中，日期格式需要转换为 / 连接日期
  return taskStartTime
}
