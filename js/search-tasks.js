// procurar tarefa
const searchTasks = (filteredTasks, searchTxt) => {
   searchTxt = searchTxt.toLowerCase().trim();

   const tasksFound = filteredTasks.filter((task) => {
      const taskTxt = task.taskTxt.toLowerCase();

      if (taskTxt.includes(searchTxt)) {
         return searchTxt;
      }
   });

   return tasksFound;
};
