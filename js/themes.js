const formThemeLabel = document.querySelector('#form-theme label');
const checkboxTheme = document.querySelector('#checkbox-theme');
const themeBall = document.querySelector('.theme-ball');
const taskContainer = document.querySelector('#task-container');
const taskTodoH3 = document.querySelectorAll('.task h3');

/**
 * Define propriedade no body
 */
const setPropertyInBody = (propertyName, value) => {
   document.body.style.setProperty(propertyName, value);
};

/**
 * Modifica o tema
 */
checkboxTheme.addEventListener('change', () => {
   // checked modifica para o tema escuro
   if (checkboxTheme.checked) {
      themeBall.style.transform = 'translate(24px)';
      formThemeLabel.setAttribute('title', 'Trocar para tema claro');

      setPropertyInBody('--color-bg-toggle', 'var(--color-dark)');
      setPropertyInBody('--color-text-toggle', 'var(--color-secondary)');
   } else {
      themeBall.style.transform = 'translate(0)';
      formThemeLabel.setAttribute('title', 'Trocar para tema escuro');

      setPropertyInBody('--color-bg-toggle', 'var(--color-light)');
      setPropertyInBody('--color-text-toggle', 'var(--color-dark)');
   }
});
