function useGoodDateFormat() {
  function getGoodDateFormat(date) {
    if (date !== null) {
      const els = date.split("-");
      return els[2] + "-" + els[1] + "-" + els[0];
    } else {
      return "Non ancora conclusa";
    }
  }
  function dateDiff(startingDate, endingDate, format="std") {
    let startDate = new Date(
      new Date(startingDate).toISOString().substr(0, 10)
    );
    if (!endingDate) {
      endingDate = new Date().toISOString().substr(0, 10); // need date in YYYY-MM-DD format
    }
    let endDate = new Date(endingDate);
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
    if( format === "std"){
     return yearDiff + "Y " + monthDiff + "M " + dayDiff + "D";
    } else if(format=== "it") {
      const a = yearDiff===1 ? " anno " : " anni ";
      const b = monthDiff===1 ? " mese " : " mesi " ;
      const c = dayDiff===1 ? " giorno " : " giorni ";
      return yearDiff + a + monthDiff + b + dayDiff + c;
    }
  }

  return { getGoodDateFormat, dateDiff };
}

function useGoodDatePeriodFormat() {
  function getGoodDatePeriodFormat(date) {
    const mounths = [
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
      "dicembre"
    ];
    const els = date.split("-");
    return mounths[els[1] - 1] + " " + els[0];
  }

  return { getGoodDatePeriodFormat };
}

export { useGoodDateFormat, useGoodDatePeriodFormat };
