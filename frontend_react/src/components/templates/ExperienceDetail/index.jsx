import TitleRow from "_atoms/TitleRow";
import ReviewDetailRow from "_organisms/ReviewDetailRow";
import GeneralDetailRow from "_organisms/GeneralDetailRow";
import ContactDetailRow from "_organisms/ContactDetailRow";
import ActionDetailRow from "_organisms/ActionDetailRow";

const ExperienceDetail = ({
  experience,
  clickBackHandler,
  clickActionHandler,
  userCanUseAsModel,
}) => {
  return (
    <div className="container-fluid">
      <TitleRow title={experience.description} />
      <ReviewDetailRow
        review={experience.review}
        indications={experience.indications}
      />
      <GeneralDetailRow experience={experience} />
      <ContactDetailRow experience={experience} />
      <ActionDetailRow
        clickActionHandler={clickActionHandler}
        clickBackHandler={clickBackHandler}
        userCanUseAsModel={userCanUseAsModel}
      />
    </div>
  );
};

export default ExperienceDetail;
