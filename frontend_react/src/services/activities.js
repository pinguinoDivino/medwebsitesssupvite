import { axiosService, catchAxiosError } from "_/common/api.service";

export const getActivities = async (endpoint, params) => {
  try {
    const response = await axiosService(endpoint, "GET", undefined, {
      ...params,
    });
    const responseData = await response.data;

    return {
      results: responseData.results,
      next: responseData.next ? responseData.next : null,
    };
  } catch (e) {
    throw catchAxiosError(
      e,
      "Impossibile caricare le informazioni sulle attività richieste"
    );
  }
};

export const getUserActivities = async (activities) => {
  try {
    const response = await axiosService(`/api/user-${activities}/`);
    return { data: response.data };
  } catch (e) {
    throw catchAxiosError(
      e,
      "Impossibile caricare " + activities + " dell'utente"
    );
  }
};

export const getExperience = async (payload) => {
  try {
    const response = await axiosService(`/api/experiences/${payload.slug}/`);
    return { data: response.data };
  } catch (e) {
    throw catchAxiosError(
      e,
      "Impossibile caricare le informazioni sull' esperienza"
    );
  }
};

export const getExperienceAttrs = async (payload) => {
  try {
    const response = await axiosService(
      `/api/experience/${payload.slug}/attrs/`
    );
    return { attrs: response.data };
  } catch (e) {
    throw catchAxiosError(
      e,
      "Impossibile caricare le informazioni sugli attributi dell' esperienza"
    );
  }
};

export const getExperienceGraphData = async () => {
  try {
    const responseA = await axiosService("/api/data/experiences/types/");
    const responseB = await axiosService("/api/data/experiences/countries/");
    const responseC = await axiosService("/api/data/experiences/tags/");

    return {
      type: responseA.data,
      country: responseB.data,
      tags: responseC.data,
    };
  } catch (e) {
    throw catchAxiosError(e, "Impossibile caricare i dati dei grafici");
  }
};

export const getInternship = async (payload) => {
  try {
    const response = await axiosService(
      `/api/unipi-internships/${payload.slug}/`
    );
    return { data: response.data };
  } catch (e) {
    throw catchAxiosError(
      e,
      "Impossibile caricare le informazioni sull' esperienza"
    );
  }
};

export const putExperience = async (payload) => {
  console.log(payload);
  const formData = new FormData();
  Object.keys(payload.data.data).map((key) => {
    if (payload.data.data[key]) {
      formData.append(key, payload.data.data[key]);
    }
  });
  try {
    const response = await axiosService(
      payload.slug ? `/api/experiences/${payload.slug}/` : "/api/experiences/",
      payload.slug ? "PUT" : "POST",
      formData,
      undefined,
      { "content-type": "multipart/form-data" }
    );
    const slug = await response.data.slug;
    await axiosService(
      payload.slug
        ? `/api/experience/${payload.slug}/attrs/`
        : `/api/experience/${slug}/attrs/create/`,
      payload.slug ? "PUT" : "POST",
      payload.data.attrs
    );
  } catch (error) {
    throw catchAxiosError(error, "Errore durante il salvataggio dei dati");
  }
};

export const putInternship = async (payload) => {
  try {
    await axiosService(
      payload.slug
        ? `/api/unipi-internships/${payload.slug}/`
        : "/api/unipi-internships/",
      payload.slug ? "PUT" : "POST",
      payload.data
    );
  } catch (error) {
    throw catchAxiosError(error, "Errore durante il salvataggio dei dati");
  }
};

export const deleteActivity = async (payload) => {
  try {
    await axiosService(`/api/${payload.to}/${payload.slug}/`, "DELETE");
  } catch (error) {
    throw catchAxiosError(error, "Errore durante la cancellazione dei dati");
  }
};
