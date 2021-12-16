import {axiosService, catchAxiosError} from "../../../common/api.service";

export default {
  async loadCities(context) {
    let responseData = null;
    try {
      const response = await axiosService("/api/cities/");
      responseData = await response.data;
    } catch (error) {
      throw catchAxiosError(error, "Non è stato possibile caricare le città");
    }
    context.commit("setCities", {cities: responseData});
  },
  async loadUniversities(context) {
    let responseData = null;
    try {
      const response = await axiosService("/api/universities/");
      responseData = await response.data;
    } catch (error) {
      throw catchAxiosError(
        error,
        "Non è stato possibile caricare le università"
      );
    }
    context.commit("setUniversities", {universities: responseData});
  },
  async loadExpTags(context) {
    let responseData = null;
    try {
      const response = await axiosService("/api/exp-tags/");
      responseData = await response.data;
    } catch (error) {
      throw catchAxiosError(error, "Non è stato possibile caricare i tags");
    }
    context.commit("setExpTags", {tags: responseData});
  },
  async loadOppTags(context) {
    let responseData = null;
    try {
      const response = await axiosService("/api/opp-tags/");
      responseData = await response.data;
    } catch (error) {
      throw catchAxiosError(error, "Non è stato possibile caricare i tags");
    }
    context.commit("setOppTags", {tags: responseData});
  },
  async addCity(context, payload) {
    try {
      const response = await axiosService(
        "/api/cities/create/",
        "POST",
        payload.data
      );
      context.commit("addCity", {city: response.data});
    } catch (error) {
      throw new Error(error.message || "Non è stato possibile creare la città");
    }
  },
  async addTag(context, payload) {
    try {
      const response = await axiosService(
        "/api/tags/create/",
        "POST",
        payload.data
      );
      context.commit("addTag", {tag: response.data, tp: payload.tp});
    } catch (error) {
      throw new Error(error.message || "Non è stato possibile creare il tag");
    }
  },
  async loadUserExperiences(context) {
    const userExps = [];
    try {
      const response = await axiosService("api/user-experiences/");
      const results = await response.data;
      for (const act of results) {
        userExps.push(act);
      }
    } catch (error) {
      throw catchAxiosError(
        error,
        "Errore durante il caricamento delle esperienze"
      );
    }
    context.commit("setUserExperiences", {userExps});
  },
  async putExperience(context, payload) {
    let slug = null;
    let create = false;
    if (payload.slug === null) {
      create = true;
    }
    try {
      const response = await axiosService(
        create ? "/api/experiences/" : `/api/experiences/${payload.slug}/`,
        create ? "POST" : "PUT",
        payload.data
      );
      slug = await response.data.slug;
    } catch (error) {
      throw catchAxiosError(
        error,
        "Errore durante l'inserimento dell' esperienza nel database"
      );
    }
    if (payload.img) {
      const formDataImg = new FormData();
      formDataImg.append("img", payload.img, payload.img.name);
      try {
        await axiosService(
          `/api/experience/${slug}/update-img/`,
          "PATCH",
          formDataImg
        );
      } catch (e) {
        throw catchAxiosError(e, "Errore nel caricamento dell'immagine");
      }
    }
    try {
      await axiosService(
        create
          ? `/api/experience/${slug}/${payload.attr.attr}/create/`
          : `/api/experience/${payload.slug}/attrs/`,
        create ? "POST" : "PUT",
        payload.attr
      );
    } catch (e) {
      throw catchAxiosError(
        e,
        "Non è stato possibile aggiungere gli attributi dell'esperienza"
      );
    }
    try {
      const response = await axiosService(`/api/experiences/${slug}/`);
      if (create) {
        context.commit("addUserExperience", response.data);
      } else {
        context.commit("updateUserExperience", response.data);
      }
    } catch (e) {
      throw catchAxiosError(e, "Nessuna esperienza trovata");
    }
  },
  async loadUserInternships(context) {
    const userInts = [];
    try {
      const response = await axiosService("api/user-internships/");
      const results = await response.data;
      for (const act of results) {
        userInts.push(act);
      }
    } catch (error) {
      throw catchAxiosError(
        error,
        "Errore durante il caricamento delle esperienze"
      );
    }
    context.commit("setUserInternships", {userInts});
  },
  async putInternship(context, payload) {
    let slug = null;
    let create = false;
    if (payload.slug === null) {
      create = true;
    }
    try {
      const response = await axiosService(
        create ? "/api/unipi-internships/" : `/api/unipi-internships/${payload.slug}/`,
        create ? "POST" : "PUT",
        payload.data
      );
      slug = await response.data.slug;
    } catch (error) {
      throw catchAxiosError(
        error,
        "Errore durante l'inserimento del tirocinio nel database"
      );
    }
    try {
      const response = await axiosService(`/api/unipi-internships/${slug}/`);
      if (create) {
        context.commit("addUserInternship", response.data);
      } else {
        context.commit("updateUserInternship", response.data);
      }
    } catch (e) {
      throw catchAxiosError(e, "Nessun tirocinio trovato");
    }
  },
  async loadUserOpportunities(context) {
    const userOpps = [];
    try {
      const response = await axiosService("api/user-opportunities/");
      const results = await response.data;
      for (const act of results) {
        userOpps.push(act);
      }
    } catch (error) {
      throw catchAxiosError(
        error,
        "Errore durante il caricamento delle opportunità"
      );
    }
    context.commit("setUserOpportunities", {userOpps});
  },
  async putOpportunity(context, payload) {
    let slug = null;
    let create = false;
    if (payload.slug === null) {
      create = true;
    }
    try {
      const response = await axiosService(
        create ? "/api/opportunities/" : `/api/opportunities/${payload.slug}/`,
        create ? "POST" : "PUT",
        payload.data
      );
      slug = await response.data.slug;
    } catch (error) {
      throw catchAxiosError(
        error,
        "Errore durante l'inserimento dell' opportunità nel database"
      );
    }
    try {
      const response = await axiosService(`/api/opportunities/${slug}/`);
      if (create) {
        context.commit("addUserOpportunity", response.data);
      } else {
        context.commit("updateUserOpportunity", response.data);
      }
    } catch (e) {
      throw catchAxiosError(e, "Nessuna opportunità trovata");
    }
  },
  async deleteExperience(context, payload){
    try {
      await axiosService(`/api/experiences/${payload.slug}/`, "DELETE");
    } catch (error) {
      throw catchAxiosError(
        error,
        "Errore durante la cancellazione dell'esperienza"
      );
    }
    context.commit("deleteUserExperience", payload.slug);
  },
  async deleteInternship(context, payload){
    try {
      await axiosService(`/api/unipi-internships/${payload.slug}/`, "DELETE");
    } catch (error) {
      throw catchAxiosError(
        error,
        "Errore durante la cancellazione del tirocinio"
      );
    }
    context.commit("deleteUserInternship", payload.slug);
  },
  async deleteOpportunity(context, payload){
    try {
      await axiosService(`/api/opportunities/${payload.slug}/`, "DELETE");
    } catch (error) {
      throw catchAxiosError(
        error,
        "Errore durante la cancellazione dell' opportunità"
      );
    }
    context.commit("deleteUserOpportunity", payload.slug);
  },
};
