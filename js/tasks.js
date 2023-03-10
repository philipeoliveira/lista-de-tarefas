const taskContainer = document.querySelector('#task-container');
const themeForm = document.querySelector('#form-theme');
const scrollTop = document.querySelector('#scroll-top');

const formAdd = document.querySelector('#form-add');
const inputAdd = document.querySelector('#input-add');
const alertAdd = document.querySelector('#alert-add');

const formEdit = document.querySelector('#form-edit');
const inputEdit = document.querySelector('#input-edit');
const alertEdit = document.querySelector('#alert-edit');
const btnCancelEdit = document.querySelector('#cancel-edit');

let fileImport;
const formImport = document.querySelector('#form-import');
const titleImport = document.querySelector('#title-import');
const inputImport = document.querySelector('#input-import');
const filenameImport = document.querySelector('#filename-import');
const alertImport = document.querySelector('#alert-import');
const btnCancelImport = document.querySelector('#cancel-import');

const toolbar = document.querySelector('#toolbar');

const formSearch = document.querySelector('#form-search');
const inputSearch = document.querySelector('#input-search');

const formFilter = document.querySelector('#form-filter');
const selectFilter = document.querySelector('#select-filter');

let tasksFound;

const taskListContainer = document.querySelector('#task-list-container');
const taskListInfo = document.querySelector('#task-list-info');
const taskListBtns = document.querySelector('#task-list-btns');
const newTaskButton = document.querySelector('#new-task');
const printTasksButton = document.querySelector('#print-tasks');
const exportTaskButton = document.querySelector('#export-task');
const importTaskButton = document.querySelector('#import-task');
const taskList = document.querySelector('#task-list');
const exitPrintMode = document.querySelector('#exit-print-mode');

// temporárias para a busca e o filtro
let tempFilterValue = filterOptions[0].optionValue;
let tempTotalTasksFound;

// temporárias para finalização, edição e remoção de tarefa
let tempTaskDone;
let tempTaskTxt;
let tempTaskId;
let tempTaskIndex;

/* renderiza tarefa em tela com data e hora, texto da tarefa e botões */
const renderTask = (taskId, lastDateTimeTask, taskTxt, taskDone) => {
   // cria elemento para tarefa
   const createTaskEl = document.createElement('li');
   // inclui id recebido para a tarefa
   createTaskEl.setAttribute('data-task-id', taskId);
   // inclui o status da tarefa
   createTaskEl.setAttribute('data-task-done', taskDone);

   // adiciona classes de tarefa ou tarefa concluída
   taskDone === true
      ? createTaskEl.classList.add('task', 'done')
      : createTaskEl.classList.add('task');

   // personaliza texto para mensagem do title do datetime
   let checkModified = checkModifiedTask(taskId, lastDateTimeTask);

   // adiciona dentro a data e hora recebidas
   createTaskEl.appendChild(
      dateTimeForText(
         lastDateTimeTask,
         getWindowWidth() < 689 ? ' - ' : '<br>',
         'task-date-time',
         checkModified === true ? 'Modificada' : 'Salva'
      )
   );

   // adiciona o texto recebido da tarefa
   const taskTitleEl = document.createElement('h3');
   taskTitleEl.innerHTML = taskTxt;
   createTaskEl.appendChild(taskTitleEl);

   // adiciona lista de botões para a tarefa
   createTaskEl.appendChild(createTaskButtons(taskDone));

   // adiciona tarefa no elemento com todas as tarefas
   taskList.appendChild(createTaskEl);
};

