import Spinner from "_atoms/Spinner";
import MainNavigation from "_organisms/MainNavigation";
import MainFooter from "_organisms/MainFooter";
import Modal from "_atoms/Modal";

const Root = ({
  outlet,
  isLoading,
  userIsStaff,
  userError,
  handleUserError,
}) => {
  return (
    <div className="root-layout">
      <MainNavigation />
      {isLoading && <Spinner />}
      {!isLoading && <main className="root-layout-main">{outlet}</main>}
      <MainFooter userIsStaff={userIsStaff} />
      {userError && (
        <Modal onClose={handleUserError}>
          <>
            <h1>Errore!</h1>
            <p className="display-7 not-found">
              Impossibile caricare le informazioni dell&apos; utente
            </p>
            <p>Verrà forzata la disconnessione....</p>
            <p>Contatta un amministratore!</p>
          </>
        </Modal>
      )}
    </div>
  );
};

export default Root;
