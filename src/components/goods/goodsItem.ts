import app from '../app';
import { addToCart, findQuantity } from '../cart/cart';
import { itemKeys, LaptopData } from '../../assets/goods';
import { translateCard } from '../translator';

function turnOnCartIcon(id: number) {
  const card = document.querySelector(`#good-card-${id}`) as HTMLDivElement;
  const icon = card.querySelector('.goods__icon_in-cart') as HTMLImageElement;
  icon.classList.remove('hidden');
}

class Card {
  readonly #itemData: LaptopData;
  element: HTMLDivElement;
  constructor(itemData: LaptopData) {
    this.#itemData = itemData;
    const [clone, itemElements] = this.#createClone();
    const id = this.#itemData.id;

    //assign common props from incoming data-object to current card;
    Object.keys(itemElements).forEach((key) => {
      const currentElement = itemElements[key as keyof typeof itemElements] as HTMLElement;
      currentElement.textContent = itemData[key as itemKeys].toString();
    });

    const goodsSection = document.querySelector('.goods');
    const card = (clone as HTMLElement).querySelector('.goods__card') as HTMLDivElement;
    const img = card.querySelector('.goods__card-img') as HTMLImageElement;

    card.id = `good-card-${id}`;
    img.src = `https://github.com/jaysuno0/for-tasks/blob/main/laptops/${id}.jpg?raw=true`;
    goodsSection?.appendChild(card);
    this.element = card;
    app.language === 'ru' && translateCard(card);
    const btnAddToCart = card.querySelector('.goods__btn_add') as HTMLButtonElement;
    btnAddToCart.addEventListener('click', () => {
      turnOnCartIcon(id);
      addToCart(this.#itemData);
    });
    if (findQuantity(id)) turnOnCartIcon(id);
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
}

export default Card;
export { turnOnCartIcon };
