export const addTagBadgeClass = (tag) => {
  switch (tag.group) {
    case "city":
      return "badge-primary";
    case "opportunity":
      return "badge-secondary";
    case "prof":
      return "badge-success";
    case "institute":
      return "badge-danger";
    case "about":
      return "badge-info";
  }
};
