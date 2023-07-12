import { useState } from "react";
import TitleRow from "_atoms/TitleRow";
import ListActionsRow from "_organisms/ListActionsRow";
import ListContentRow from "_organisms/ListContentRow";
import WardItem from "_molecules/WardItem";
import { removeDuplicates } from "_/common/utils";

const Internships = ({
  internships,
  filters,
  isLoading,
  dispatch,
  searchName,
  searchVal,
  orderVal,
  searchInOptions,
  orderByOptions,
  getNextInternships,
  hasNext,
}) => {
  const [areFiltersOpened, setAreFiltersOpened] = useState(false);

  const toggleFilters = () => {
    setAreFiltersOpened((prev) => !prev);
  };

  const displayWards = internships
    ? removeDuplicates(internships.map((item) => item.ward))
    : [];

  const hasInternships = internships && internships.length > 0;

  return (
    <div className="container-fluid">
      <TitleRow title="Tirocini Curriculari" className="text-left" />
      <ListActionsRow
        className="py-1"
        subtitle="Filtra e cerca"
        searchPlaceholder="Cerca fra i tirocini..."
        searchInOptions={searchInOptions}
        orderByOptions={orderByOptions}
        updateSearchOrder={dispatch}
        orderVal={orderVal}
        searchName={searchName}
        searchVal={searchVal}
        areFiltersOpened={areFiltersOpened}
        filterClickHandler={toggleFilters}
      />
      <ListContentRow
        items={internships}
        isLoading={isLoading}
        filters={filters}
        dispatch={dispatch}
        areFiltersOpened={areFiltersOpened}
        hasItems={hasInternships}
        hasNext={hasNext}
        getNewItems={getNextInternships}
        filterClickHandler={toggleFilters}
      >
        {displayWards.map((ward) => (
          <WardItem
            key={ward}
            ward={ward}
            items={internships.filter((item) => item.ward === ward)}
          />
        ))}
      </ListContentRow>
    </div>
  );
};

export default Internships;
