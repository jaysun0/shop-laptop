import controller from '../controller';
import app from '../app';
import { translateCartItem } from '../translator';

const cartElement = document.querySelector('.cart') as HTMLDivElement;
const itemsCounter = document.querySelector('.cart__counter-number') as HTMLSpanElement;
const cartItemsIds: number[] = [];

function openCart() {
  itemsCounter.textContent = `${cartItemsIds.length}`;
  cartElement.classList.remove('hidden');
  document.body.classList.add('stop-scrolling');
}

function closeCart() {
  cartElement.classList.add('hidden');
  document.body.classList.remove('stop-scrolling');
}

function addToCart(element: DocumentFragment) {
  const cartItemsContainer = document.querySelector('.cart__items') as HTMLDivElement;
  cartItemsContainer.append(element);
}

function changeItemQuantity(id: number, action: 'add' | 'remove') {
  const headerCartCount = document.querySelector('.header__cart-count') as HTMLParagraphElement;
  const cartItem = document.querySelector(`#cart-item-${id}`) as HTMLDivElement;
  const cartItemQuantity = cartItem.querySelector('.cart-item__quantity-number') as HTMLParagraphElement;
  let newItemQuantity = cartItemQuantity.textContent;
  if (action === 'add') {
    newItemQuantity = `${Number(cartItemQuantity.textContent) + 1}`;
    cartItemsIds.push(id);
  } else if (Number(cartItemQuantity.textContent) > 1) {
    newItemQuantity = `${Number(cartItemQuantity.textContent) - 1}`;
    const indexInCart = cartItemsIds.indexOf(id);
    cartItemsIds.splice(indexInCart, 1);
  }
  cartItemQuantity.textContent = newItemQuantity;
  headerCartCount.textContent = `${cartItemsIds.length}`;
  itemsCounter.textContent = `${cartItemsIds.length}`;
  localStorage.setItem(`cart-item-id${id}`, `${newItemQuantity}`);
  app.saveSettings();
}

function createCartElement(id: number, color: string, brand: string, model: string, year: number) {
  if (!cartItemsIds.includes(id)) {
    const cardItemTemplate = document.querySelector('.template__cart-item') as HTMLTemplateElement;
    const cartItem = document.importNode(cardItemTemplate.content, true);
    const cartItemImg = cartItem.querySelector('.cart-item__img') as HTMLImageElement;
    const cartItemColor = cartItem.querySelector('.cart-item__color') as HTMLParagraphElement;
    const cartItemBrand = cartItem.querySelector('.cart-item__brand') as HTMLParagraphElement;
    const cartItemModel = cartItem.querySelector('.cart-item__model') as HTMLParagraphElement;
    const cartItemYear = cartItem.querySelector('.cart-item__year') as HTMLParagraphElement;
    cartItemImg.src = `https://github.com/jaysuno0/for-tasks/blob/main/laptops/${id}.jpg?raw=true`;
    cartItemColor.textContent = color;
    cartItemBrand.textContent = brand;
    cartItemModel.textContent = model;
    cartItemYear.textContent = `${year}`;
    const cartItemBtnDelete = cartItem.querySelector('.cart-item__btn_delete') as HTMLButtonElement;
    cartItemBtnDelete.addEventListener('click', () => {
      controller.deleteItemFromCart(id);
      itemsCounter.textContent = `${cartItemsIds.length}`;
    });
    const cartItemBtnAdd = cartItem.querySelector('.cart-item__btn_add') as HTMLButtonElement;
    cartItemBtnAdd.addEventListener('click', () => changeItemQuantity(id, 'add'));
    const cartItemBtnRemove = cartItem.querySelector('.cart-item__btn_remove') as HTMLButtonElement;
    cartItemBtnRemove.addEventListener('click', () => changeItemQuantity(id, 'remove'));
    const cartItemElement = cartItem.querySelector('.cart__item') as HTMLDivElement;
    cartItemElement.id = `cart-item-${id}`;
    addToCart(cartItem);
    app.language === 'ru' && translateCartItem(document.querySelector(`#cart-item-${id}`) as Element);
  }
}

const cartIcon = document.querySelector('.header__link_cart') as HTMLAnchorElement;
cartIcon.addEventListener('click', openCart);

const cartBtnClose = document.querySelector('.cart__btn_close') as HTMLButtonElement;
cartBtnClose.addEventListener('click', closeCart);

export { cartItemsIds, createCartElement, changeItemQuantity };
