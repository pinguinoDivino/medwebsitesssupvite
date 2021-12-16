function removeItemOnce(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeItemAll(arr, value) {
  let i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function moveObjFromList1ToList2(value, property, list1, list2) {
  for (const item of list1) {
    if (item[property] === value) {
      const idx = list1.indexOf(item);
      list1.slice(idx, 1);
      list2.push(item);
    }
  }
}

function setPropOfObjInList(list, property, value, selectProp, selectValue) {
  for (const item of list) {
    if (item[selectProp] === selectValue) {
      item[property] = value;
    }
  }
}

function sortNestedArrayByObjectProperty(arr, property) {
  for (const item of arr) {
    item.sort(function(a, b) {
      if (a[property] < b[property]) {
        return 1;
      }
      if (a[property] > b[property]) {
        return -1;
      }
      return 0;
    });
  }
}

function removeDuplicatesFromNestedArray(arr) {
  const stringArray = [...new Set(arr)].map(JSON.stringify);
  const uniqueStringArray = new Set(stringArray);
  return Array.from(uniqueStringArray, JSON.parse);
}

function getElementFromNestedArrayByIndex(arr, idx, noDuplicates = true) {
  let list = [];
  for (const nestedItem of arr) {
    list.push(nestedItem[idx]);
  }
  if (noDuplicates) {
    return [...new Set(list)];
  }
  return list;
}

function moveArrayIntoProperty(arr1, arr2, property, elPosition) {
  for (const item1 of arr1) {
    for (const idx2 in arr2) {
      if (item1 === arr2[idx2][elPosition]) {
        item1[property] = [];
        for (const nestedItem of arr2[idx2]) {
          if (nestedItem !== item1) {
            item1[property].push(nestedItem);
          }
        }
      }
    }
  }
}

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};
function renameObjProperty(o, old_key, new_key) {
  if (old_key !== new_key) {
    Object.defineProperty(
      o,
      new_key,
      Object.getOwnPropertyDescriptor(o, old_key)
    );
    delete o[old_key];
  }
}
function getProp(obj, propName) {
  const parts = propName.split(".");

  for (let i = 0; i < parts.length; i++) {
    obj = obj[parts[i]];
  }
  return obj;
}

export {
  removeItemOnce,
  removeItemAll,
  removeDuplicatesFromNestedArray,
  getElementFromNestedArrayByIndex,
  moveArrayIntoProperty,
  capitalize,
  sortNestedArrayByObjectProperty,
  getProp,
  moveObjFromList1ToList2,
  setPropOfObjInList,
  renameObjProperty
};
