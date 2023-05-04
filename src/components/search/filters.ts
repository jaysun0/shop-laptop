import app from '../app';
import { LaptopData, itemKeys } from '../goods/goodsItem';
import { doubleRangeValues } from './DoubleRange';

enum rangeValues {
  min,
  max,
}

const filters = {
  search(item: LaptopData, searchName: string) {
    const itemInfo = item.brand.concat(item.model).toLowerCase();
    let result = false;
    let inputValue = app.searches[searchName].value.toLowerCase();

    if (inputValue.includes(' ')) inputValue = inputValue.split(' ').join('');
    if (itemInfo.includes(inputValue)) result = true;

    return result;
  },

  stock(item: LaptopData, values: doubleRangeValues) {
    const min = values[rangeValues.min];
    const max = values[rangeValues.max];
    let result = true;

    if (item.stock < min || item.stock > max) result = false;
    return result;
  },

  year(item: LaptopData, values: doubleRangeValues) {
    const min = values[rangeValues.min];
    const max = values[rangeValues.max];
    let result = true;

    if (item.year < min || item.year > max) result = false;
    return result;
  },

  checkbox(item: LaptopData, filterName: itemKeys) {
    let result = false;
    const filterValue = item[filterName].toString().toLowerCase();
    if (app.filters[filterName][filterValue].status) result = true;
    return result;
  },

  soleCheckbox(item: LaptopData, checkboxName: itemKeys, isFilter: boolean) {
    let result = false;

    if (isFilter) {
      if (!app.soleCheckboxes[checkboxName].status) result = true;
      else if (app.soleCheckboxes[checkboxName].status && item[checkboxName] === 'yes') result = true;
    } else {
      if (app.soleCheckboxes[checkboxName].status) result = true;
      else if (!app.soleCheckboxes[checkboxName].status && item[checkboxName] === 'no') result = true;
    }

    return result;
  },
};

export default filters;