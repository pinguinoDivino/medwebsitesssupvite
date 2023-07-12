import StarRating from "_atoms/StarRating";

const RatingsDetail = ({ rating }) => {
  return (
    <>
      <hr />
      <h3>Valutazioni</h3>
      <div className="row">
        <div className="col-lg-6">
          <h4>Globale</h4>
          <StarRating value={rating.global_r} />
        </div>
        <div className="col-lg-6">
          <h4>Luogo</h4>
          <StarRating value={rating.stay_r} />
        </div>
        <div className="col-lg-6">
          <h4>Conoscenze</h4>
          <StarRating value={rating.acquired_knowledge_r} />
        </div>
        <div className="col-lg-6">
          <h4>Coinvolgimento</h4>
          <StarRating value={rating.involvement_r} />
        </div>
      </div>
    </>
  );
};

export default RatingsDetail;
