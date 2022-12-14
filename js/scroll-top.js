const scrollTopBtn = document.querySelector('#scroll-top button');

window.addEventListener('scroll', () => {
   scrollTopBtn.classList.toggle('btn-scroll-top', window.scrollY > 500);
});

scrollTopBtn.addEventListener('click', (event) => {
   console.log(event);
   window.scrollTo({
      top: 0,
      behavior: 'smooth',
   });
});
