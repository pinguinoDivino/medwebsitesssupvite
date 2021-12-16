import useQuery from "./baseQueryLoading";

function useExpTags() {
  const { qs, hasQs, loadQs } = useQuery("experiences", "expTags");
  return { tags: qs, hasTags: hasQs, loadTags: loadQs };
}
function useOppTags() {
  const { qs, hasQs, loadQs } = useQuery("experiences", "oppTags");
  return { tags: qs, hasTags: hasQs, loadTags: loadQs };
}
function useTagColors(){
  function addTagBadgeClass(tag) {
      return {
        'badge-primary': tag.group === 'city',
        'badge-secondary': tag.group === 'opportunity',
        'badge-success': tag.group === 'prof',
        'badge-danger': tag.group === 'istitute',
        'badge-info': tag.group === 'about',
      };
    }
  return { addTagBadgeClass }
}

export {useExpTags, useOppTags, useTagColors};