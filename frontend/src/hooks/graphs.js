import { renameObjProperty } from "./baseFunctions";
import { ref } from "vue";

export default function useGraphs() {
  function renameSDGs(obj) {
    for (const key of Object.keys(obj)) {
      let new_key;
      switch (parseInt(key)) {
        case 1:
          new_key = "No poverty";
          break;
        case 2:
          new_key = "Zero Hunger";
          break;
        case 3:
          new_key = "Good Health And Well-Being";
          break;
        case 4:
          new_key = "Quality Education";
          break;
        case 5:
          new_key = "Gender Equality";
          break;
        case 6:
          new_key = "Clean Water And Sanitation";
          break;
        case 7:
          new_key = "Affordable And Clean Energy";
          break;
        case 8:
          new_key = "Decent Work And Economic Growth";
          break;
        case 9:
          new_key = "Industry, Innovation And Infrastructure";
          break;
        case 10:
          new_key = "Reduced Inequalities";
          break;
        case 11:
          new_key = "Substainable Cities And Communities";
          break;
        case 12:
          new_key = "Responsible Consumption And Production";
          break;
        case 13:
          new_key = "Climate Action";
          break;
        case 14:
          new_key = "Life Below Water";
          break;
        case 15:
          new_key = "Life on Land";
          break;
        case 16:
          new_key = "Peace, Justice And Strong Istitutions";
          break;
        case 17:
          new_key = "Partenships For Goals";
          break;
      }
      renameObjProperty(obj, key, new_key);
    }
  }
  const baseSDGColors = [
    "#EE3237",
    "#D5A224",
    "#249D46",
    "#C51930",
    "#F03D27",
    "#01AFDB",
    "#FDB80D",
    "#901235",
    "#F46E1F",
    "#E20D85",
    "#F99E20",
    "#D08F26",
    "#46783C",
    "#017EBD",
    "#3BB247",
    "#00548C",
    "#123268"
  ];
  const sdgColors = ref();
  return { baseSDGColors, renameSDGs, sdgColors };
}
