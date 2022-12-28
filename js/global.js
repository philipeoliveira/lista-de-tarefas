/**
 * Adiciona ícone aos links com target _blank
 */
const targetBlank = document.querySelectorAll("a[target='_blank']");

for (let i = 0; i < targetBlank.length; i++) {
   targetBlank[i].innerHTML +=
      '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
}
/**
 * @desc Recebe o nome de um arquivo, remove e retorna somente o tipo dele (extensão do arquivo)
 * @param {string} filename String com o nome completo (com extensão) do arquivo
 * @return {string} String com o nome do tipo do arquivo
 */
const fileExtension = (filename) => {
   const extension = filename.split('.').pop();
   return extension;
};

/**
 * @desc Obtém a largura da janela/browser
 * @return {number} Number com o tamanho da janela/browser
 */
const getWindowWidth = () => {
   const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

   return windowWidth;
};

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
 * @param {string} titleTxt Texto com o status da tarefa
 * @return {string} String com data e hora formatadas
 */
const dateTimeForText = (dateTime, separator, className, titleTxt) => {
   const dateString = dateTime[0].toString();
   const timeString = dateTime[1].toString();

   const dateTimeText = document.createElement('span');
   dateTimeText.classList.add(className);
   dateTimeText.innerHTML = dateString + separator + timeString;
   dateTimeText.setAttribute(
      'title',
      `${titleTxt} em ${dateString} às ${timeString}`
   );

   return dateTimeText;
};

/**
 * @desc Converte a String recebida em Boolean
 * @param {string} string String com o valor a ser convertido
 * @return {boolean} Boolean convertido
 */
const stringToBoolean = (string) => {
   let boolean = string === 'true' ? true : false;
   return boolean;
};

/**
 * COMPARA CAMPOS DE TEXTO DE OBJETOS,
 * RETORNANDO EM ORDEM ALFABÉTICA
 */
/**
 * @desc Compara campos de um array
 * @param {array} array Array com os dados a serem ordenados
 * @return {array} Array em ordem decrescente
 */
const descendingOrder = (array) => {
   array.sort((objectA, objectB) => {
      if (objectA.taskId > objectB.taskId) {
         // ordena objectA para um índice anterior a objectB
         return -1;
      }
      if (objectA.taskId < objectB.taskId) {
         // ordena objectB para um índice anterior que objectA
         return 1;
      }
      // deixa objectA e objectB inalterados um em relação ao outro
      return 0;
   });

   return array;
};

/**
 * @desc Cria e faz download de arquivo com os dados recebidos
 * @param {array} data Object com os dados a serem incluídos dentro do arquivo
 * @param {string} filename String para o nome do arquivo
 * @param {string} type String com tipo do arquivo
 */
const exportFile = (data, filename, type) => {
   const file = new Blob([data], { type: type });

   // para navegadores mais modernos
   if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file, filename);
      return;
   }

   // para navegadores antigos
   const a = document.createElement('a');
   const url = URL.createObjectURL(file);

   a.href = url;
   a.download = filename;

   document.body.appendChild(a);

   a.click();

   setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
   }, 0);
};

/**
 * @desc Importa de arquivo JSON uma lista de tarefas para o localStorage
 * @param {string} keyName String que será o nome da chave
 * @param {Array<object>} json Array de Objetos vinda do input file
 */
const importFile = (keyName, json) => {
   localStorage.setItem(keyName, JSON.stringify(json));
};
