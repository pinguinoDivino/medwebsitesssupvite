const urlPattern = new RegExp(
  "^(https?:\\/\\/)?" + // validate protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
    "(\\#[-a-z\\d_]*)?$",
  "i"
); // validate fragment locator

export const noValidation = (val) => {
  return {
    inputIsNotValid: false,
    errorText: "",
  };
};

export const isEmpty = (val) => {
  return {
    inputIsNotValid: val === "" || val === undefined || val === null,
    errorText: "Questo campo non può essere omesso",
  };
};

export const isLink = (val) => {
  return {
    inputIsNotValid: val ? !urlPattern.test(val) : false,
    errorText: "Questo campo deve essere un link!",
  };
};

export const areUniqueItems = (val, arr = []) => {
  return {
    inputIsNotValid: arr.includes(val),
    errorText: "Questo elemento è già stato selezionato!",
  };
};
