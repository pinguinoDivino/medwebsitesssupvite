import TitleRow from "_atoms/TitleRow";
import { useState } from "react";
import ListActionsRow from "_organisms/ListActionsRow";
import ListContentRow from "_organisms/ListContentRow";
import Table from "_molecules/Table";
import ExperienceGraphsRow from "_molecules/ExperienceGraphsRow";

const Experiences = ({
  experiences,
  filters,
  isLoading,
  dispatch,
  searchName,
  searchVal,
  orderVal,
  searchInOptions,
  orderByOptions,
  getNewExperiences,
  hasNext,
  tableHeader,
  graphData,
}) => {
  const [areFiltersOpened, setAreFiltersOpened] = useState(false);

  const toggleFilters = () => {
    setAreFiltersOpened((prev) => !prev);
  };

  const hasExperiences = experiences && experiences.length > 0;

  return (
    <div className="container-fluid">
      <TitleRow title="Esperienze" className="text-left" />
      <ListActionsRow
        className="py-1"
        subtitle="Filtra e cerca"
        searchPlaceholder="Cerca fra le esperienze..."
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
        items={experiences}
        isLoading={isLoading}
        filters={filters}
        dispatch={dispatch}
        areFiltersOpened={areFiltersOpened}
        hasItems={hasExperiences}
        hasNext={hasNext}
        getNewItems={getNewExperiences}
        filterClickHandler={toggleFilters}
      >
        <Table data={experiences} keyID="id" header={tableHeader} />
      </ListContentRow>
      {!isLoading && hasExperiences && <ExperienceGraphsRow data={graphData} />}
    </div>
  );
};

export default Experiences;
