import { addToCart, findQuantityInCart } from '../cart/cart';
import { itemKeys, LaptopData } from '../../assets/goods';
import { translateCard } from '../translator';
import app from '../app';
function setCardCartCounter(id: number) {
  const card = document.querySelector(`#card-${id}`) as HTMLDivElement;
  const cartCounter = card.querySelector('.card__cart-counter') as HTMLParagraphElement;
  cartCounter.textContent = `${findQuantityInCart(id)}`;
}

function turnCartIcon(id: number, action: 'on' | 'off') {
  const card = document.querySelector(`#card-${id}`) as HTMLDivElement;
  if (card) {
    const iconWrapper = card.querySelector('.card__cart-icon-wrapper') as HTMLImageElement;
    if (action === 'on') iconWrapper.classList.remove('hidden');
    else iconWrapper.classList.add('hidden');
    setCardCartCounter(id);
  }
}

function createClone() {
  const template = document.querySelector('#item-card') as HTMLTemplateElement;
  const clone = template.content.cloneNode(true) as HTMLElement;
  app.language === 'ru' && translateCard(clone, 'ru');
  return [
    clone,
    {
      brand: clone.querySelector('.card__brand') as HTMLHeadingElement,
      model: clone.querySelector('.card__model') as HTMLParagraphElement,
      year: clone.querySelector('.card__feature_year') as HTMLSpanElement,
      stock: clone.querySelector('.card__feature_stock') as HTMLSpanElement,
      size: clone.querySelector('.card__feature_size') as HTMLSpanElement,
      color: clone.querySelector('.card__feature_color') as HTMLSpanElement,
      gaming: clone.querySelector('.card__feature_gaming') as HTMLSpanElement,
      popular: clone.querySelector('.card__feature_popular') as HTMLSpanElement,
    },
  ];
}

function appendCard(card: HTMLDivElement) {
  const goodsSection = document.querySelector('.goods');
  const element = card.querySelector('.card') as HTMLDivElement;
  element.id = card.id;
  goodsSection?.appendChild(card);
}

function setupCard(card: HTMLDivElement, itemData: LaptopData) {
  const img = card.querySelector('.card__img') as HTMLImageElement;
  const btnAddToCart = card.querySelector('.card__btn_add') as HTMLButtonElement;
  img.src = `https://github.com/jaysuno0/for-tasks/blob/main/laptops/${itemData.id}.jpg?raw=true`;
  card.id = `card-${itemData.id}`;

  btnAddToCart.addEventListener('click', () => {
    addToCart(itemData);
    turnCartIcon(itemData.id, 'on');
  });
  appendCard(card);
  const quantityInCart = findQuantityInCart(itemData.id);
  if (quantityInCart) turnCartIcon(itemData.id, 'on');
}

function createItemCard(itemData: LaptopData) {
  const [clone, itemElements] = createClone();

  //assign common props from incoming data-object to current card;
  Object.keys(itemElements).forEach((key) => {
    const currentElement = itemElements[key as keyof typeof itemElements] as HTMLElement;
    currentElement.textContent = itemData[key as itemKeys].toString();
  });

  setupCard(clone as HTMLDivElement, itemData);
}

export { createItemCard, turnCartIcon, setCardCartCounter };
