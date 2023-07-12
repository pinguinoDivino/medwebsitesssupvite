import styles from "./index.module.css";

const Tabs = ({ className, small, options, state, onClickHandler }) => {
  return (
    <div
      className={`${styles.tabs} ${small ? styles.small : ""} ${className} `}
    >
      {options.map((option) => {
        if (option.condition) {
          return (
            <div
              key={option.name}
              className={` ${state === option.name ? styles.active : ""} `}
            >
              <h2 onClick={onClickHandler.bind(this, option.name)}>
                {option.label}
              </h2>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Tabs;
