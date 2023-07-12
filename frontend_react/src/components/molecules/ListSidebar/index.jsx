import MultipleCheckbox from "_molecules/MultipleCheckbox";
import MultipleSearchCheckbox from "_molecules/MultipleSearchCheckbox";
import ToggleDownElement from "_atoms/ToggleDownElement";
import RadioInput from "_atoms/RadioInput";
import DateInput from "_atoms/DateInput";
import CounterInput from "_atoms/CounterInput";
import styles from "./index.module.css";
import TextButton from "_atoms/TextButton";

const ListSidebar = ({ id, className, filters, updateFilterHandler }) => {
  const inner = ({
    options,
    suffix,
    stateName,
    state,
    placeholder,
    type = "checkbox",
    keyValue,
  }) => {
    if (type === "checkbox") {
      return (
        <MultipleCheckbox
          options={options}
          state={state}
          changeStateHandler={(payload) => {
            updateFilterHandler({
              type: "FILTER",
              payload: { [stateName]: payload },
            });
          }}
          config={{ suffix: suffix, className: styles.sidebar__option }}
        />
      );
    }
    //TODO possibile problem with region and country. If italian region is selected the query is || with non italy-country
    if (type === "search-checkbox") {
      return (
        <MultipleSearchCheckbox
          options={options}
          state={state}
          changeStateHandler={(payload) => {
            updateFilterHandler({
              type: "FILTER",
              payload: { [stateName]: payload },
            });
          }}
          config={{ suffix: suffix, className: styles.sidebar__option }}
          placeholder="Cerca..."
          keyValue={keyValue}
        />
      );
    }
    if (type === "input-numeric") {
      return (
        <div className={styles.sidebar__option_input}>
          <label>{placeholder}</label>
          <CounterInput
            value={state}
            onChange={(payload) => {
              updateFilterHandler({
                type: "FILTER_SINGLE",
                payload: { [stateName]: payload },
              });
            }}
            config={{ max: 10, min: 0, id: { suffix } }}
          />
        </div>
      );
    }
    if (type === "input-radio") {
      return (
        <div className={styles.sidebar__option}>
          {options.map((option, index) => (
            <RadioInput
              key={index}
              value={option.value}
              label={option.label}
              className={styles.sidebar__option}
              isChecked={state === option.value}
              onChange={(payload) => {
                updateFilterHandler({
                  type: "FILTER_SINGLE",
                  payload: { [stateName]: payload },
                });
              }}
            />
          ))}
        </div>
      );
    }
    if (type === "input-date") {
      return (
        <div>
          <>
            {options.map((option, index) => (
              <DateInput
                key={index}
                label={option.label}
                value={state[index]}
                onChange={(payload) => {
                  updateFilterHandler({
                    type: "FILTER_SINGLE",
                    payload: { [stateName[index]]: payload },
                  });
                }}
              />
            ))}
            <TextButton
              mode="danger"
              className="small"
              onClick={() => {
                for (const idx in stateName) {
                  updateFilterHandler({
                    type: "FILTER_SINGLE",
                    payload: { [stateName[idx]]: null },
                  });
                }
              }}
            >
              Cancella
            </TextButton>
          </>
        </div>
      );
    }
    if (type === "input-multiple-numeric") {
      return (
        <div>
          {options.map((option, index) => (
            <div key={index}>
              <label className="small-1">{option.label}</label>
              <CounterInput
                value={state[index]}
                onChange={(payload) => {
                  const newState = state;
                  newState[index] = payload;
                  updateFilterHandler({
                    type: "FILTER_SINGLE",
                    payload: { [stateName]: newState },
                  });
                }}
                config={{ max: 10, min: 0, id: { suffix } }}
              />
            </div>
          ))}
        </div>
      );
    }
  };
  return (
    <div id={id} className={`${styles.sidebar} ${className}`}>
      {filters &&
        filters.map((filter, index) => (
          <ToggleDownElement
            key={index}
            name={<h3 className={styles.sidebar__h3}>{filter.name}</h3>}
            inner={inner({
              type: filter.type,
              options: filter.options,
              suffix: filter.name,
              stateName: filter.stateName,
              state: filter.state,
              placeholder: filter.placeholder,
              keyValue: filter.keyValue,
            })}
          />
        ))}
    </div>
  );
};

export default ListSidebar;
