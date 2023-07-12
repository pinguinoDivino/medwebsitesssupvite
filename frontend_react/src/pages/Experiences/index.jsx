import { useLoaderData, useLocation } from "react-router-dom";
import {
  getCountries,
  getRegions,
  getTags,
  getExperienceTypes,
} from "_services/choices";
import useQs from "_hooks/use-qs";
import { getExperienceGraphData } from "_services/activities";
import Experiences from "_templates/Experiences";
import LinkItem from "_atoms/Link";

const initialState = {
  status: null,
  typologies: null,
  start_date_min: null,
  start_date_max: null,
  countries: [],
  regions: [],
  tags: [],
  rating_min: [0, 0, 0, 0],
};

const searchInOptions = [
  { value: "", label: "Disattiva" },
  { value: "__all__", label: "Tutti" },
  { value: "author__user__first_name", label: "Nome autore" },
  { value: "author__user__last_name", label: "Cognome autore" },
  { value: "description", label: "Descrizione" },
  { value: "review", label: "Recensione" },
  { value: "indications", label: "Indicazioni" },
  { value: "tags__name", label: "Parole chiave" },
  { value: "review", label: "Descrizione" },
];

const orderByOptions = [
  { value: "started_at", label: "Data di inizio" },
  { value: "-started_at", label: "Data di inizio (-)" },
  { value: "ended_at", label: "Data di fine" },
  { value: "-ended_at", label: "Data di fine (-)" },
  { value: "created_at", label: "Data creazione" },
  { value: "-created_at", label: "Data creazione (-)" },
];

const ExperiencesPage = () => {
  const loaderData = useLoaderData();
  const location = useLocation();

  const {
    querySet: experiences,
    isLoading,
    error,
    errorModal,
    filtersState,
    searchName,
    searchVal,
    orderVal,
    dispatchQsParamsState: dispatchParams,
    hasNext,
    getNextQs: getNextExperiences,
  } = useQs("/api/experiences/", {
    ...initialState,
    typologies: [location.state?.exp],
  });

  const filters = [
    {
      name: "Status",
      stateName: "status",
      options: [
        { label: "In corso", value: "on" },
        { label: "Conclusa", value: "off" },
        { label: "Rimuovi", value: null },
      ],
      state: filtersState.status,
      type: "input-radio",
    },
    {
      name: "Tipologia",
      options: loaderData.types,
      stateName: "typologies",
      state: filtersState.typologies,
    },
    {
      name: "Data di inizio",
      options: [{ label: "Da" }, { label: "A" }],
      stateName: ["start_date_min", "start_date_max"],
      state: [filtersState.start_date_min, filtersState.start_date_max],
      type: "input-date",
    },
    {
      name: "Valutazioni",
      options: [
        { label: "Globale da" },
        { label: "Istituzionale da" },
        { label: "Conoscenza da" },
        { label: "Coinvolgimento da" },
      ],
      stateName: "rating_min",
      state: filtersState.rating_min,
      type: "input-multiple-numeric",
    },
    {
      name: "Stato",
      options: loaderData.countries,
      stateName: "countries",
      state: filtersState.countries,
      type: "search-checkbox",
    },
    {
      name: "Regioni",
      options: loaderData.regions,
      stateName: "regions",
      state: filtersState.regions,
    },
    {
      name: "Tags",
      options: loaderData.tags,
      stateName: "tags",
      state: filtersState.tags,
      type: "search-checkbox",
      keyValue: "name",
    },
  ];

  const tableHeader = [
    {
      value: "description",
      label: "Descrizione",
      func: (val, item) => {
        return <LinkItem link={`${item.slug}`} text={val} />;
      },
    },
    { value: "author", label: "Autore" },
    {
      value: "type",
      label: "Tipologia",
    },
    { value: "started_at", label: "Data di inizio" },
    { value: "ended_at", label: "Data di fine" },
    { value: "city", nestedValue: "city", label: "Città" },
    { value: "rating", nestedValue: "average", label: "Valutazione media" },
  ];

  return (
    <>
      <Experiences
        graphData={loaderData.graphData}
        experiences={experiences}
        filters={filters}
        isLoading={isLoading}
        orderByOptions={orderByOptions}
        searchInOptions={searchInOptions}
        searchName={searchName}
        searchVal={searchVal}
        orderVal={orderVal}
        dispatch={dispatchParams}
        hasNext={hasNext}
        getNewExperiences={getNextExperiences}
        tableHeader={tableHeader}
      />
      {error && errorModal}
    </>
  );
};

export default ExperiencesPage;

export const loader = async () => {
  const types = await getExperienceTypes();
  const countries = await getCountries();
  const regions = await getRegions();
  const tags = await getTags("experience");
  const graphData = await getExperienceGraphData();

  document.title = "Lista delle Esperienze";
  return { types, countries, regions, tags, graphData };
};
