import { useContext, useEffect, useState, useCallback } from "react";
import { baseUrl } from "_/common/utils";
import AuthContext from "_contexts/auth-context";
import { getUserData, putUserDpc } from "_services/auth";

const useAuth = () => {
  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const userData = await getUserData();
    authCtx.onStoreUserInformation(userData);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserData().catch((e) => setError(e));
  }, [loadUserData]);

  const updateUserDpc = useCallback(async (payload) => {
    const userDpc = await putUserDpc(payload);
    authCtx.onChangeUserDpc(userDpc);
  }, []);

  const handleUserError = useCallback(() => {
    setError(null);
    setTimeout(() => {
      window.location.replace(baseUrl + "accounts/logout/");
    }, 3000);
  }, []);

  return {
    userFullName: authCtx.userFullName,
    userEmail: authCtx.userEmail,
    userIsAuth1: authCtx.userIsAuth1,
    userIsAuth2: authCtx.userIsAuth2,
    userIsAuth3: authCtx.userIsAuth3,
    userIsAuth4: authCtx.userIsAuth4,
    userIsStaff: authCtx.userIsStaff,
    userDpc: authCtx.userDpc,
    theme: authCtx.theme,
    animated: authCtx.animated,
    updateUserDpc,
    loadUserData,
    changeUserTheme: authCtx.onChangeUserTheme,
    turnOffHomeAnimation: authCtx.onTurnOffHomeAnimation,
    isLoading,
    error,
    handleUserError: handleUserError,
  };
};

export default useAuth;
