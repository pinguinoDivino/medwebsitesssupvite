import { useLoaderData } from "react-router-dom";
import {
  getInternshipPlaces,
  getInternshipYears,
  getInternshipAttendances,
} from "_services/choices";
import useQs from "_hooks/use-qs";
import Internships from "_templates/Internships";

const initialState = {
  recommendedYears: [],
  places: [],
  attendances: [],
  ratingMin: 0,
};

const searchInOptions = [
  { value: "", label: "Disattiva" },
  { value: "__all__", label: "Tutti" },
  { value: "author__user__first_name", label: "Nome autore" },
  { value: "author__user__last_name", label: "Cognome autore" },
  { value: "review", label: "Descrizione" },
];

const orderByOptions = [
  { value: "academic_year", label: "Anno svolto" },
  { value: "-academic_year", label: "Anno svolto (-)" },
  { value: "recommended_year", label: "Anno consigliato" },
  { value: "-recommended_year", label: "Anno consigliato (-)" },
  { value: "created_at", label: "Data creazione" },
  { value: "-created_at", label: "Data creazione (-)" },
];

const InternshipsPage = () => {
  const loaderData = useLoaderData();

  const {
    querySet: internships,
    isLoading,
    error,
    errorModal,
    filtersState,
    searchName,
    searchVal,
    orderVal,
    dispatchQsParamsState: dispatchParams,
    hasNext,
    getNextQs: getNextInternships,
  } = useQs("/api/unipi-internships/", initialState);

  const filters = [
    {
      name: "Luogo",
      options: loaderData.places,
      stateName: "places",
      state: filtersState.places,
    },
    {
      name: "Presenze",
      options: loaderData.attendances,
      stateName: "attendances",
      state: filtersState.attendances,
    },
    {
      name: "Anno consigliato",
      options: loaderData.years,
      stateName: "recommendedYears",
      state: filtersState.recommendedYears,
    },
    {
      name: "Valutazione",
      placeholder: "A partire da",
      stateName: "ratingMin",
      state: filtersState.ratingMin,
      type: "input-numeric",
    },
  ];

  return (
    <>
      <Internships
        internships={internships}
        filters={filters}
        searchName={searchName}
        searchVal={searchVal}
        orderVal={orderVal}
        searchInOptions={searchInOptions}
        orderByOptions={orderByOptions}
        dispatch={dispatchParams}
        hasNext={hasNext}
        getNextInternships={getNextInternships}
        isLoading={isLoading}
      />
      {error && errorModal}
    </>
  );
};

export default InternshipsPage;

export const loader = async () => {
  const years = await getInternshipYears();
  const places = await getInternshipPlaces();
  const attendances = await getInternshipAttendances();

  document.title = "Lista dei Tirocini Curriculari";
  return { years, places, attendances };
};
