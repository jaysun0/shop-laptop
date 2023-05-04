import app from '../app';
import controller from '../controller';

// RESET FILTERS
const resetSearch = function () {
  app.searches.main.element.value = '';
  app.searches.main.value = '';
};

const resetFilters = function (filterName: string) {
  const filter = app.filters[filterName];
  Object.keys(filter).forEach((key: string) => {
    filter[key].status = true;
    filter[key].element.classList.add('checkboxes__box_active');
  });
};

const resetRanges = function (rangeName: string, values: [number, number]) {
  const range = app.ranges[rangeName];
  range.values = values;
  range.element.noUiSlider?.setHandle(0, values[0]);
  range.element.noUiSlider?.setHandle(1, values[1]);
};

const resetSoloCheckboxes = function () {
  Object.keys(app.soleCheckboxes).forEach((boxName) => {
    const currentBox = app.soleCheckboxes[boxName];

    if (boxName === 'popular') {
      currentBox.element.classList.remove('checkboxes__box_active');
      currentBox.status = false;
    } else {
      currentBox.element.classList.add('checkboxes__box_active');
      currentBox.status = true;
    }
  });
};

const fullReset = function () {
  resetRanges('year', [2014, 2022]);
  resetRanges('stock', [1, 10]);

  resetFilters('brand');
  resetFilters('color');
  resetFilters('size');
  resetSoloCheckboxes();
  resetSearch();

  controller.draw();
};

const resetBtn = document.querySelector('.search__controls_reset') as HTMLButtonElement;
resetBtn.addEventListener('click', fullReset);
