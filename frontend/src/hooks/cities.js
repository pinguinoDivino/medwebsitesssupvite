import useQuery from "./baseQueryLoading";

export default function useCities() {
  const { qs, hasQs, loadQs } = useQuery("experiences", "cities");
  return { cities: qs, hasCities: hasQs, loadCities: loadQs };
}