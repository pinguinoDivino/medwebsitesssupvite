import React from "react";
import useThemeDetector from "_hooks/use-theme-detector";
import { useReducer } from "react";
// Auth Context
const AuthContext = React.createContext({
  userName: null,
  userFullName: null,
  userEmail: null,
  userIsAuth1: false,
  userIsAuth2: false,
  userIsAuth3: false,
  userIsAuth4: false,
  userIsStaff: false,
  userDpc: false,
  theme: "light",
  animated: false,
  // eslint-disable-next-line no-unused-vars
  onStoreUserInformation: (payload) => {},
  // eslint-disable-next-line no-unused-vars
  onChangeUserDpc: (payload) => {},
  // eslint-disable-next-line no-unused-vars
  onChangeUserTheme: (payload) => {},
  onTurnOffHomeAnimation: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case "STORE_USER_INFORMATION": {
      return {
        ...state,
        userName: action.payload.userName,
        userFullName: action.payload.fullName,
        userEmail: action.payload.email,
        userIsAuth1: action.payload.isAuth1,
        userIsAuth2: action.payload.isAuth2,
        userIsAuth3: action.payload.isAuth3,
        userIsAuth4: action.payload.isAuth4,
        userIsStaff: action.payload.isStaff,
        userDpc: action.payload.dpc,
      };
    }
    case "CHANGE_USER_DPC": {
      return { ...state, userDpc: action.payload.dpc };
    }
    case "CHANGE_USER_THEME": {
      return { ...state, theme: action.payload.theme };
    }
    case "TURN_OFF_HOME_ANIMATION": {
      return { ...state, animated: true };
    }
  }

  return state;
};

export const AuthContextProvider = ({ children }) => {
  const isDarkTheme = useThemeDetector(); // use browser color schema

  const [authState, dispatchAuthAction] = useReducer(
    authReducer,
    {
      userName: null,
      userFullName: null,
      userEmail: null,
      userIsAuth1: false,
      userIsAuth2: false,
      userIsAuth3: false,
      userIsAuth4: false,
      userIsStaff: false,
      userDpc: false,
      theme: isDarkTheme ? "dark" : "light",
      animated: false,
    },
    undefined
  );

  const storeUserInformationHandler = (payload) => {
    dispatchAuthAction({ type: "STORE_USER_INFORMATION", payload: payload });
  };

  const changeUserDpcHandler = (payload) => {
    dispatchAuthAction({ type: "CHANGE_USER_DPC", payload: payload });
  };

  const changeUserThemeHandler = (payload) => {
    dispatchAuthAction({ type: "CHANGE_USER_THEME", payload: payload });
  };

  const turnOffHomeAnimationHandler = () => {
    dispatchAuthAction({ type: "TURN_OFF_HOME_ANIMATION" });
  };

  const authContext = {
    userName: authState.userName,
    userFullName: authState.userFullName,
    userEmail: authState.userEmail,
    userIsAuth1: authState.userIsAuth1,
    userIsAuth2: authState.userIsAuth2,
    userIsAuth3: authState.userIsAuth3,
    userIsAuth4: authState.userIsAuth4,
    userIsStaff: authState.userIsStaff,
    userDpc: authState.userDpc,
    theme: authState.theme,
    animated: authState.animated,
    onStoreUserInformation: storeUserInformationHandler,
    onChangeUserDpc: changeUserDpcHandler,
    onChangeUserTheme: changeUserThemeHandler,
    onTurnOffHomeAnimation: turnOffHomeAnimationHandler,
  };

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
