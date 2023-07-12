import SubTitle from "_atoms/SubTitle";
import DetailRow from "_molecules/DetailRow";

const ReviewDetailRow = ({ review, indications, className }) => {
  const reviewInformation = review.split("&r)");

  const reviewA = reviewInformation[1];
  const reviewB = reviewInformation[2];
  const reviewC = reviewInformation[3];

  return (
    <section className={`row mb-1 ${className}`}>
      <div className="col-12 text-center text-lg-left">
        <SubTitle text="Le mie impressioni" />
        <DetailRow
          subA="Recensione"
          subB="Che cosa ho fatto?"
          subC="Riassunto dell'esperienza"
          text={reviewA}
        />
        <DetailRow
          subA="Recensione"
          subB="Come erano i professori e i ricercatori?"
          subC="Esplorando la fauna"
          isTextLeft={true}
          text={reviewB}
        />
        <DetailRow
          subA="Recensione"
          subB="A chi consiglio l'esperienza?"
          subC="Personale interesse"
          text={reviewC}
        />
        <DetailRow
          subA="Consigli"
          subB="Qualche dritta per ottenere il massimo?"
          subC="Non sprecare questa opportunità"
          isTextLeft={true}
          isHrShown={false}
          text={indications}
        />
      </div>
    </section>
  );
};

export default ReviewDetailRow;
