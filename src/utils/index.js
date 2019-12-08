import { isNumber } from "util";

function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
export function formatDate(date) {
  if (isNaN(date)) {
    let dateString = date.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').replace(/(-)/g, '/');
    date = new Date(dateString.slice(0, dateString.indexOf(".")));
    date = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }));
  } else {
    date = new Date(date)
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const t1 = [year, month, day].map(formatNumber).join('-')
  return t1;
}
export function formatTime(date) {

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = formatDate(date)
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export default {
  formatNumber,
  formatTime,
  formatDate
};
