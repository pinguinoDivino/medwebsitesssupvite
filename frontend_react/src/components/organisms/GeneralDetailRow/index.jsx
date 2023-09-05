import SubTitle from "_atoms/SubTitle";
import RatingsDetail from "_molecules/RatingsDetail";
import LogisticDetail from "_molecules/LogisticDetail";
import SfsDetailRow from "_molecules/SfsDetailRow";
import CongressDetailRow from "_molecules/CongressDetailRow";
import InternshipDetail from "_molecules/InternshipDetail";
import styles from "./index.module.css";

const GeneralDetailRow = ({ experience, className }) => {
  const attrComponent = (() => {
    switch (experience.type) {
      case "SFS" || "Laboratorio" || "Erasmus":
        return <SfsDetailRow attrs={experience.attrs} />;
      case "Congresso":
        return <CongressDetailRow attrs={experience.attrs} />;
      case "Tirocinio":
        return <InternshipDetail attrs={experience.attrs} />;
      default:
        // eslint-disable-next-line react/no-unescaped-entities
        return <p className="not-found">Errore nel caricamento dell'evento</p>;
    }
  })();

  return (
    <section className={`row ${styles["general-row"]}  ${className}`}>
      <div className="col-12">
        <SubTitle text="Informazioni generali" />

        <div className="row">
          <div className="col-md-8 col-lg-9 text-center text-md-left pb-1">
            <RatingsDetail rating={experience.rating} />
            <h3 className="mt-1">Altre informazioni</h3>
            {attrComponent}
          </div>

          <LogisticDetail
            city={experience.city}
            universities={experience.universities}
            staringDate={experience.started_at}
            endingDate={experience.ended_at}
          />
        </div>
      </div>
    </section>
  );
};

export default GeneralDetailRow;
