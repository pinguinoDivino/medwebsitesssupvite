import LinkItem from "_atoms/Link";
import styles from "./index.module.css";

const HomeTextContainer = ({
  className,
  subTitleText,
  subSubTitleText,
  paragraphText,
  link,
  params,
  linkText,
}) => {
  return (
    <div className={`${styles["text-container"]} ${className}`}>
      <h2>{subTitleText}</h2>
      <h3>{subSubTitleText}</h3>
      <p>{paragraphText}</p>
      <LinkItem text={linkText} link={link} state={params} />
    </div>
  );
};

export default HomeTextContainer;
