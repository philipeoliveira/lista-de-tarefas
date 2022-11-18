/**
 * Adiciona ícone aos links com target _blank
 */
const targetBlank = document.querySelectorAll("a[target='_blank']");

for (let i = 0; i < targetBlank.length; i++) {
   targetBlank[i].innerHTML +=
      '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
}

/**
 * @desc Cria mensagem de texto
 * @param {object} targetEl Elemento HTML selecionado com JS que receberá a mensagem
 * @param {string} position String com uma das posições da função insertAdjacentHTML()
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML}
 * @param {string} icon String com um ícone para adicionar na mensagem
 * @param {string} textMessage String com o texto da mensagem
 * @return {string} String com o texto final da mensagem
 */
const createMessage = (targetEl, position, icon, textMessage) => {
   const messageWithHTML = icon + textMessage;
   targetEl.insertAdjacentHTML(position, messageWithHTML);
};

/**
 * @desc Cria um botão estilizado
 * @param {string} className String com classe css
 * @param {string} title String com o texto para propriedade title
 * @param {string} text String com o texto do botão ou tag com ícone
 * @return {string} String com o botão
 */
const createButton = (className, title, text) => {
   const button = document.createElement('button');
   button.classList.add(className);
   button.setAttribute('title', title);

   button.innerHTML = text;

   return button;
};

/**
 * @desc Cria um item de lista com o botão recebido
 * @param {string} button String com o botão
 * @return {string} String com o item de lista e o botão
 */
const createItemWithButton = (button) => {
   const itemWithButton = document.createElement('li');
   itemWithButton.appendChild(button);

   return itemWithButton;
};

/**
 * @desc Formata função Date() do JS para data e hora no formato pt-BR
 * @return {Array<string} Array com data e hora formatados
 * @example ['06/11/2022', '15:37:13']
 */
const currentDateTimeFormatted = () => {
   const date = new Date();

   options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'America/Sao_Paulo',
   };

   // 06/11/2022 15:37:13
   const dateTime = new Intl.DateTimeFormat('pt-BR', options).format(date);

   const dateFormatted = dateTime.substring(0, 10);
   const timeFormatted = dateTime.substring(11, 19);

   return [dateFormatted, timeFormatted];
};

/**
 * @desc Formata a data e hora recebidos para usar como id
 * @param {Array<String>} dateTime Array com duas posições de data e hora
 * @return {string} String com a sequência de números
 */
const dateTimeForId = (dateTime) => {
   const dateString = dateTime[0].toString();
   const timeString = dateTime[1].toString();
   const dateTimeId =
      dateString.replace(/\//g, '') + timeString.replace(/:/g, '');

   return dateTimeId;
};

/**
 * @desc Formata a data e hora com separador
 * @param {Array<String>} dateTime Array com duas posições de data e hora
 * @param {string} separator String com o caractere escolhido para separar a data da hora
 * @param {string} className String com o nome da classe css para estilizar a data e hora
 * @return {string} String com data e hora formatadas
 */
const dateTimeForText = (dateTime, separator, className) => {
   const dateString = dateTime[0].toString();
   const timeString = dateTime[1].toString();

   const dateTimeText = document.createElement('span');
   dateTimeText.classList.add(className);
   dateTimeText.innerHTML = dateString + separator + timeString;
   dateTimeText.setAttribute(
      'title',
      `Salva em ${dateString} às ${timeString}`
   );

   return dateTimeText;
};
