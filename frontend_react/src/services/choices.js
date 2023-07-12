import { axiosService, catchAxiosError } from "_/common/api.service";

export const getChoices = async (option) => {
  try {
    const response = await axiosService(`/api/${option}/`);
    return response.data;
  } catch (e) {
    throw catchAxiosError(
      e,
      "impossibile caricare i dati relativi a " + option.toString()
    );
  }
};

export const getExperienceTypes = async () => {
  return getChoices("experience-types");
};

export const getUniversities = () => {
  return getChoices("universities");
};

export const getCities = async () => {
  return getChoices("cities");
};

export const getCountries = async () => {
  return getChoices("countries");
};

export const getRegions = async () => {
  return getChoices("regions");
};

export const getTags = async (option = "") => {
  return getChoices(`tags/${option}`);
};

export const getTagGroups = async () => {
  return getChoices(`tags/groups`);
};

export const getInternshipWards = async () => {
  return getChoices("internship-wards");
};

export const getInternshipYears = async () => {
  return getChoices("internship-years");
};

export const getInternshipPlaces = async () => {
  return getChoices("internship-places");
};

export const getInternshipAttendances = async () => {
  return getChoices("internship-attendances");
};

export const postCityData = async (payload) => {
  try {
    const response = await axiosService(
      "/api/cities/create/",
      "POST",
      payload.data
    );
    return { data: response.data };
  } catch (e) {
    throw catchAxiosError(e, "Non è stato possibile creare la città");
  }
};

export const postTagData = async (payload) => {
  try {
    const response = await axiosService(
      "/api/tags/create/",
      "POST",
      payload.data
    );
    return { data: response.data };
  } catch (e) {
    throw catchAxiosError(e, "Non è stato possibile creare la città");
  }
};
