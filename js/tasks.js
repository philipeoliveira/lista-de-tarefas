const formAdd = document.querySelector('#form-add');
const inputAdd = document.querySelector('#input-add');
const alertAdd = document.querySelector('#alert-add');

const formEdit = document.querySelector('#form-edit');
const inputEdit = document.querySelector('#input-edit');
const alertEdit = document.querySelector('#alert-edit');
const btnCancelEdit = document.querySelector('#cancel-edit');

const formSearch = document.querySelector('#form-search');
const inputSearch = document.querySelector('#input-search');
const alertSearch = document.querySelector('#alert-search');

const formFilter = document.querySelector('#form-filter');
const selectFilter = document.querySelector('#select-filter');

const taskListContainer = document.querySelector('#task-list-container');
const taskList = document.querySelector('#task-list');

// temporárias para a busca e o filtro
let getStatusTask;
let tempFilterValue = filterOptions[0].optionValue;
let tempTotalTasksFound;
let tempTotalFilteredTasks;

// temporárias para finalização, edição e remoção de tarefa
let tempTaskDone;
let tempTaskTxt;
let tempTaskId;
let tempTaskIndex;

/**
 * @desc Cria os botões para a tarefa
 * @param {boolean} taskDone Boolean para informar se a tarefa está marcada como feita
 * @return Elemento HTML de lista com os botões
 */
