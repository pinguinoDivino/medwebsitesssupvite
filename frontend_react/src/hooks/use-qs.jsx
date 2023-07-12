import { useReducer, useEffect, useState, useCallback } from "react";
import useDebounce from "_hooks/use-debounce";
import { getActivities } from "_services/activities";
import Modal from "_atoms/Modal";

const qsParamsReducer = (state, action) => {
  switch (action.type) {
    case "ORDERING":
      return { ...state, ordering: action.payload };
    case "SEARCHING": {
      return { ...state, searching: { ...state.searching, ...action.payload } };
    }
    case "FILTER": {
      const mainKey = Object.keys(action.payload)[0];
      const newVal = Object.values(action.payload)[0];
      const newValKey = Object.keys(newVal)[0];
      let stateMainKey = state.filters[mainKey];
      if (stateMainKey.includes(newValKey) && !newVal[newValKey]) {
        stateMainKey = stateMainKey.filter((item) => item !== newValKey);
      }
      if (!stateMainKey.includes(newValKey) && newVal[newValKey]) {
        stateMainKey.push(newValKey);
      }
      return {
        ...state,
        filters: { ...state.filters, [mainKey]: stateMainKey },
      };
    }
    case "FILTER_SINGLE": {
      const mainKey = Object.keys(action.payload)[0];
      const newVal = Object.values(action.payload)[0] || null;
      return {
        ...state,
        filters: { ...state.filters, [mainKey]: newVal },
      };
    }
  }
  return state;
};

const useQs = (baseEndpoint, initialFiltersValues) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [querySet, setQuerySet] = useState(null);
  const [next, setNext] = useState("");
  const [qsParamsState, dispatchQsParamsState] = useReducer(
    qsParamsReducer,
    {
      filters: initialFiltersValues,
      ordering: null,
      searching: { name: "", val: "" },
    },
    undefined
  );

  const debounce = useDebounce(qsParamsState, 300);

  const getEndpoint = useCallback(
    (base) => {
      let endpoint = base;
      if (qsParamsState.ordering) {
        endpoint += `${endpoint.includes("/?") ? "&" : "?"}ordering=${
          qsParamsState.ordering
        }`;
      }
      if (qsParamsState.searching.val) {
        endpoint += `${endpoint.includes("/?") ? "&" : "?"}search=${
          qsParamsState.searching.val
        }&search_fields=${qsParamsState.searching.name}`;
      }
      return endpoint;
    },
    [qsParamsState.ordering, qsParamsState.searching]
  );

  useEffect(() => {
    setIsLoading(true);
    const endpoint = getEndpoint(baseEndpoint);

    const getData = async () => {
      try {
        const { results, next } = await getActivities(endpoint, {
          ...qsParamsState.filters,
        });
        setQuerySet(results);
        setNext(next);
      } catch (e) {
        setError(e);
      }
    };
    getData().then(() => setIsLoading(false));
  }, [debounce]);

  const getNextQs = useCallback(async () => {
    setIsLoading(true);
    if (next) {
      const endpoint = getEndpoint(next);
      try {
        const { results, next } = await getActivities(endpoint, {
          ...qsParamsState.filters,
        });
        setQuerySet((prev) => prev.concat(results));
        setNext(next);
      } catch (e) {
        setError(e);
      }
    }
    setIsLoading(false);
  }, [qsParamsState.filters, next]);

  const hasNext = !!next;

  const getErrorText = () => {
    if (error.status) {
      switch (error.status) {
        case 404:
          return "Non trovato. Riprova tra qualche momento!";
        case 500:
          return "Errore nell'elaborazione della richiesta. Contatta un amministratore!";
        default:
          return error.data;
      }
    }
    return error.toString();
  };

  const errorModal = error && (
    <Modal onClose={() => setError(null)} title="Errore nel caricamento dati">
      <div className="p-1">
        <h3>Errore {error?.status}</h3>
        <p className="bold">{getErrorText()}</p>
      </div>
    </Modal>
  );

  return {
    isLoading,
    error,
    errorModal,
    querySet,
    filtersState: qsParamsState.filters,
    searchName: qsParamsState.searching.name,
    searchVal: qsParamsState.searching.val,
    orderVal: qsParamsState.ordering,
    dispatchQsParamsState,
    hasNext,
    getNextQs,
  };
};
export default useQs;
