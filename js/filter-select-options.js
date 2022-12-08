const filterOptions = [
   { optionValue: 'filter_all', optionText: 'Todas as tarefas' },
   { optionValue: 'filter_done', optionText: 'Tarefas feitas' },
   { optionValue: 'filter_todo', optionText: 'Tarefas a fazer' },
];

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
