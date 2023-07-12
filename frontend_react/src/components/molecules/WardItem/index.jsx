import { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import InternshipItem from "_atoms/InternshipItem";
import TextButton from "_atoms/TextButton";
import styles from "./index.module.css";

const WardItem = ({ ward, items }) => {
  const [isShown, setIsShown] = useState(false);

  const toggleContent = () => {
    setIsShown((val) => !val);
  };
  return (
    <div className="mb-1">
      <div className={styles["ward-header"]} onClick={toggleContent}>
        <h3 className={styles.h3}>{ward}</h3>
      </div>
      {isShown && (
        <>
          <TransitionGroup className="fadein-animation">
            {items.map((item) => (
              <CSSTransition key={item.id} classNames="list-item" timeout={500}>
                <InternshipItem item={item} />
              </CSSTransition>
            ))}
          </TransitionGroup>
          <div className={styles["ward-footer"] + " pb-1"}>
            <TextButton type="button" onClick={toggleContent} mode="info">
              Chiudi
            </TextButton>
          </div>
        </>
      )}
    </div>
  );
};

export default WardItem;
