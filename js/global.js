const formThemeLabel = document.querySelector('#form-theme label');
const checkboxTheme = document.querySelector('#checkbox-theme');
const themeBall = document.querySelector('.theme-ball');
const taskContainer = document.querySelector('#task-container');
const taskTodoH3 = document.querySelectorAll('.task-todo h3');

/**
 * MODIFICA O TEMA
 */
checkboxTheme.addEventListener('change', () => {
   if (checkboxTheme.checked) {
      // checked modifica para o tema escuro
      themeBall.style.transform = 'translate(24px)';
      formThemeLabel.setAttribute('title', 'Trocar para tema claro');
      taskContainer.style.backgroundColor = 'var(--color-background-dark)';
      taskTodoH3.forEach((txt) => {
         txt.style.color = 'var(--color-secondary)';
      });
      document.body.style.setProperty(
         '--color-bg-toggle',
         'var(--color-background-dark)'
      );
   } else {
      themeBall.style.transform = 'translate(0)';
      formThemeLabel.setAttribute('title', 'Trocar para tema escuro');
      taskContainer.style.backgroundColor = 'var(--color-background-light)';
      taskTodoH3.forEach((txt) => {
         txt.style.color = 'var(--color-background-dark)';
      });
      document.body.style.setProperty(
         '--color-bg-toggle',
         'var(--color-background-light)'
      );
   }
});

/**
 * ADICIONA ÍCONE AOS LINKS COM TARGET BLANK
 */
const targetBlank = document.querySelectorAll("a[target='_blank']");
for (let i = 0; i < targetBlank.length; i++) {
   targetBlank[i].innerHTML +=
      '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
}
