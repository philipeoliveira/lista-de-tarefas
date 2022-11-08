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
 * CRIA TAREFA
 */
const createTask = (text) => {
   const dateTime = [...currentDateTimeFormatted()];

   // tratamento no dateTime para criar dataset como id
   const dateString = dateTime[0].toString();
   const timeString = dateTime[1].toString();
   const dataDateTime =
      dateString.replace(/\//g, '') + timeString.replace(/:/g, '');

   const task = document.createElement('div');
   task.classList.add('task');
   task.setAttribute('data-task-id', dataDateTime);

   const taskDateTime = document.createElement('span');
   taskDateTime.classList.add('task-date-time');
   taskDateTime.innerHTML = `${dateTime[0]} <br> ${dateTime[1]}`;
   taskDateTime.setAttribute(
      'title',
      `Criada em ${dateTime[0]} às ${dateTime[1]}`
   );
   task.appendChild(taskDateTime);

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

   const inputAddValue = inputAdd.value;

   if (inputAddValue) {
      createTask(inputAddValue);
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
const updateTask = (text) => {
   const allTasks = document.querySelectorAll('.task');

   allTasks.forEach((task) => {
      if (task.dataset.taskId === dataTaskId) {
         task.querySelector('h3').innerText = text;
      }
   });
};

/**
 * EDITA UMA TAREFA
 */
formEdit.addEventListener('submit', (event) => {
   event.preventDefault();

   const inputEditValue = inputEdit.value;

   if (inputEditValue) {
      updateTask(inputEditValue);
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
