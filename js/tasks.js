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

// temporárias para finalização, edição e remoção de tarefa
let tempTaskDone;
let tempTaskText;
let tempTaskId;
let tempTaskIndex;

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

   // adiciona dentro a data e hora recebidas
   createTaskEl.appendChild(
      dateTimeForText(
         lastDateTimeTask,
         '<br>',
         'task-date-time',
         checkModifiedTask(taskId, lastDateTimeTask)
      )
   );

   // adiciona o texto recebido da tarefa
   const taskTitleEl = document.createElement('h3');
   taskTitleEl.innerHTML = taskTxt;
   createTaskEl.appendChild(taskTitleEl);

   // cria lista para botões
   const taskButtons = document.createElement('ul');
   taskButtons.classList.add('task-buttons');

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
   taskButtons.appendChild(createItemWithButton(finishTaskBtn));

   // cria e adiciona botão Editar tarefa na lista
   const editTaskBtn = createButton(
      'edit-task',
      'Editar tarefa',
      '<i class="fa-solid fa-pen"></i>'
   );
   taskButtons.appendChild(createItemWithButton(editTaskBtn));

   // cria e adiciona botão Deletar tarefa na lista
   const deleteTaskBtn = createButton(
      'delete-task',
      'Deletar tarefa',
      '<i class="fa-solid fa-trash"></i>'
   );
   taskButtons.appendChild(createItemWithButton(deleteTaskBtn));

   // adiciona lista de botões para a tarefa
   createTaskEl.appendChild(taskButtons);

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
 * @desc Lida com o retorno dos dados cadastrados, exibindo uma mensagem se não houver
 * @return {Array<string> | string} Retorna os dados do localStorage ou uma String com uma mensagem de aviso
 */
const rendersAllTasksOrMessage = () => {
   if (readData('tasks').length) {
      rendersAllTasks();
   } else {
      createMessage(
         taskMessage,
         'beforeend',
         '<i class="fa-solid fa-face-sad-tear"></i>',
         'Nenhuma tarefa cadastrada...'
      );
   }
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
 * @return {string} String 'Salva' ou 'Modificada'
 */
const checkModifiedTask = (taskId, lastDateTimeTask) => {
   const createdWithId = taskId;
   const lastDateTime = dateTimeForId(lastDateTimeTask);

   return createdWithId === lastDateTime ? 'Salva' : 'Modificada';
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
      clearRenderedTasks();
      rendersAllTasks();

      inputAdd.value = '';
      inputAdd.focus();
      alertAdd.innerText = '';
   } else if (!alertAdd.hasChildNodes()) {
      // só exibe a mensagem se não estiver exibida
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

         alertEdit.innerText = '';
      } else if (!alertEdit.hasChildNodes()) {
         // só exibe a mensagem se não estiver exibida
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

   // finaliza ou recupera a tarefa
   if (event.target.classList.contains('finish-task')) {
      //const taskId = dateTimeForId(currentDateTimeFormatted());
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

      clearRenderedTasks();
      rendersAllTasks();
   }

   // abre form para editar a tarefa
   if (event.target.classList.contains('edit-task')) {
      tempTaskText = taskEl.querySelector('h3').innerText;
      inputEdit.value = tempTaskText;
      tempTaskId = taskEl.dataset.taskId;
      tempTaskDone = stringToBoolean(taskEl.dataset.taskDone);

      alertEdit.innerText = '';

      toggleEditForm();
   }

   // deleta a tarefa
   if (event.target.classList.contains('delete-task')) {
      // obtém o id da tarefa clicada
      tempTaskId = taskEl.dataset.taskId;

      // obtém o index do array que a tarefa está cadastrada
      tempTaskIndex = getIndexById(tempTaskId);

      // deleta a tarefa
      deleteData(tempTaskIndex, 'tasks');

      clearRenderedTasks();
      rendersAllTasksOrMessage();
   }
});

// CARREGA AO INICIAR
window.onload = () => {
   rendersAllTasksOrMessage();
};
