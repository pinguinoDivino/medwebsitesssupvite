import Image from "_atoms/Image";
import HomeTextContainer from "_molecules/HomeTextContainer";
import SpacerRow from "_atoms/SpacerRow";

const HomeRow = ({
  className,
  imageClassName,
  right = true,
  url,
  alt,
  link,
  linkText,
  paragraphText,
  params,
  subTitleText,
  subSubTitleText,
}) => {
  return (
    <>
      <div className={`row ${className}`}>
        <Image
          className={`col-lg-8 ${right ? "order-lg-2" : ""} ${imageClassName}`}
          text={alt}
          url={url}
        />
        <div className="col-lg-4">
          <HomeTextContainer
            className="display-7 text-center text-lg-left"
            link={link}
            linkText={linkText}
            paragraphText={paragraphText}
            params={params}
            subTitleText={subTitleText}
            subSubTitleText={subSubTitleText}
          />
        </div>
      </div>
      <SpacerRow />
    </>
  );
};

export default HomeRow;