/* recebe todas as tarefas cadastradas e renderiza em tela em ordem decrescente */
const rendersAllTasks = (searchTxt) => {
   clearRenderedTasks();

   // personaliza título e texto da mensagem do filtro
   let iconClass;
   let messageTxt;

   if (searchTxt) {
      // tarefas encontradas já filtradas
      tasksFound = searchTasks(filterTasks(tempFilterValue), searchTxt);

      // quantidade de tarefas encontradas
      tempTotalTasksFound = tasksFound.length;

      replaceTitle(
         'fa-solid fa-magnifying-glass',
         'Pesquisando tarefas',
         `${handleTotalTasksFound(
            tempTotalTasksFound
         )} <span>em ${getFilterTextByValue(tempFilterValue)}</span>`
      );

      iconClass = 'fa-circle-xmark';
      messageTxt = `Nenhuma tarefa localizada ao pesquisar por '<strong> ${searchTxt} </strong>'</span>`;

      inputSearch.value = searchTxt;
   } else {
      // tarefas encontradas já filtradas
      tasksFound = filterTasks(tempFilterValue);

      // quantidade de tarefas encontradas
      tempTotalTasksFound = tasksFound.length;

      if (tempFilterValue === 'filter_done') {
         replaceTitle(
            'fa-regular fa-square-check',
            'Tarefas feitas',
            `${handleTotalTasksFound(tempTotalTasksFound)}`
         );
         iconClass = 'fa-xmark';
         messageTxt = 'Nenhuma tarefa feita';
      } else if (tempFilterValue === 'filter_todo') {
         replaceTitle(
            'fa-solid fa-list-ul',
            'Tarefas a fazer',
            `${handleTotalTasksFound(tempTotalTasksFound)}`
         );
         iconClass = 'fa-check-double';
         messageTxt = 'Nenhuma tarefa a fazer';
      } else if (tempFilterValue === 'filter_all') {
         replaceTitle(
            'fa-solid fa-list-check',
            'Todas as tarefas',
            `${handleTotalTasksFound(tempTotalTasksFound)}`
         );
         iconClass = 'fa-circle-xmark';
         messageTxt = 'Nenhuma tarefa cadastrada...';
      }

      inputSearch.value = '';
   }

   if (tempTotalTasksFound > 0) {
      replaceMessageNoTaskRegistered('');

      // renderizando as filtradas
      tasksFound.forEach((task) => {
         renderTask(
            task.taskId,
            task.lastDateTimeTask,
            task.taskTxt,
            task.taskDone
         );
      });
   } else {
      // ao não encontrar resultados do filtro
      replaceMessageNoTaskRegistered(iconClass, messageTxt);
   }
};

/* obtém o index da tarefa armazenada através do id da tarefa clicada */
const getIndexById = (id) => {
   const getData = readData('tasks');

   for (var i = 0; i < getData.length; i++) {
      if (getData[i].taskId === id) {
         return i;
      }
   }
};

/* verifica se uma tarefa foi modifica */
const checkModifiedTask = (taskId, lastDateTimeTask) => {
   const createdWithId = taskId;
   const lastDateTime = dateTimeForId(lastDateTimeTask);

   return createdWithId != lastDateTime ? true : false;
};

/* mensagem de aviso que entra e sai na tarefa */
const messageInOutTask = (messageText, taskId) => {
   const renderedTasks = document.querySelectorAll('.task');
   const messageInOutTaskEl = document.createElement('span');
   messageInOutTaskEl.classList.add('message-in-out-task');
   messageInOutTaskEl.innerHTML = messageText;

   if (renderedTasks) {
      renderedTasks.forEach((task) => {
         const taskTitleEl = task.querySelector('h3');
         const getDataset = task.getAttribute('data-task-id');

         if (getDataset === taskId) {
            task.insertBefore(messageInOutTaskEl, taskTitleEl);

            setTimeout(() => {
               messageInOutTaskEl.remove();
            }, 5000);
         }
      });
   }
};

/* remove todas as mensagens de aviso que entra e sai na tarefa */
const removeAllMessagesInOutTasks = () => {
   const allMessagesInOut = document.querySelectorAll('.task-message-in-out');

   allMessagesInOut && allMessagesInOut.forEach((task) => task.remove());
};

/* substitui o título das tarefas */
const replaceTitle = (iconClass, titleText, listDetails) => {
   const currentTitle = document.querySelector('#task-list-container h2');
   const newTitle = document.createElement('h2');
   newTitle.innerHTML = `<i class="${iconClass}"></i>${titleText}`;

   taskListContainer.replaceChild(newTitle, currentTitle);

   const currentDetails = document.querySelector('#task-list-container p');
   const newDetails = document.createElement('p');
   newDetails.innerHTML = listDetails;

   taskListInfo.replaceChild(newDetails, currentDetails);
};

