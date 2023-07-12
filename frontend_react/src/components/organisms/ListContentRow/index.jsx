import ListSidebar from "_molecules/ListSidebar";
import Spinner from "_atoms/Spinner";
import TextButton from "_atoms/TextButton";
import Modal from "_atoms/Modal";
import useWindowSize from "_hooks/use-window-size";

import styles from "./index.module.css";

const ListContentRow = ({
  className,
  isLoading,
  filters,
  dispatch,
  areFiltersOpened,
  hasItems,
  hasNext,
  getNewItems,
  children,
  filterClickHandler,
}) => {
  const { width } = useWindowSize();

  return (
    <>
      <div className={`row ${className}`}>
        <div className="col-12">
          <ListSidebar
            filters={filters}
            updateFilterHandler={dispatch}
            className={` display-md ${styles.sidebar} ${
              !areFiltersOpened ? styles["sidebar-closed"] : ""
            }`}
          />
          <div
            className={`${styles["main-content"]} ${
              areFiltersOpened ? styles["main-content-pl"] : ""
            }`}
          >
            {isLoading && hasItems && <Spinner />}
            {!isLoading && hasItems && (
              <>
                {children}
                {hasNext && (
                  <div className="mt-1">
                    <TextButton onClick={getNewItems} mode="primary">
                      Carica ancora
                    </TextButton>
                  </div>
                )}
              </>
            )}
            {!isLoading && !hasItems && (
              <div>
                <p className="not-found display-6">
                  Non sono state trovate attività!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {width < 768 && areFiltersOpened && (
        <Modal title="Filtri" onClose={filterClickHandler}>
          <>
            <ListSidebar
              filters={filters}
              updateFilterHandler={dispatch}
              className={styles["modal-filter"]}
            />
            <TextButton
              className="m-1 ml-2"
              onClick={filterClickHandler}
              mode="danger"
            >
              Chiudi
            </TextButton>
          </>
        </Modal>
      )}
    </>
  );
};

export default ListContentRow;
