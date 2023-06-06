import app from '../app';
import { cartItemsIds, createCartElement } from '../cart/cart';
import controller from '../controller';
import {translateCard} from "../translator";

type itemKeys = 'brand' | 'model' | 'year' | 'stock' | 'color' | 'size' | 'gaming' | 'popular';

interface LaptopData {
  id: number;
  brand: string;
  model: string;
  stock: number;
  year: number;
  color: string;
  size: string;
  gaming: string;
  popular: string;
}

function removeFromCart(id: number) {
  const cartCountElement = document.querySelector('.header__cart-count') as HTMLParagraphElement;
  const indexInCart = cartItemsIds.indexOf(id);
  const card = document.querySelector(`#good-card-${id}`) as HTMLDivElement;
  cartItemsIds.splice(indexInCart, 1);
  if (card) {
    const cartIcon = card.querySelector('.goods__icon_in-cart') as HTMLDivElement;
    cartIcon.style.display = 'none';
  }
  cartCountElement.textContent = `${cartItemsIds.length}`;
  localStorage.removeItem(`cart-item-id${id}`);
  if (app.elements.mainMessage) app.elements.mainMessage.remove();
  app.saveSettings();
}

class Card {
  readonly #itemData: LaptopData;
  element: HTMLDivElement;
  constructor(itemData: LaptopData) {
    this.#itemData = itemData;

    const [clone, itemElements] = this.#createClone();
    itemData = this.#itemData;

    //assign common props from incoming data-object to current card;
    Object.keys(itemElements).forEach((key) => {
      const currentElement = itemElements[key as keyof typeof itemElements] as HTMLElement;
      currentElement.textContent = itemData[key as itemKeys].toString();
    });

    const goodsSection = document.querySelector('.goods');
    const card = (clone as HTMLElement).querySelector('.goods__card') as HTMLDivElement;
    const img = (clone as HTMLElement).querySelector('.goods__card-img') as HTMLImageElement;

    card.id = `good-card-${this.#itemData.id}`;
    card.addEventListener('click', () => {
      if (cartItemsIds.includes(this.#itemData.id)) controller.deleteItemFromCart(this.#itemData.id);
      else this.addToCart();
    });

    img.src = `https://github.com/jaysuno0/for-tasks/blob/main/laptops/${this.#itemData.id}.jpg?raw=true`;
    goodsSection?.appendChild(card);
    this.element = card;
    app.language === 'ru' && translateCard(card);
  }

  #createClone() {
    const template = document.querySelector('#goods-item') as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as HTMLElement;
    return [
      clone,
      {
        brand: clone.querySelector('.goods__brand') as HTMLHeadingElement,
        model: clone.querySelector('.goods__model') as HTMLParagraphElement,
        year: clone.querySelector('.goods__feature_year') as HTMLSpanElement,
        stock: clone.querySelector('.goods__feature_stock') as HTMLSpanElement,
        size: clone.querySelector('.goods__feature_size') as HTMLSpanElement,
        color: clone.querySelector('.goods__feature_color') as HTMLSpanElement,
        gaming: clone.querySelector('.goods__feature_gaming') as HTMLSpanElement,
        popular: clone.querySelector('.goods__feature_popular') as HTMLSpanElement,
      },
    ];
  }

  addToCart() {
    const cartIcon = this.element.querySelector('.goods__icon_in-cart') as HTMLDivElement;
    const cartCountElement = document.querySelector('.header__cart-count') as HTMLParagraphElement;
    cartIcon.style.display = 'block';
    createCartElement(
      this.#itemData.id,
      this.#itemData.color,
      this.#itemData.brand,
      this.#itemData.model,
      this.#itemData.year
    );
    cartItemsIds.push(this.#itemData.id);
    cartCountElement.textContent = `${cartItemsIds.length}`;
    app.saveSettings();
  }
}

export { LaptopData, Card, itemKeys, removeFromCart };
