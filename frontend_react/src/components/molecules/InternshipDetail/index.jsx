const InternshipDetail = ({ attrs, className }) => {
  return (
    <div className={`row ${className}`}>
      <div className="col-md-6">
        <h4>Istituto: </h4>
        <span className="display-7 bold">{attrs.institution}</span>
      </div>
      <div className="col-md-6">
        <h4>Reparto: </h4>
        <span className="bold">{attrs.ward}</span>
      </div>
    </div>
  );
};

export default InternshipDetail;
