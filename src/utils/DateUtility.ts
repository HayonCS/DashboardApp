export const getShift = (date: Date) => {
  var shiftFirst = new Date(date.getTime());
  var shiftSecond = new Date(date.getTime());
  shiftFirst.setHours(2);
  shiftFirst.setMinutes(15);
  shiftFirst.setSeconds(0);
  shiftSecond.setHours(14);
  shiftSecond.setMinutes(15);
  shiftSecond.setSeconds(0);
  if (date < shiftFirst) {
    return 2;
  }
  if (date < shiftSecond) {
    return 1;
  }
  if (date >= shiftSecond) {
    return 2;
  }
  return 0;
};

export const getDateStringCurrent = () => {
  var date = new Date();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
  return dateString;
};

export const getDateStringShift = () => {
  var date = new Date();
  var shiftFirst = new Date(date.getTime());
  shiftFirst.setHours(2);
  shiftFirst.setMinutes(15);
  shiftFirst.setSeconds(0);
  if (date < shiftFirst) {
    return getDateStringPrevious();
  }
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
  return dateString;
};

export const getDateStringPrevious = () => {
  var date = new Date(new Date().setDate(new Date().getDate() - 1));
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
  return dateString;
};

export const getDateStringNext = () => {
  var date = new Date(new Date().setDate(new Date().getDate() + 1));
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
  return dateString;
};

export const getTimeString = (date: Date) => {
  var hour = ("0" + date.getHours()).slice(-2);
  var min = ("0" + date.getMinutes()).slice(-2);
  var dateString = hour + ":" + min;
  return dateString;
};

// export const getTimeString = (date: Date) => {
//   var hour = ("0" + date.getHours()).slice(-2);
//   var min = ("0" + date.getMinutes()).slice(-2);
//   var sec = ("0" + date.getSeconds()).slice(-2);
//   var dateString = hour + ":" + min + ":" + sec;
//   return dateString;
// };

export const getTimeStringConnection = (date: Date) => {
  var dateString = date.toLocaleTimeString();
  return dateString;
};

export const getDateTime = (
  date: Date,
  hr: number,
  min: number,
  sec: number
) => {
  let d = new Date(date.getTime());
  d.setHours(hr);
  d.setMinutes(min);
  d.setSeconds(sec);
  d.setMilliseconds(0);
  return d;
};
