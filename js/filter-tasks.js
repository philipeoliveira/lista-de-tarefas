// cria opções do campo select
const filterOptions = [
   { optionValue: 'filter_all', optionText: 'Todas as tarefas' },
   { optionValue: 'filter_done', optionText: 'Tarefas feitas' },
   { optionValue: 'filter_todo', optionText: 'Tarefas a fazer' },
];

const getFilterTextByValue = (optionValue) => {
   for (var i = 0; i < optionValue.length; i++) {
      if (filterOptions[i].optionValue === optionValue) {
         return filterOptions[i].optionText;
      }
   }
};

const createOption = (optionValue, optionText) => {
   const optionEl = document.createElement('option');
   optionEl.setAttribute('value', optionValue);
   optionEl.innerText = optionText;
   return optionEl;
};

const createSelectOptions = (filterOptions) => {
   filterOptions.forEach((props) => {
      const option = createOption(props.optionValue, props.optionText);
      selectFilter.appendChild(option);
   });
};

// filtrar tarefas
const filterTasks = (filterSelectionValue) => {
   var filteredTasks;
   const sortedData = descendingOrder(readData('tasks'));

   // todas as tarefas
   if (filterSelectionValue === filterOptions[0].optionValue) {
      filteredTasks = sortedData;
   }
   // tarefas feitas
   else if (filterSelectionValue === filterOptions[1].optionValue) {
      filteredTasks = sortedData.filter((task) => {
         return task.taskDone === true;
      });
   }
   // tarefas a fazer
   else if (filterSelectionValue === filterOptions[2].optionValue) {
      filteredTasks = sortedData.filter((task) => {
         return task.taskDone === false;
      });
   }

   return filteredTasks;
};
