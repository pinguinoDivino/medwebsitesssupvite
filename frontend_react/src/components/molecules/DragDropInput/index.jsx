import { useState } from "react";
import { capitalize } from "_/common/utils";
import SearchInput from "_molecules/SearchInput";
import Badge from "_atoms/Badge";
import TextButton from "_atoms/TextButton";
import styles from "./index.module.css";

const defaultIncrement = 20;

const DragDropInput = ({
  onChange,
  value,
  onRemove,
  items,
  fieldKey,
  countKey,
  searchKey,
  className,
  label,
  max,
  increment,
  badgeClassFn,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [itemShowMaximum, setItemShowMaximum] = useState(max ? max : 20);

  const onClickHandler = () => {
    setItemShowMaximum(
      (prev) => prev + (increment ? increment : defaultIncrement)
    );
  };

  const selectedItems = items.filter((item) => value.includes(item[fieldKey]));
  const notSelectedItems = items.filter((item) => {
    const mask = !value.includes(item[fieldKey]);
    return inputValue ? mask && item[searchKey].includes(inputValue) : mask;
  });

  const onSearchInputChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const onDragStart = (evt, item) => {
    evt.dataTransfer.dropEffect = "move";
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("itemKeyField", item[fieldKey]);
  };

  const onDrop = (evt, list) => {
    const itemKeyField = evt.dataTransfer.getData("itemKeyField");
    if (list === 0) {
      onChange(itemKeyField);
    } else if (list === 1) {
      onRemove(itemKeyField);
    }
  };

  const preventEvent = (evt) => {
    evt.preventDefault();
  };

  return (
    <div className={className}>
      <div className="row mb-1">
        <SearchInput
          onChange={onSearchInputChangeHandler}
          value={inputValue}
          className="col-6"
          placeholder={"Cerca fra i " + label}
        />
      </div>
      <h4>{capitalize(label)} disponibili</h4>
      <h5>Sposta i {label} per selezionarli!</h5>
      <div
        className={styles["drop-zone"] + " my-1"}
        onDrop={(event) => onDrop(event, 1)}
        onDragOver={preventEvent}
        onDragEnter={preventEvent}
      >
        {notSelectedItems.length > 0 &&
          notSelectedItems.slice(0, itemShowMaximum).map((item) => (
            <Badge
              config={{
                onClick: onChange.bind(this, item[fieldKey]),
                onDragStart: (event) => onDragStart(event, item),
                draggable: true,
              }}
              badgeClass={badgeClassFn(item)}
              className={styles.item}
              key={item[fieldKey]}
              name={item[searchKey]}
              count={item[countKey]}
            />
          ))}
        {notSelectedItems.length > itemShowMaximum && (
          <TextButton
            mode="info"
            className="small my-1"
            onClick={onClickHandler}
          >
            Mostra ancora
          </TextButton>
        )}
        {notSelectedItems.length === 0 && (
          <span className="not-found">Non sono stati trovati {label}</span>
        )}
      </div>
      <h4>{capitalize(label)} selezionati</h4>
      <div
        className={styles["drop-zone"] + " my-1"}
        onDrop={(event) => onDrop(event, 0)}
        onDragOver={preventEvent}
        onDragEnter={preventEvent}
      >
        {selectedItems.length > 0 &&
          selectedItems.map((item) => (
            <Badge
              badgeClass={badgeClassFn(item)}
              className={styles.item}
              key={item[fieldKey]}
              name={item[searchKey]}
              count={item[countKey]}
              config={{
                onClick: onRemove.bind(this, item[fieldKey]),
                onDragStart: (event) => onDragStart(event, item),
                draggable: true,
              }}
            />
          ))}
        {selectedItems.length === 0 && (
          <span className="not-found">Non sono stati selezionati {label}</span>
        )}
      </div>
    </div>
  );
};

export default DragDropInput;
