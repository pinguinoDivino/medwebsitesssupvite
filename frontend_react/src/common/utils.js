export const baseUrl = import.meta.env.PROD
  ? "https://medexperiences.santannapisa.it/"
  : "http://127.0.0.1:8000/";

export const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const removeDuplicates = (arr) => {
  return arr.filter((item, index) => arr.indexOf(item) === index);
};

export const removeDuplicatesFromObjectArray = (arr, uniqueKey) => {
  return [...new Map(arr.map((item) => [item[uniqueKey], item])).values()];
};

export const getEditDateFormat = (date) => {
  if (date !== null) {
    const els = date.split("-");
    return els[2] + "-" + els[1] + "-" + els[0];
  } else {
    return "Non ancora conclusa";
  }
};
export const dateDiff = (startingDate, endingDate, format = "std") => {
  let startDate = new Date(
    new Date(getEditDateFormat(startingDate)).toISOString().substr(0, 10)
  );
  if (!endingDate) {
    endingDate = new Date().toISOString().substr(0, 10); // need date in YYYY-MM-DD format
  }
  let endDate = new Date(getEditDateFormat(endingDate));
  if (startDate > endDate) {
    let swap = startDate;
    startDate = endDate;
    endDate = swap;
  }
  const startYear = startDate.getFullYear();
  const february =
    (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0
      ? 29
      : 28;
  const daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let yearDiff = endDate.getFullYear() - startYear;
  let monthDiff = endDate.getMonth() - startDate.getMonth();
  if (monthDiff < 0) {
    yearDiff--;
    monthDiff += 12;
  }
  let dayDiff = endDate.getDate() - startDate.getDate();
  if (dayDiff < 0) {
    if (monthDiff > 0) {
      monthDiff--;
    } else {
      yearDiff--;
      monthDiff = 11;
    }
    dayDiff += daysInMonth[startDate.getMonth()];
  }
  if (format === "std") {
    return yearDiff + "Y " + monthDiff + "M " + dayDiff + "D";
  } else if (format === "it") {
    const a = yearDiff === 1 ? " anno " : " anni ";
    const b = monthDiff === 1 ? " mese " : " mesi ";
    const c = dayDiff === 1 ? " giorno " : " giorni ";
    return yearDiff + a + monthDiff + b + dayDiff + c;
  }
};
export const getGoodDatePeriodFormat = (date) => {
  const months = [
    "gennaio",
    "febbraio",
    "marzo",
    "aprile",
    "maggio",
    "giugno",
    "luglio",
    "agosto",
    "settembre",
    "ottobre",
    "novembre",
    "dicembre",
  ];
  const els = date.split("-");
  return months[els[1] - 1] + " " + els[0];
};

export const getLabelFromNestedArray = (array, val) => {
  for (const x of array) {
    if (x[0] === val) return x[1];
  }
};

export const getLabelFromObjectArray = (val, array, labelKey, valueKey) => {
  for (const x of array) {
    if (x[valueKey] === val) return x[labelKey];
  }
};

export const convertNestedArrayIntoArrayOfObjects = (array, keyName) => {
  const newArray = [];

  for (const item of array) {
    const obj = {};
    for (const index in item) {
      obj[keyName[index]] = item[index];
    }
    newArray.push(obj);
  }
  return newArray;
};

export const getValueFromNestedArray = (array, label) => {
  for (const x of array) {
    if (x[1] === label) return x[0];
  }
};