/* verifica se o texto do total de tarefas retornará no singular ou plural */
const handleTotalTasksFound = (tempTotalTasksFound) => {
   return tempTotalTasksFound <= 1
      ? `<i class="fa-solid fa-location-crosshairs"></i> ${tempTotalTasksFound} tarefa localizada`
      : `<i class="fa-solid fa-location-crosshairs"></i> ${tempTotalTasksFound} tarefas localizadas`;
};

/* cria os botões para a tarefa */
const createTaskButtons = (taskDone) => {
   // cria lista para botões
   const taskBtns = document.createElement('ul');
   taskBtns.classList.add('task-buttons');

   // cria e adiciona botão Finalizar tarefa na lista
   const finishTaskBtn = createButton(
      'finish-task',
      `${
         taskDone === true
            ? 'Desmarcar tarefa feita'
            : 'Marcar tarefa como feita'
      }`,
      `<i class="fa-solid ${
         taskDone === true ? 'fa-arrow-rotate-left' : 'fa-check'
      }"></i>`
   );
   taskBtns.appendChild(createItemWithButton(finishTaskBtn));

   // cria e adiciona botão Editar tarefa na lista
   const editTaskBtn = createButton(
      'edit-task',
      'Editar tarefa',
      '<i class="fa-solid fa-pen"></i>'
   );
   taskBtns.appendChild(createItemWithButton(editTaskBtn));

   // cria e adiciona botão Deletar tarefa na lista
   const deleteTaskBtn = createButton(
      'delete-task',
      'Deletar tarefa',
      '<i class="fa-solid fa-trash"></i>'
   );
   taskBtns.appendChild(createItemWithButton(deleteTaskBtn));

   return taskBtns;
};

/* limpa as tarefas já renderizadas na tela */
const clearRenderedTasks = () => {
   const renderedTasks = document.querySelectorAll('.task');

   renderedTasks && renderedTasks.forEach((task) => task.remove());
};

/* remove a mensagem de aviso quando não houver tarefa cadastrada e, se necessário, insere outra mensagem no lugar */
const replaceMessageNoTaskRegistered = (iconClass, messageTxt) => {
   const currentMessage = document.querySelector('#message-for-no-task');
   currentMessage && currentMessage.remove();

   let newMessage = document.createElement('h3');
   newMessage.setAttribute('id', 'message-for-no-task');

   if (messageTxt) {
      newMessage.classList.toggle('message-for-no-task');

      createMessage(
         newMessage,
         'beforeend',
         `<i class="fa-solid ${iconClass}"></i>`,
         messageTxt
      );
   }

   taskListContainer.insertBefore(newMessage, taskList);
};

/* alterna entre mostrar o formulário de edição de tarefas ou todos os outros */
const toggleEditForm = () => {
   formAdd.classList.toggle('hide');
   formEdit.classList.toggle('hide');
   toolbar.parentNode.classList.toggle('hide');
   taskListContainer.classList.toggle('hide');
};

/* alterna entre mostrar a página com a versão para impressão ou voltar para página completa */
const togglePrint = () => {
   taskContainer.classList.toggle('shadow');
   themeForm.parentNode.classList.toggle('header-for-print');
   themeForm.classList.toggle('hide');
   formAdd.classList.toggle('hide');
   toolbar.parentNode.classList.toggle('hide');
   taskListBtns.classList.toggle('task-list-btns');
   taskListBtns.classList.toggle('hide');
   scrollTop.classList.toggle('hide');

   const allTaskButtonLists = document.querySelectorAll('.task ul');
   allTaskButtonLists.forEach((list) => {
      list.classList.toggle('task-buttons');
      list.classList.toggle('hide');
   });

   exitPrintMode.parentNode.classList.toggle('hide');
};

