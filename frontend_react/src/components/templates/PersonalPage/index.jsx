import { useState } from "react";
import TitleRow from "_atoms/TitleRow";
import Tabs from "_molecules/Tabs";
import UserExperiences from "_organisms/UserExperiences";
import UserInternships from "_organisms/UserInternships";
import Modal from "_atoms/Modal";
import styles from "./index.module.css";
import TextButton from "_atoms/TextButton";

const components = {
  experiences: UserExperiences,
  "unipi-internships": UserInternships,
};

const PersonalPage = ({
  userFullName,
  userIsAuth1,
  userIsAuth2,
  theme,
  data,
  to,
  wards,
  years,
  onDeleteHandler,
}) => {
  const options = [
    { label: "Esperienze", name: "experiences", condition: userIsAuth1 },
    { label: "Tirocini", name: "unipi-internships", condition: userIsAuth2 },
  ];

  const [activeComponentName, setActiveComponentName] = useState(
    to ? to : "experiences"
  );
  const [deleteSlug, setDeleteSlug] = useState("");

  const MainComponent = components[activeComponentName];

  const onDeleteClickHandler = (slug) => {
    setDeleteSlug(slug);
  };

  const onDeleteModalCloseHandler = () => {
    setDeleteSlug("");
  };

  const onDeleteConfirmationHandler = () => {
    onDeleteHandler(deleteSlug, activeComponentName);
  };

  return (
    <>
      <div className="container-fluid">
        <TitleRow title={"Benvenuto " + userFullName} className="text-left" />
        <div className="row">
          <Tabs
            className="col-12"
            options={options}
            state={activeComponentName}
            onClickHandler={setActiveComponentName}
          />
          {activeComponentName && (
            <MainComponent
              className={`col-12 ${styles.page}`}
              activities={data[activeComponentName]}
              hasActivities={
                data[activeComponentName] &&
                data[activeComponentName].length > 0
              }
              wards={wards}
              years={years}
              onDeleteHandler={onDeleteClickHandler}
              theme={theme}
            />
          )}
        </div>
      </div>
      {deleteSlug && (
        <Modal
          onClose={onDeleteModalCloseHandler}
          title="Richiesta di eliminazione"
        >
          <div className="p-1 m-1">
            <p className="display-7">
              Sei sicuro di voler cancellare il {deleteSlug}?
            </p>
            <div>
              <TextButton mode="success" onClick={onDeleteConfirmationHandler}>
                Confermo
              </TextButton>
              <TextButton mode="info" onClick={onDeleteModalCloseHandler}>
                Indietro
              </TextButton>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PersonalPage;
