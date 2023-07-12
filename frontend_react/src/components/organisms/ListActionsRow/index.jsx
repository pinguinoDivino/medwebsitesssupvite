import SearchInput from "_molecules/SearchInput";
import FilterButton from "_molecules/FilterButton";
import SelectInput from "_atoms/SelectInput";

const ListActionsRow = ({
  subtitle,
  className,
  searchPlaceholder,
  searchInOptions,
  orderByOptions,
  filterClickHandler,
  updateSearchOrder,
  searchName,
  searchVal,
  orderVal,
  areFiltersOpened,
}) => {
  const orderChangeHandler = (value) => {
    updateSearchOrder({ type: "ORDERING", payload: value });
  };

  const searchValChangeHandler = (e) => {
    if (searchName !== "" && searchName !== null) {
      updateSearchOrder({
        type: "SEARCHING",
        payload: { val: e.target.value },
      });
    }
  };

  const searchNameChangeHandler = (valueName) => {
    if (!valueName) {
      updateSearchOrder({
        type: "SEARCHING",
        payload: { val: "" },
      });
    }
    updateSearchOrder({ type: "SEARCHING", payload: { name: valueName } });
  };

  return (
    <div className={`row ${className}`}>
      <div className="col-12 text-left">
        <div className="row">
          <div className="col-12">
            <h2>{subtitle}</h2>
          </div>
        </div>
        <div className="row form-group">
          <SearchInput
            onChange={searchValChangeHandler}
            value={searchVal}
            placeholder={searchPlaceholder}
            className="col-8 col-md-6 col-lg-8"
            config={{ autoFocus: true }}
          />
          <SelectInput
            onChange={searchNameChangeHandler}
            value={searchName}
            options={searchInOptions}
            className={"col-4 col-md-3 col-lg-2"}
          />
          <SelectInput
            onChange={orderChangeHandler}
            value={orderVal}
            options={orderByOptions}
            className="col-5 col-md-3 col-lg-2 my-sm-1"
          />
        </div>
        <div className="row form-group my-1">
          <FilterButton
            className="col-12"
            onClick={filterClickHandler}
            isClicked={areFiltersOpened}
          />
        </div>
      </div>
    </div>
  );
};
export default ListActionsRow;
