import { axiosService, catchAxiosError } from "_/common/api.service";

export const getUserData = async () => {
  try {
    const response = await axiosService("/api/user/");
    return {
      userName: response.data.username,
      fullName: response.data.full_name,
      email: response.data.email,
      isAuth1: response.data.is_auth1,
      isAuth2: response.data.is_auth2,
      isAuth3: response.data.is_auth3,
      isAuth4: response.data.is_auth4,
      dpc: response.data.dpc,
      isStaff: response.data.is_staff,
    };
  } catch (e) {
    throw catchAxiosError(
      e,
      "Impossibile caricare le informazioni sull'utente"
    );
  }
};

export const putUserDpc = async (payload) => {
  try {
    await axiosService("/api/user-dpc/", "PUT", payload);
    return { dpc: payload.dpc };
  } catch (e) {
    throw catchAxiosError(
      e,
      "Impossibile aggiornare il trattamento dati dell'utente"
    );
  }
};
