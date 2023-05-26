import { axiosService } from "../../../common/api.service";

export default {
  async loadUserInformation(context) {
    try {
      const response = await axiosService("/api/user/");
      context.commit("setUserInformation", {
        userName: response.data.username,
        fullName: response.data.full_name,
        userEmail: response.data.email,
        isAuth1: response.data.is_auth1,
        isAuth2: response.data.is_auth2,
        isAuth3: response.data.is_auth3,
        isAuth4: response.data.is_auth4,
        dpc: response.data.dpc,
        isStaff: response.data.is_staff,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
  async putUserDpc(context, payload){
    try {
      await axiosService("/api/user-dpc/", "PUT" , payload);
      context.commit("setDpc", {dpc: payload.dpc})
    } catch (error){
      console.log(error.message)
    }
  },
  changeUserTheme(context, payload) {
    context.commit("setTheme", payload);
  },
  turnOffAnimation(context){
    context.commit("setAnimated", true);
  }
};
