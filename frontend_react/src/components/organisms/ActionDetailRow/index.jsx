import SvgButton from "_molecules/SvgButton";
import TextButton from "_atoms/TextButton";

const ActionDetailRow = ({
  clickBackHandler,
  clickActionHandler,
  userCanUseAsModel,
}) => {
  return (
    <div className="row p-1 text-center text-md-left mt-1">
      <div className="col-12 flex-row-space">
        <SvgButton text="Torna indietro" onclick={clickBackHandler} />
        {userCanUseAsModel && (
          <TextButton onClick={clickActionHandler} mode="info">
            Hai fatto anche tu questa esperienza? &nbsp;
            <span className="bold">Aggiungila!</span>
          </TextButton>
        )}
      </div>
    </div>
  );
};

export default ActionDetailRow;
