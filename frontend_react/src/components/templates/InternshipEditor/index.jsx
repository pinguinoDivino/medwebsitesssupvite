import TitleRow from "_atoms/TitleRow";
import FormGroup from "_organisms/FormGroup";
import TextButton from "_atoms/TextButton";

const InternshipEditor = ({
  formGroups,
  backHandler,
  submitDataHandler,
  nonFieldBackendError,
}) => {
  return (
    <div className="container-fluid">
      <TitleRow className="text-left" title="Tirocinio Curriculare" />
      <form>
        {formGroups.map((formGroup, index) => (
          <FormGroup key={index} {...formGroup} />
        ))}
      </form>
      {nonFieldBackendError && (
        <div className="row form-row">
          <div className="col-12">
            <p className="not-found">{nonFieldBackendError}</p>
          </div>
        </div>
      )}
      <div className="row form-group">
        <div className="col-4 col-sm-3 col-md-2 col-xl-1">
          <TextButton mode="danger" onClick={backHandler}>
            Indietro
          </TextButton>
        </div>
        <div className="col-4 col-sm-3 col-md-2 col-xl-1">
          <TextButton mode="success" onClick={submitDataHandler} type="button">
            Salva
          </TextButton>
        </div>
      </div>
    </div>
  );
};
export default InternshipEditor;
