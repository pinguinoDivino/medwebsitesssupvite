import useQuery from "./baseQueryLoading";

export default function useUniversities() {
  const { qs, hasQs, loadQs } = useQuery("experiences", "universities");
  return { universities: qs, hasUniversities: hasQs, loadUniversities: loadQs };
}