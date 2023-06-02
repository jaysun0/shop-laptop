import app from '../app';

type Message = 'no-matches';

function createMessage(templateId: string, message: string, remove: boolean) {
  if (!app.isThereMessage) {
    const template = document.querySelector(`#${templateId}`) as HTMLTemplateElement;
    const clone = template.content.cloneNode(true) as HTMLDivElement;
    const messageContainer = clone.querySelector(`.message__container`) as HTMLDivElement;
    const messageElement = clone.querySelector(`.message__text`) as HTMLParagraphElement;
    const messageTitle = clone.querySelector('.message__title') as HTMLParagraphElement;

    if (app.language === 'en') messageTitle.textContent = 'system message';
    else messageTitle.textContent = 'системное сообщение';

    messageElement.textContent = message;
    if (app.elements.goods.querySelector('.main-message') == null) app.elements.goods.append(messageContainer);
    if (remove) {
      setTimeout(() => {
        messageContainer.remove();
        app.isThereMessage = false;
      }, 4000);
    }
    app.isThereMessage = true;
    scroll(0, app.elements.goods.scrollTop);
  }
}

function showMessage(messageType: Message) {
  switch (messageType) {
    case 'no-matches':
      if (app.language === 'en') createMessage('main-message', 'no matches found', false);
      else createMessage('main-message', 'совпадений не найдено', false);
      break;
    default:
      if (app.language === 'en') createMessage('main-message', 'Something went wrong...', false);
      else createMessage('main-message', 'Что-то пошло не так', false);
  }
}

export { showMessage };