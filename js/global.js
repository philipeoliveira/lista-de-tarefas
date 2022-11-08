const targetBlank = document.querySelectorAll("a[target='_blank']");
const formAdd = document.querySelector('#form-add');
const inputAdd = document.querySelector('#input-add');
const formEdit = document.querySelector('#form-edit');
const inputEdit = document.querySelector('#input-edit');
const cancelEdit = document.querySelector('#cancel-edit');
const formSearch = document.querySelector('#form-search');
const formFilter = document.querySelector('#form-filter');
const taskList = document.querySelector('#task-list');

// iniciadas para edição da tarefa
let taskTitle;
let dataTaskId;

/**
 * ADICIONA ÍCONE AOS LINKS COM TARGET BLANK
 */
for (let i = 0; i < targetBlank.length; i++) {
   targetBlank[i].innerHTML +=
      '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
}

/**
 * CRIA BOTÃO EM UM ITEM DA LISTA DE BOTÕES
 */
const createItemWithButton = (className, title, text) => {
   const button = document.createElement('button');
   button.classList.add(className);
   button.setAttribute('title', title);
   // texto ou tag do ícone
   button.innerHTML = text;

   const taskButtonItem = document.createElement('li');
   taskButtonItem.appendChild(button);

   return taskButtonItem;
};

/**
 * FORMATA DATETIME PARA O DATASET
 */
const dateTimeForDataset = () => {
   const dateTime = [...currentDateTimeFormatted()];

   // tratamento no dateTime para criar dataset como id
   const dateString = dateTime[0].toString();
   const timeString = dateTime[1].toString();
   const dateTimeId =
      dateString.replace(/\//g, '') + timeString.replace(/:/g, '');

   return dateTimeId;
};

/**
 * FORMATA DATETIME PARA A TAREFA
 */
const dateTimeForTask = (usedForm) => {
   const dateTime = [...currentDateTimeFormatted()];

   const addTxtDateTime = usedForm === formAdd.id ? 'Criada' : 'Atualizada';

   const taskDateTime = document.createElement('span');
   taskDateTime.classList.add('task-date-time');
   taskDateTime.innerHTML = `${dateTime[0]} <br> ${dateTime[1]}`;
   taskDateTime.setAttribute(
      'title',
      `${addTxtDateTime} em ${dateTime[0]} às ${dateTime[1]}`
   );

   return taskDateTime;
};

/**
 * CRIA TAREFA
 */
const createTask = (text, usedForm) => {
   const task = document.createElement('div');
   task.classList.add('task');

   task.setAttribute('data-task-id', dateTimeForDataset());
   task.appendChild(dateTimeForTask(usedForm));

   const taskTitleEl = document.createElement('h3');
   taskTitleEl.innerHTML = text;
   task.appendChild(taskTitleEl);

   const taskButtons = document.createElement('ul');
   taskButtons.classList.add('task-buttons');

   taskButtons.appendChild(
      createItemWithButton(
         'finish-task',
         'Finalizar tarefa',
         '<i class="fa-solid fa-check"></i>'
      )
   );
   taskButtons.appendChild(
      createItemWithButton(
         'edit-task',
         'Editar tarefa',
         '<i class="fa-solid fa-pen"></i>'
      )
   );
   taskButtons.appendChild(
      createItemWithButton(
         'delete-task',
         'Deletar tarefa',
         '<i class="fa-solid fa-trash"></i>'
      )
   );

   task.appendChild(taskButtons);
   taskList.appendChild(task);
};

/**
 * ADICIONA UMA TAREFA
 */
formAdd.addEventListener('submit', (event) => {
   event.preventDefault();

   const usedForm = event.target.id;

   const inputAddValue = inputAdd.value;

   if (inputAddValue) {
      createTask(inputAddValue, usedForm);
   }

   // limpa o campo
   inputAdd.value = '';
   inputAdd.focus();
});

/**
 * ALTERNA ENTRE MOSTRAR O FORMULÁRIO DE EDIÇÃO
 * OU TODOS OS OUTROS (E LISTA DE TAREFAS)
 */
const toggleForms = () => {
   formAdd.classList.toggle('hide');
   formEdit.classList.toggle('hide');
   formSearch.classList.toggle('hide');
   formFilter.classList.toggle('hide');
   taskList.classList.toggle('hide');
};

/**
 * AÇÕES DOS BOTÕES DA TAREFA
 */
document.addEventListener('click', (event) => {
   const task = event.target.closest('.task');

   // armazena o título da tarefa
   if (task) {
      taskTitle = task.querySelector('h3').innerText;
   }

   // finaliza ou recupera a tarefa
   if (event.target.classList.contains('finish-task')) {
      task.classList.toggle('done');
   }
   // edita a tarefa
   if (event.target.classList.contains('edit-task')) {
      toggleForms();

      inputEdit.value = taskTitle;
      dataTaskId = task.dataset.taskId;
   }
   // deleta a tarefa
   if (event.target.classList.contains('delete-task')) {
      task.remove();
   }
});

/**
 * ATUALIZA TAREFA
 */
const updateTask = (text, usedForm) => {
   const allTasks = document.querySelectorAll('.task');

   allTasks.forEach((task) => {
      if (task.dataset.taskId === dataTaskId) {
         // atribui um novo id para o dataset da task
         task.setAttribute('data-task-id', dateTimeForDataset());

         // remove a datetime de criação
         task.removeChild(task.firstElementChild);
         // insere a datetime atualizada
         task.prepend(dateTimeForTask(usedForm));

         task.querySelector('h3').innerText = text;
      }
   });
};

/**
 * EDITA UMA TAREFA
 */
formEdit.addEventListener('submit', (event) => {
   event.preventDefault();

   const usedForm = event.target.id;

   const inputEditValue = inputEdit.value;

   if (inputEditValue) {
      updateTask(inputEditValue, usedForm);
   }

   toggleForms();
});

/**
 * BOTÃO CANCELAR EDIÇÃO DA TAREFA
 */
cancelEdit.addEventListener('click', (event) => {
   event.preventDefault();

   toggleForms();
});
