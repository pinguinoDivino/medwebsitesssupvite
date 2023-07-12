import TitleRow from "_atoms/TitleRow";
import SubTitle from "_atoms/SubTitle";
import SelectInput from "_atoms/SelectInput";
import styles from "./index.module.css";
import TextButton from "_atoms/TextButton";

const ActivityEditor = ({
  inputValue,
  onInputValueChange,
  options,
  onClickHandler,
}) => {
  return (
    <div className={`container-fluid ${styles["container-fluid"]}`}>
      <div className={`${styles.index}`}>
        <TitleRow title="Aggiungi un'attività!" />
        <SubTitle text="Cominciamo" />
        <label>Seleziona il tipo di attività</label>
        <SelectInput
          value={inputValue}
          onChange={onInputValueChange}
          options={options}
          className={styles.select}
        />
        <TextButton className="mt-1 mr-2" onClick={onClickHandler}>
          Avanti
        </TextButton>
      </div>
    </div>
  );
};

export default ActivityEditor;
