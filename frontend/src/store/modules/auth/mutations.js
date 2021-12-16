export default {
  setUserInformation(state, payload) {
    state.userName = payload.userName;
    state.userFullName = payload.fullName;
    state.userEmail = payload.userEmail;
    state.userIsAuth1 = payload.isAuth1;
    state.userIsAuth2 = payload.isAuth2;
    state.userIsStaff = payload.isStaff;
  },
  setTheme(state, payload) {
    state.theme = payload;
  },
  setAnimated(state, payload){
    state.animated = payload;
  }
};
