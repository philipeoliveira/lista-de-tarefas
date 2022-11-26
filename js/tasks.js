const formAdd = document.querySelector('#form-add');
const inputAdd = document.querySelector('#input-add');
const alertAdd = document.querySelector('#alert-add');

const formEdit = document.querySelector('#form-edit');
const inputEdit = document.querySelector('#input-edit');
const alertEdit = document.querySelector('#alert-edit');
const btnCancelEdit = document.querySelector('#cancel-edit');

const formSearch = document.querySelector('#form-search');
const formFilter = document.querySelector('#form-filter');

const taskListContainer = document.querySelector('#task-list-container');
const taskList = document.querySelector('#task-list');
const taskMessage = document.querySelector('#task-message');

let newTask;

// temporárias para finalização, edição e remoção de tarefa
let tempTaskDone;
let tempTaskText;
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

   // se for uma tarefa nova, não foi modificada
   if (newTask === true) {
      // informa que a tarefa é nova
      createTaskEl.insertBefore(newTaskNotice(), taskTitleEl);
      // remove a informação de nova tarefa depois de segundos
      setTimeout(() => {
         const newTaskEl = createTaskEl.querySelector('.new-task');
         newTaskEl && newTaskEl.remove();
      }, 5000);
   }

   // adiciona lista de botões para a tarefa
   createTaskEl.appendChild(taskButtons(taskDone));

   // adiciona tarefa no elemento com todas as tarefas
   taskList.appendChild(createTaskEl);
};

/**
 * @desc Recebe todas as tarefas cadastradas e renderiza em tela
 */
const rendersAllTasks = () => {
   if (readData('tasks').length) {
      readData('tasks').forEach((task) => {
         renderTask(
            task.taskId,
            task.lastDateTimeTask,
            task.taskTxt,
            task.taskDone
         );
      });
   }
};

/**
 * @desc Mensagem de aviso quando não houver tarefa cadastrada
 * @return HTML com mensagem de aviso
 */
const noTaskRegistered = () => {
   return createMessage(
      taskMessage,
      'beforeend',
      '<i class="fa-solid fa-face-sad-tear"></i>',
      'Nenhuma tarefa cadastrada...'
   );
};

/**
 * @desc Limpa as tarefas já renderizadas na tela
 */
const clearRenderedTasks = () => {
   const renderedTasks = document.querySelectorAll('.task');

   renderedTasks && renderedTasks.forEach((element) => element.remove());
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
const newTaskNotice = () => {
   const newTask = document.createElement('span');
   newTask.classList.add('new-task');
   newTask.innerHTML = 'nova';

   return newTask;
};

/**
 * @desc Remove todos os avisos de nova tarefa
 */
const removeTaskNotice = () => {
   const allNewTaskEl = document.querySelectorAll('.new-task');
   if (allNewTaskEl) {
      for (task of allNewTaskEl) {
         task.remove();
      }
   }
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

      taskMessage.innerText = '';

      newTask = true;
      renderTask(taskId, lastDateTimeTask, taskTxt, taskDone);

      inputAdd.value = '';
      inputAdd.focus();
      alertAdd.innerText = '';
      // só exibe a mensagem se não estiver exibida
   } else if (!alertAdd.hasChildNodes()) {
      createMessage(
         alertAdd,
         'beforeend',
         '<i class="fa-solid fa-circle-exclamation"></i>',
         'Este campo deve conter no mínimo 3 caracteres'
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

   if (tempTaskText) {
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
         removeTaskNotice();

         alertEdit.innerText = '';
         // só exibe a mensagem se não estiver exibida
      } else if (!alertEdit.hasChildNodes()) {
         createMessage(
            alertEdit,
            'beforeend',
            '<i class="fa-solid fa-circle-exclamation"></i>',
            'Este campo deve conter no mínimo 3 caracteres'
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
      const newTaskEl = taskEl.querySelector('.new-task');
      newTaskEl && newTaskEl.remove();
   }

   /* Abre form para editar a tarefa */
   if (event.target.classList.contains('edit-task')) {
      tempTaskText = taskEl.querySelector('h3').innerText;
      inputEdit.value = tempTaskText;
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

      for (let i = 0; i < taskEl.childNodes.length; i++) {
         let child = taskEl.childNodes[i];
         child.classList.add('fade-out');
      }

      setTimeout(() => {
         taskEl.remove();

         if (!readData('tasks').length) {
            noTaskRegistered();
         }
      }, 500);
   }
});

// CARREGA AO INICIAR
window.onload = () => {
   if (readData('tasks').length) {
      rendersAllTasks();
   } else {
      noTaskRegistered();
   }
};