const taskButtons = (taskDone) => {
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

/**
 * @desc Renderiza tarefa em tela com data e hora, texto da tarefa e botões
 * @param {string} taskId Id da tarefa
 * @param {Array<string>} lastDateTimeTask Data e hora da criação ou última atualização da tarefa
 * @param {string} taskTxt Texto da tarefa
 */
const renderTask = (taskId, lastDateTimeTask, taskTxt, taskDone) => {
   // cria elemento para tarefa
   const createTaskEl = document.createElement('li');
   // adiciona classes de tarefa ou tarefa concluída
   taskDone === true
      ? createTaskEl.classList.add('task', 'done')
      : createTaskEl.classList.add('task');

   // inclui id recebido para a tarefa
   createTaskEl.setAttribute('data-task-id', taskId);

   // inclui o status da tarefa
   createTaskEl.setAttribute('data-task-done', taskDone);

   // personaliza texto para mensagem do title do datetime
   let checkModified = checkModifiedTask(taskId, lastDateTimeTask);

   // adiciona dentro a data e hora recebidas
   createTaskEl.appendChild(
      dateTimeForText(
         lastDateTimeTask,
         '<br>',
         'task-date-time',
         checkModified === true ? 'Modificada' : 'Salva'
      )
   );

   // adiciona o texto recebido da tarefa
   const taskTitleEl = document.createElement('h3');
   taskTitleEl.innerHTML = taskTxt;
   createTaskEl.appendChild(taskTitleEl);

   // adiciona lista de botões para a tarefa
   createTaskEl.appendChild(taskButtons(taskDone));

   // adiciona tarefa no elemento com todas as tarefas
   taskList.appendChild(createTaskEl);
};

/**
 * @desc Recebe todas as tarefas cadastradas e renderiza em tela em ordem decrescente
 */
const rendersAllTasks = () => {
   const messageForNoTask = document.querySelector('#message-for-no-task');
   messageForNoTask && messageForNoTask.remove();

   if (readData('tasks').length) {
      const sortedData = descendingOrder(readData('tasks'));
      sortedData.forEach((task) => {
         renderTask(
            task.taskId,
            task.lastDateTimeTask,
            task.taskTxt,
            task.taskDone
         );
      });
   } else {
      noTaskRegistered('Nenhuma tarefa cadastrada...');
   }
};

/**
 * @desc Recebe todas as tarefas cadastradas e renderiza em tela em ordem decrescente
 * @param {boolean} status Boolean informando se a tarefa está concluída
 * @return HTML com as tarefas feitas ou a fazer
 */
const renderDoneOrToDoTasks = (status) => {
   getStatusTask = status;

   // personaliza texto da mensagem do filtro
   let messageTxt =
      status === true ? 'Nenhuma tarefa feita' : 'Nenhuma tarefa a fazer';

   if (readData('tasks').length) {
      const sortedData = descendingOrder(readData('tasks'));

      // filtrando as tarefas pelo status
      const filteredTasks = sortedData.filter((task) => {
         return task.taskDone === getStatusTask;
      });

      // quantidade de tarefas filtradas
      tempTotalFilteredTasks = filteredTasks.length;

      if (tempTotalFilteredTasks > 0) {
         noTaskRegistered();
         // renderizando as filtradas
         filteredTasks.forEach((task) => {
            renderTask(
               task.taskId,
               task.lastDateTimeTask,
               task.taskTxt,
               task.taskDone
            );
         });
      } else {
         noTaskRegistered(messageTxt);
      }
   } else {
      noTaskRegistered(messageTxt);
   }
};

/**
 * @desc Remove a mensagem de aviso quando não houver tarefa cadastrada e, se necessário, insere outra mensagem no lugar
 * @return HTML com mensagem de aviso
 */
const noTaskRegistered = (messageTxt) => {
   const messageForNoTask = document.querySelector('#message-for-no-task');
   messageForNoTask && messageForNoTask.remove();

   let newMessageForNoTask = document.createElement('h3');
   newMessageForNoTask.setAttribute('id', 'message-for-no-task');

   if (messageTxt) {
      // ícones diferentes para a mensagem de acordo com o status da tarefa
      let icon;
      if (messageTxt.indexOf('fazer') != -1) icon = 'fa-check-double';
      else if (messageTxt.indexOf('feita') != -1) icon = 'fa-xmark';
      else if (messageTxt.indexOf('encontrada') != -1) icon = 'fa-circle-xmark';
      else icon = 'fa-face-sad-tear';

      createMessage(
         newMessageForNoTask,
         'beforeend',
         `<i class="fa-solid ${icon}"></i>`,
         messageTxt
      );
   }

   taskListContainer.insertBefore(newMessageForNoTask, taskList);
};

/**
 * @desc Limpa as tarefas já renderizadas na tela
 */
const clearRenderedTasks = () => {
   const renderedTasks = document.querySelectorAll('.task');

   renderedTasks && renderedTasks.forEach((task) => task.remove());
};

/**
 * @desc Obtém o index da tarefa armazenada através do id da tarefa clicada
 * @param {number} id identificador da tarefa clicada
 * @return {number} Number da posição do Array
 */
const getIndexById = (id) => {
   const getData = readData('tasks');

   for (var i = 0; i < getData.length; i++) {
      if (getData[i].taskId === id) {
         return i;
      }
   }
};

/**
 * @desc Alterna entre mostrar o formulário de edição de tarefas ou todos os outros
 */
const toggleEditForm = () => {
   formAdd.classList.toggle('hide');
   formEdit.classList.toggle('hide');
   formSearch.classList.toggle('hide');
   formFilter.classList.toggle('hide');
   taskListContainer.classList.toggle('hide');
};

/**
 * @desc Verifica se uma tarefa foi modifica
 * @param {string} taskId Id da tarefa (gerado a partir da data de criação)
 * @param {Array<string>} lastDateTimeTask Data e hora da criação ou última atualização da tarefa
 * @return {boolean} Boolean
 */
const checkModifiedTask = (taskId, lastDateTimeTask) => {
   const createdWithId = taskId;
   const lastDateTime = dateTimeForId(lastDateTimeTask);

   return createdWithId != lastDateTime ? true : false;
};

/**
 * @desc Aviso de nova tarefa
 * @return HTML com o aviso
 */
const taskMessageInOut = () => {
   const taskMessageInOut = document.createElement('span');
   taskMessageInOut.classList.add('task-message-in-out');
   taskMessageInOut.innerHTML = 'nova';

   return taskMessageInOut;
};

/**
 * @desc Remove todos os avisos de nova tarefa
 */
const removeAllTaskMessagesInOut = () => {
   const allTaskMessagesInOut = document.querySelectorAll(
      '.task-message-in-out'
   );

   allTaskMessagesInOut &&
      allTaskMessagesInOut.forEach((task) => task.remove());
};

const modifyingTitle = (iconClass, title) => {
   // trocando o título h2
   const taskListContainerTitle = document.querySelector(
      '#task-list-container h2'
   );
   const newTaskListContainerTitle = document.createElement('h2');
   newTaskListContainerTitle.innerHTML = `<i class="${iconClass}"></i>${title}`;
   taskListContainer.replaceChild(
      newTaskListContainerTitle,
      taskListContainerTitle
   );
};

// EVENTOS
/**
 * Adiciona tarefa
 */
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

      noTaskRegistered();
      clearRenderedTasks();
      rendersAllTasks();

      const renderedTasks = document.querySelectorAll('.task');
      renderedTasks &&
         renderedTasks.forEach((task) => {
            const taskTitleEl = task.querySelector('h3');
            const getDataset = task.getAttribute('data-task-id');

            if (getDataset === taskId) {
               task.insertBefore(taskMessageInOut(), taskTitleEl);
               // remove a informação de nova tarefa depois de segundos
               setTimeout(() => {
                  const taskMessageInOut = task.querySelector(
                     '.task-message-in-out'
                  );
                  taskMessageInOut && taskMessageInOut.remove();
               }, 5000);
            }
         });

      inputAdd.value = '';
      inputAdd.focus();
      alertAdd.innerText = '';

      modifyingTitle('fa-solid fa-list-check', 'Todas as tarefas');
      // só exibe a mensagem se não estiver exibida
   } else if (!alertAdd.hasChildNodes()) {
      createMessage(
         alertAdd,
         'beforeend',
         '<i class="fa-solid fa-circle-exclamation"></i>',
         'A tarefa deve conter no mínimo 3 caracteres'
      );
   }
});

