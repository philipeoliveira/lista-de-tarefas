const formAdd = document.querySelector('#form-add');
const inputAdd = document.querySelector('#input-add');
const formAlert = document.querySelector('.form-alert');
const formEdit = document.querySelector('#form-edit');
const inputEdit = document.querySelector('#input-edit');
const cancelEdit = document.querySelector('#cancel-edit');
const formSearch = document.querySelector('#form-search');
const formFilter = document.querySelector('#form-filter');
const taskList = document.querySelector('#task-list');
const taskMessage = document.querySelector('#task-message');

// temporárias para edição e remoção de tarefa
let taskTempText;
let taskTempId;
let taskTempIndex;

/**
 * @desc Renderiza tarefa em tela com data e hora, texto da tarefa e botões
 * @param {string} taskId Id da tarefa
 * @param {Array<string>} lastDateTimeTask Data e hora da criação ou última atualização da tarefa
 * @param {string} taskTxt Texto da tarefa
 */
const renderTask = (taskId, lastDateTimeTask, taskTxt) => {
   // cria elemento para tarefa
   const createTaskEl = document.createElement('div');
   createTaskEl.classList.add('task');

   // inclui id recebido para a tarefa
   createTaskEl.setAttribute('data-task-id', taskId);

   // adiciona dentro a data e hora recebidas
   createTaskEl.appendChild(
      dateTimeForText(lastDateTimeTask, '<br>', 'task-date-time')
   );

   // adiciona o texto recebido da tarefa
   const taskTitleEl = document.createElement('h3');
   taskTitleEl.innerHTML = taskTxt;
   createTaskEl.appendChild(taskTitleEl);

   // cria lista para botões
   const taskButtons = document.createElement('ul');
   taskButtons.classList.add('task-buttons');

   // cria botão Finalizar tarefa
   const finishTaskBtn = createButton(
      'finish-task',
      'Finalizar tarefa',
      '<i class="fa-solid fa-check"></i>'
   );
   taskButtons.appendChild(createItemWithButton(finishTaskBtn));

   // cria botão Editar tarefa
   const editTaskBtn = createButton(
      'edit-task',
      'Editar tarefa',
      '<i class="fa-solid fa-pen"></i>'
   );
   taskButtons.appendChild(createItemWithButton(editTaskBtn));

   // cria botão Deletar tarefa
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
         renderTask(task.taskId, task.lastDateTimeTask, task.taskTxt);
      });
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
 * @desc Lida com o retorno dos dados cadastrados, exibindo uma mensagem se não houver
 * @return {Array<string> | string} Retorna os dados do localStorage ou uma String com uma mensagem de aviso
 */
const handleTaskRendering = () => {
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
   taskList.classList.toggle('hide');
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

      createData('tasks', { taskId, lastDateTimeTask, taskTxt });

      taskMessage.innerText = '';
      clearRenderedTasks();
      rendersAllTasks();

      inputAdd.value = '';
      inputAdd.focus();
      formAlert.innerText = '';
   } else if (!formAlert.hasChildNodes()) {
      // só exibe a mensagem se não estiver exibida
      createMessage(
         formAlert,
         'beforeend',
         '<i class="fa-solid fa-circle-exclamation"></i>',
         'Este campo deve conter no mínimo 3 caracteres'
      );
   }
});

/**
 * Ações para os botões da tarefa
 */
document.addEventListener('click', (event) => {
   const taskEl = event.target.closest('.task');

   // finaliza ou recupera a tarefa
   if (event.target.classList.contains('finish-task')) {
      taskEl.classList.toggle('done');

      // troca o ícone
      const iconEl = event.target.firstElementChild;
      if (taskEl.classList.contains('done')) {
         iconEl.classList.remove('fa-check');
         iconEl.classList.add('fa-arrow-rotate-left');
         event.target.setAttribute('title', 'Desmarcar tarefa finalizada');
      } else {
         iconEl.classList.remove('fa-arrow-rotate-left');
         iconEl.classList.add('fa-check');
         event.target.setAttribute('title', 'Finalizar tarefa');
      }
   }
   // abre form para editar a tarefa
   if (event.target.classList.contains('edit-task')) {
      taskTempText = taskEl.querySelector('h3').innerText;
      inputEdit.value = taskTempText;
      taskTempId = taskEl.dataset.taskId;

      toggleEditForm();
   }
   // deleta a tarefa
   if (event.target.classList.contains('delete-task')) {
      // obtém o id da tarefa clicada
      taskTempId = taskEl.dataset.taskId;

      // obtém o index do array que a tarefa está cadastrada
      taskTempIndex = getIndexById(taskTempId);

      // deleta a tarefa
      deleteData(taskTempIndex, 'tasks');

      clearRenderedTasks();
      handleTaskRendering();
   }
});

/**
 * Edita uma tarefa
 */
formEdit.addEventListener('submit', (event) => {
   event.preventDefault();

   // obtém o index do array que a tarefa está cadastrada
   taskTempIndex = getIndexById(taskTempId);

   // novo texto para a tarefa
   taskTxt = inputEdit.value;

   if (taskTempText) {
      const taskId = dateTimeForId(currentDateTimeFormatted());
      const lastDateTimeTask = currentDateTimeFormatted();

      updateData(taskTempIndex, 'tasks', {
         taskId,
         lastDateTimeTask,
         taskTxt,
      });
   }

   clearRenderedTasks();
   rendersAllTasks();
   toggleEditForm();
});

/**
 * Botão para cancelar a edição da tarefa
 */
cancelEdit.addEventListener('click', (event) => {
   event.preventDefault();

   toggleEditForm();
});

// CARREGA AO INICIAR
window.onload = () => {
   handleTaskRendering();
};
