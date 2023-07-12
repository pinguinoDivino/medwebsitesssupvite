import { useEffect } from "react";
import { Outlet, useNavigation, useLocation } from "react-router-dom";
import useAuth from "_hooks/use-auth";
import Root from "_templates/RootLayout";

const RootLayout = () => {
  const navigation = useNavigation();
  const location = useLocation();

  const {
    isLoading: userIsLoading,
    error: userError,
    userIsStaff,
    turnOffHomeAnimation,
    handleUserError,
    animated,
  } = useAuth();

  useEffect(() => {
    if (location.pathname !== "/" && !animated) {
      turnOffHomeAnimation();
    }
  }, [location.pathname]);

  const isLoading = userIsLoading || navigation.state === "loading";

  return (
    <Root
      isLoading={isLoading}
      userError={userError}
      userIsStaff={userIsStaff}
      handleUserError={handleUserError}
      outlet={<Outlet />}
    />
  );
};

export default RootLayout;