/**
 * Edita uma tarefa
 */
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

         clearRenderedTasks();
         rendersAllTasks();
         toggleEditForm();

         // remove todas as informações de nova tarefa
         removeAllTaskMessagesInOut();

         alertEdit.innerText = '';

         modifyingTitle('fa-solid fa-list-check', 'Todas as tarefas');
         // só exibe a mensagem se não estiver exibida
      } else if (!alertEdit.hasChildNodes()) {
         createMessage(
            alertEdit,
            'beforeend',
            '<i class="fa-solid fa-circle-exclamation"></i>',
            'A tarefa deve conter no mínimo 3 caracteres'
         );
      }
   }
});

/**
 * Botão para cancelar a edição da tarefa
 */
btnCancelEdit.addEventListener('click', (event) => {
   event.preventDefault();

   toggleEditForm();
});

/**
 * Ações para os botões da tarefa
 */
document.addEventListener('click', (event) => {
   const taskEl = event.target.closest('.task');

   /* Finaliza ou recupera a tarefa */
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

      // atualiza o dateTime na tela
      const lastDateTimeTaskEl = taskEl.querySelector('.task-date-time');
      const newLastDateTimeTask = dateTimeForText(
         lastDateTimeTask,
         '<br>',
         'task-date-time',
         'Modificada'
      );
      taskEl.replaceChild(newLastDateTimeTask, lastDateTimeTaskEl);

      // atualiza os botões na tela
      const taskButtonsEl = taskEl.querySelector('.task-buttons');
      taskEl.replaceChild(taskButtons(taskDone), taskButtonsEl);

      // adiciona classes de tarefa ou tarefa concluída
      taskEl.classList.toggle('done');
      // inclui o status da tarefa
      taskEl.setAttribute('data-task-done', taskDone);

      // remove a informação de nova tarefa
      const taskMessageInOut = taskEl.querySelector('.task-message-in-out');
      taskMessageInOut && taskMessageInOut.remove();
   }

   /* Abre form para editar a tarefa */
   if (event.target.classList.contains('edit-task')) {
      tempTaskTxt = taskEl.querySelector('h3').innerText;
      inputEdit.value = tempTaskTxt;
      tempTaskId = taskEl.dataset.taskId;
      tempTaskDone = stringToBoolean(taskEl.dataset.taskDone);

      alertEdit.innerText = '';

      toggleEditForm();
   }

   /* Deleta a tarefa */
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

         if (!readData('tasks').length) {
            noTaskRegistered('Nenhuma tarefa cadastrada...');
         }
      }, 500);
   }
});

formSearch.addEventListener('submit', (event) => {
   event.preventDefault();

   const searchTxt = inputSearch.value.toLowerCase().trim();
   //const searchTxtLength = inputSearch.value.length;

   modifyingTitle('fa-solid fa-magnifying-glass', 'Pesquisando tarefas');

   if (searchTxt) {
      var filteredTasks;
      const sortedData = descendingOrder(readData('tasks'));

      // filtra tarefas feitas, a fazer ou todas
      if (tempFilterValue === 'filter_done') {
         filteredTasks = sortedData.filter((task) => {
            return task.taskDone === true;
         });
      } else if (tempFilterValue === 'filter_todo') {
         filteredTasks = sortedData.filter((task) => {
            return task.taskDone === false;
         });
      } else if (tempFilterValue === 'filter_all') {
         filteredTasks = sortedData;
      }

      // tarefas encontradas pela busca dentro das filtradas
      const tasksFound = filteredTasks.filter((task) => {
         const taskTxt = task.taskTxt.toLowerCase();
         if (taskTxt.includes(searchTxt)) {
            return searchTxt;
         }
      });

      // quantidade de tarefas encontradas
      tempTotalTasksFound = tasksFound.length;

      if (tempTotalTasksFound > 0) {
         clearRenderedTasks();
         noTaskRegistered();

         // renderizando as encontradas
         tasksFound.forEach((task) => {
            renderTask(
               task.taskId,
               task.lastDateTimeTask,
               task.taskTxt,
               task.taskDone
            );
         });
      } else {
         clearRenderedTasks();
         noTaskRegistered(
            `Nenhuma tarefa encontrada ao pesquisar por '<strong> ${searchTxt} </strong>'`
         );
      }

      inputSearch.value = '';
      alertSearch.innerText = '';
   } else {
      clearRenderedTasks();
      rendersAllTasks();
   }
});

/**
 * Ações para o filtro de tarefas
 */
selectFilter.addEventListener('change', (event) => {
   clearRenderedTasks();

   tempFilterValue = event.target.value;

   if (tempFilterValue === 'filter_done') {
      modifyingTitle('fa-regular fa-square-check', 'Tarefas feitas');
      renderDoneOrToDoTasks(true);
   } else if (tempFilterValue === 'filter_todo') {
      modifyingTitle('fa-solid fa-list-ul', 'Tarefas a fazer');
      renderDoneOrToDoTasks(false);
   } else if (tempFilterValue === 'filter_all') {
      modifyingTitle('fa-solid fa-list-check', 'Todas as tarefas');
      rendersAllTasks();
   }
});

// CARREGA AO INICIAR
window.onload = () => {
   createSelectOptions(filterOptions);
   rendersAllTasks();
};
