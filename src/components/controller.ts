import { DoubleRange, doubleRangeValues } from './search/DoubleRange';
import SoleCheckbox from './search/SoleCheckbox';
import { Card } from './goods/goodsItem';
import Checkbox from './search/Checkbox';
import filters from './search/filters';
import Search from './search/Search';
import Select from './search/Select';
import data from '../assets/goods';
import app from './app';
import { showMessage } from './message/message';

const controller = {
  data: [...data],

  sortData() {
    switch (app.selects.sort.value) {
      case 'alphabet-hl':
        this.data.sort((currentItem, nextItem) => {
          let result = 1;
          if (currentItem.brand.toLowerCase() > nextItem.brand.toLowerCase()) result = -1;
          return result;
        });
        break;

      case 'year-hl':
        this.data.sort((currentItem, nextItem) => nextItem.year - currentItem.year);
        break;

      case 'year-lh':
        this.data.sort((currentItem, nextItem) => currentItem.year - nextItem.year);
        break;

      case 'stock-hl':
        this.data.sort((currentItem, nextItem) => nextItem.stock - currentItem.stock);
        break;

      case 'stock-lh':
        this.data.sort((currentItem, nextItem) => currentItem.stock - nextItem.stock);
        break;

      default:
        this.data.sort((currentItem, nextItem) => {
          let result = 1;
          if (currentItem.brand.toLowerCase() < nextItem.brand.toLowerCase()) result = -1;
          return result;
        });
    }
  },

  createSearch(elementName: string) {
    const input = document.querySelector(`.search_${elementName}`) as HTMLInputElement;
    new Search(input, elementName);
    if (elementName === 'main') input.focus();
  },

  createSelect(elementName: string) {
    const select = document.querySelector(`.select_${elementName}`) as HTMLSelectElement;
    new Select(select, elementName);
  },

  createRange(name: string, range: doubleRangeValues) {
    const div = document.querySelector(`.search__range_${name}`) as HTMLDivElement;
    const min = document.querySelector(`.search__${name}_min`) as HTMLParagraphElement;
    const max = document.querySelector(`.search__${name}_max`) as HTMLParagraphElement;
    app.ranges[name] = new DoubleRange(div, range, [min, max]);
  },

  createFilter(name: string) {
    const container = document.querySelector(`.search__${name}`) as HTMLDivElement;
    const wrappers = [...container.querySelectorAll('.checkboxes__item')];
    const checkboxes = [...container.querySelectorAll('.checkboxes__box')];

    app.filters[name] = {};

    checkboxes.forEach((box, ind) => {
      new Checkbox(name, wrappers[ind], box);
    });
  },

  createSoleCheckbox(name: string) {
    new SoleCheckbox(name);
  },

  checkMatches() {
    console.log('check matches');
    if (!app.elements.goods.textContent) {
      if (app.elements.mainMessage) app.elements.goods.append(app.elements.mainMessage);
      else showMessage('no-matches');
    }
  },

  checkCart(id: number) {
    let result = false;
    const idValue = localStorage.getItem(`cart-item-id${id}`);

    if (idValue) {
      if (!app.cartItems.includes(id)) app.cartItems.push(id);
      const cartCountElement = document.querySelector('.cart__count') as HTMLParagraphElement;
      cartCountElement.textContent = `${app.cartItems.length}`;
      result = true;
    }

    return result;
  },

  draw() {
    app.elements.goods.textContent = '';
    app.currentMessageType = null;
    controller.sortData();

    controller.data.forEach((item) => {
      let result = true;

      if (!filters.search(item, 'main')) result = false;
      if (!filters.stock(item, app.ranges.stock.values)) result = false;
      if (!filters.year(item, app.ranges.year.values)) result = false;
      if (!filters.checkbox(item, 'brand')) result = false;
      if (!filters.checkbox(item, 'color')) result = false;
      if (!filters.checkbox(item, 'size')) result = false;
      if (!filters.soleCheckbox(item, 'gaming', false)) result = false;
      if (!filters.soleCheckbox(item, 'popular', true)) result = false;
      const inCart = controller.checkCart(item.id);

      if (result) {
        const card = new Card(item);

        if (inCart) {
          const cartIcon = card.element.querySelector('.goods__card_in-cart') as HTMLDivElement;
          card.inCart = true;
          cartIcon.style.display = 'block';
        }
      }
    });
    controller.checkMatches();
  },
};

export default controller;
