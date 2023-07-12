import { useRouteError } from "react-router-dom";
import Error from "_templates/Error";

const ErrorPage = () => {
  const error = useRouteError();

  const getErrorText = () => {
    if (error.status) {
      switch (error.status) {
        case 404:
          return "404- Elemento Non trovato";
        case 500:
          return "500- Errore di sistema. Contatta un amministratore!";
      }
    }
  };

  const errorText = getErrorText();

  return <Error errorText={errorText} />;
};

export default ErrorPage;
