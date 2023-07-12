import TitleRow from "_atoms/TitleRow";
import HomeRow from "_organisms/HomeRow";
import Modal from "_atoms/Modal";
import DpcForm from "_molecules/DpcForm";

import styles from "./index.module.css";

const Home = ({ animated, submitDpcData, src, handleError, showDpcModal }) => {
  return (
    <>
      <div className={styles["index-container"]}>
        <div className={`${animated ? styles["index-done"] : styles.index}`}>
          <div
            className={`${animated ? styles["content-done"] : styles.content}`}
            id="content-animated"
          >
            <div className={`container-fluid ${styles.containerFluid}`}>
              <TitleRow
                className="text-center text-lg-left"
                title="Benvenuto!"
              />
              <HomeRow
                imageClassName={styles["image-container"]}
                className={styles["row-sfs"]}
                subTitleText="SFS e Laboratori"
                subSubTitleText="Che cosa sono?"
                paragraphText="I soggiorni fuori sede e i laboratori sono parte integrante della
                  nostra esperienza formativa, infatti già da febbraio del primo anno
                  siamo incoraggiati a recarci in alcuni dipartimenti dell'università
                  di Pisa e del CNR. Ci permettono di affacciarci non solo al mondo
                  della ricerca ma anche di visitare alcune delle università più
                  prestigiose al mondo (Cambridge, Harvard, Oxford e Yale per citarne
                  alcune)."
                linkText="Sfoglia le nostre esperienze nei laboratori di tutto il mondo"
                link="esperienze"
                params={{ exp: "sfs" }}
                url={src.sfs}
                alt="SFS immagine di riferimento"
              />
              <HomeRow
                imageClassName={styles["image-container"]}
                className={styles["row-congress"]}
                subTitleText="Conferenze e Congressi"
                subSubTitleText="Dove?"
                paragraphText="Ogni giorno nell' Aula Magna è organizzata almeno una conferenza
                  tenuta, oltre che dai nostri Professori, anche da ricercatori di altre
                  università.
                  Esistono programmi annuali, come 'The Human Brain Project'
                  o il ciclo di Orizzonti in Medicina e Biologia in cui si invitano ospiti di fama internazionale.
                  Inoltre grazie a Scuola possiamo assistere a dei congressi internazionali
                  tenuti in altre città."
                linkText="Scopri i migliori congressi annuali a cui partecipar!"
                link="esperienze"
                params={{ exp: "congress" }}
                url={src.congress}
                alt="Congresso immagine di riferimento"
                right={false}
              />
              <HomeRow
                imageClassName={styles["image-container"]}
                className={styles["row-summerschool"]}
                subTitleText="Summer Schools"
                subSubTitleText="Davvero?"
                paragraphText="E' una scuola, o un programma generalmente sponsorizzato da una scuola o da un
                  distretto scolastico che fornisce lezioni e
                  attività durante le vacanze estive. La partecipazione alle scuole estive ha dimostrato di
                  avere effetti benefici sostanziali sul progresso educativo.
                  Negli ultimi anni sono state particolarmente apprezzate quelle di
                  neuroscienze presso l' SNS."
                linkText="Scopri delle fantastiche summer-school!"
                link="esperienze"
                params={{ exp: "summerschool" }}
                url={src.summerschool}
                alt="Summerschool immagine di riferimento"
              />
              <HomeRow
                imageClassName={styles["image-container"]}
                className={styles["row-erasmus"]}
                subTitleText="Erasmus"
                subSubTitleText="Dove?"
                paragraphText="Il programma Erasmus è un programma di mobilità studentesca dell' Unione europea, creato nel 1987.
                  Esso dà la possibilità a uno studente universitario europeo di effettuare in una università di
                  un altro stato dell' UE un periodo di studio legalmente riconosciuto dalla propria università.
                  Il nome del programma deriva dall'umanista e teologo olandese Erasmo da Rotterdam,
                  che viaggiò diversi anni in tutta Europa per comprenderne le differenti culture."
                linkText="Scopri i nostri viaggi di Erasmus"
                link="esperienze"
                params={{ exp: "erasmus" }}
                url={src.erasmus}
                alt="Erasmus immagine di riferimento"
                right={false}
              />
              <HomeRow
                imageClassName={styles["image-container"]}
                className={styles["row-internship"]}
                subTitleText="Tirocini"
                subSubTitleText="Altri?"
                paragraphText="Oltre ai tirocini professionalizzanti presso l'Università di Pisa si ha la possibilità
                  di svolgere internati presso la Fondazione Monasterio o presso altri enti associati a Scuola.
                  Inoltre esistono convenzioni con ospedali all'estero come il Sick Kids a Toronto che ci permettono
                  di accedere ai reparti dell'ospedale."
                linkText="Scopri dei tirocini aggiuntivi ed extracurriculari"
                link="esperienze"
                params={{ exp: "internship" }}
                url={src.internship}
                alt="Tirocini immagine di riferimento"
              />
            </div>
          </div>
        </div>
      </div>
      {showDpcModal && (
        <Modal title="Avviso" onClose={handleError}>
          <DpcForm submitDpcData={submitDpcData} />
        </Modal>
      )}
    </>
  );
};

export default Home;
