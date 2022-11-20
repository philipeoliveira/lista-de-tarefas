const themeFormLabel = document.querySelector('#form-theme label');
const themeCheckbox = document.querySelector('#theme-checkbox');
const themeBall = document.querySelector('.theme-ball');

/**
 * Define propriedade no body
 */
const setPropertyInBody = (propertyName, value) => {
   document.body.style.setProperty(propertyName, value);
};

/**
 * Define estilos e atributos para o tema Dark
 */
const selectedDarkTheme = () => {
   themeBall.style.transform = 'translate(24px)';
   themeFormLabel.setAttribute('title', 'Trocar para tema claro');

   setPropertyInBody('--color-bg-toggle', 'var(--color-dark)');
   setPropertyInBody('--color-text-toggle', 'var(--color-secondary)');
};

/**
 * Define estilos e atributos para o tema Light
 */
const selectedLightTheme = () => {
   themeBall.style.transform = 'translate(0)';
   themeFormLabel.setAttribute('title', 'Trocar para tema escuro');

   setPropertyInBody('--color-bg-toggle', 'var(--color-light)');
   setPropertyInBody('--color-text-toggle', 'var(--color-dark)');
};

/**
 * Define como o tema será iniciado
 */
let getTheme = getLocalStorage('themeDark');

if (getTheme === 1) {
   themeCheckbox.checked = true;
   selectedDarkTheme();
}

/**
 * Modifica o tema
 */
themeCheckbox.addEventListener('change', () => {
   // checked modifica para o tema escuro
   if (themeCheckbox.checked) {
      setLocalStorage('themeDark', 1);
      selectedDarkTheme();
   } else {
      setLocalStorage('themeDark', 0);
      selectedLightTheme();
   }
});
