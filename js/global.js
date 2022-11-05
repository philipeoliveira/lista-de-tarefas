const targetBlank = document.querySelectorAll("a[target='_blank']");

/**
 * ADICIONA ÍCONE AOS LINKS COM TARGET BLANK
 */
for (let i = 0; i < targetBlank.length; i++) {
   targetBlank[i].innerHTML +=
      '<i class="fa-solid fa-arrow-up-right-from-square"></i>';
}