/* alterna entre mostrar o formulário para importar a lista de tarefas ou todos os outros */
const toggleImportFile = () => {
   formAdd.classList.toggle('hide');
   titleImport.classList.toggle('hide');
   formImport.classList.toggle('hide');
   toolbar.parentNode.classList.toggle('hide');
   taskListContainer.classList.toggle('hide');
   filenameImport.innerText = '';
   alertImport.innerText = '';
};

/* faz a rolagem da página para a lista de tarefas */
const scrollToTaskList = () => {
   let element = document.getElementById('task-list-container');
   let elementCoordinates = element.getBoundingClientRect();
   let elementCoordinatesTop = elementCoordinates.top;

   window.scrollTo({
      top: elementCoordinatesTop,
      behavior: 'smooth',
   });
};

/* adiciona tarefa */
formAdd.addEventListener('submit', (event) => {
   event.preventDefault();

   const taskTxt = inputAdd.value.trim();
   const taskTxtLength = inputAdd.value.length;

   if (taskTxt && taskTxtLength >= 3) {
      const taskId = dateTimeForId(currentDateTimeFormatted());
      const lastDateTimeTask = currentDateTimeFormatted();
      const taskDone = false;

      createData('tasks', {
         taskId,
         lastDateTimeTask,
         taskTxt,
         taskDone,
      });

      scrollToTaskList();
      rendersAllTasks();
      messageInOutTask('nova', taskId);

      inputAdd.value = '';
      inputAdd.blur();
      alertAdd.innerText = '';
   } else if (!alertAdd.hasChildNodes()) {
      // só exibe a mensagem se não estiver exibida
      createMessage(
         alertAdd,
         'beforeend',
         '<i class="fa-solid fa-circle-exclamation"></i>',
         'A tarefa deve conter no mínimo 3 caracteres'
      );
   }
});

/* edita uma tarefa */
formEdit.addEventListener('submit', (event) => {
   event.preventDefault();

   // obtém o index do array que a tarefa está cadastrada
   tempTaskIndex = getIndexById(tempTaskId);

   // novo texto para a tarefa
   const taskTxt = inputEdit.value.trim();
   const taskTxtLength = inputEdit.value.length;

   if (tempTaskTxt) {
      if (taskTxt && taskTxtLength >= 3) {
         const taskId = tempTaskId;
         const lastDateTimeTask = currentDateTimeFormatted();
         const taskDone = tempTaskDone;

         updateData(tempTaskIndex, 'tasks', {
            taskId,
            lastDateTimeTask,
            taskTxt,
            taskDone,
         });

         rendersAllTasks();
         messageInOutTask('atualizada', taskId);
         toggleEditForm();

         alertEdit.innerText = '';
      } else if (!alertEdit.hasChildNodes()) {
         // só exibe a mensagem se não estiver exibida
         createMessage(
            alertEdit,
            'beforeend',
            '<i class="fa-solid fa-circle-exclamation"></i>',
            'A tarefa deve conter no mínimo 3 caracteres'
         );
      }
   }
});

/* procurar tarefa */
formSearch.addEventListener('submit', (event) => {
   event.preventDefault();

   let searchTxt = inputSearch.value;

   scrollToTaskList();
   rendersAllTasks(searchTxt);
});

/* filtrar tarefas */
selectFilter.addEventListener('change', (event) => {
   tempFilterValue = event.target.value;

   rendersAllTasks();
});

/* ir para o campo de adicionar tarefa */
newTaskButton.addEventListener('click', (event) => {
   window.scrollTo({
      top: 0,
      behavior: 'smooth',
   });

   inputAdd.focus();
});

/* imprimir tarefas */
printTasksButton.addEventListener('click', (event) => {
   togglePrint();
   window.print();
});

/* alterna o modo de impressão */
exitPrintMode.addEventListener('click', (event) => {
   togglePrint();
});

/* exporta arquivo JSON com a lista de tarefas */
exportTaskButton.addEventListener('click', (event) => {
   const tasksJson = JSON.stringify(tasksFound);
   exportFile(
      tasksJson,
      `lista-de-tarefas-${dateTimeForId(currentDateTimeFormatted())}`,
      'application/json'
   );
});

