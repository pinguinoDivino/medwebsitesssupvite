import { Navigate } from "react-router-dom";
import useAuth from "_hooks/use-auth";

const Protected = ({ condition, children, to = "/", type }) => {
  if (!condition) {
    return <Navigate to={to} replace state={{ status: 401, type: type }} />;
  }
  return children;
};

export default Protected;

export const DpcProtected = ({ children, to = "/" }) => {
  const { userDpc } = useAuth();

  return (
    <Protected condition={userDpc} to={to} type="dpc">
      {children}
    </Protected>
  );
};