/* abre formulário para importar lista de tarefas */
importTaskButton.addEventListener('click', (event) => {
   toggleImportFile();
});

/* obtém o nome do arquivo do input file para importar lista de tarefas */
inputImport.addEventListener('change', (event) => {
   if (inputImport.files[0]) {
      fileImport = inputImport.files[0];

      filenameImport.innerText = '';
      alertImport.innerText = '';

      createMessage(
         filenameImport,
         'beforeend',
         '<i class="fa-solid fa-file-import"></i>',
         fileImport.name
      );
   }
});

/* importa arquivo JSON com a lista de tarefas para o localStorage */
formImport.addEventListener('submit', (event) => {
   event.preventDefault();

   let fileReader = new FileReader();

   if (
      inputImport.files[0] &&
      fileExtension(inputImport.files[0].name) === 'json'
   ) {
      fileImport = inputImport.files[0];

      fileReader.onload = function () {
         // converte o arquivo json recebido, converte em string e importa para localStorage
         let parsedJSON = JSON.parse(fileReader.result);
         importFile('tasks', parsedJSON);

         rendersAllTasks();
      };

      fileReader.readAsText(fileImport);

      inputImport.value = '';

      toggleImportFile();
   } else if (!alertImport.hasChildNodes()) {
      // só exibe a mensagem se não estiver exibida
      createMessage(
         alertImport,
         'beforeend',
         '<i class="fa-solid fa-circle-exclamation"></i>',
         'Selecione um arquivo JSON previamente exportado deste sistema'
      );
   }
});

/* botão para cancelar a importação da lista de tarefas */
btnCancelImport.addEventListener('click', (event) => {
   event.preventDefault();

   document.location.reload(true);
});

/* ações para os botões da tarefa */
document.addEventListener('click', (event) => {
   const taskEl = event.target.closest('.task');

   /* finaliza ou recupera a tarefa */
   if (event.target.classList.contains('finish-task')) {
      const taskId = taskEl.dataset.taskId;
      const lastDateTimeTask = currentDateTimeFormatted();
      const taskTxt = taskEl.querySelector('h3').innerText;
      let taskDone = stringToBoolean(taskEl.dataset.taskDone);
      // inverte o status da tarefa
      taskDone = !taskDone;

      // obtém o index do array que a tarefa está cadastrada
      tempTaskIndex = getIndexById(taskId);

      updateData(tempTaskIndex, 'tasks', {
         taskId,
         lastDateTimeTask,
         taskTxt,
         taskDone,
      });

      rendersAllTasks();
      messageInOutTask('atualizada', taskId);
   }

   /* abre form para editar a tarefa */
   if (event.target.classList.contains('edit-task')) {
      tempTaskTxt = taskEl.querySelector('h3').innerText;
      inputEdit.value = tempTaskTxt;

      tempTaskId = taskEl.dataset.taskId;

      tempTaskDone = stringToBoolean(taskEl.dataset.taskDone);

      alertEdit.innerText = '';

      toggleEditForm();
   }

   /* deleta a tarefa */
   if (event.target.classList.contains('delete-task')) {
      // obtém o id da tarefa clicada
      tempTaskId = taskEl.dataset.taskId;

      // obtém o index do array que a tarefa está cadastrada
      tempTaskIndex = getIndexById(tempTaskId);

      // deleta a tarefa
      deleteData(tempTaskIndex, 'tasks');

      // efeitos para fechar tarefa antes de apagar da tela
      taskEl.classList.add('close-task');
      for (var i = 0; i < taskEl.childNodes.length; i++) {
         let child = taskEl.childNodes[i];
         child.classList.add('fade-out');
      }

      setTimeout(() => {
         taskEl.remove();

         rendersAllTasks();
      }, 350);
   }
});

/* botão para cancelar a edição da tarefa */
btnCancelEdit.addEventListener('click', (event) => {
   event.preventDefault();

   toggleEditForm();
});

// ao carregar a página
window.onload = () => {
   createSelectOptions(filterOptions);
   rendersAllTasks();
};
