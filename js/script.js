// Toggle class active untuk list menu
const navbarNav = document.querySelector('.navbar-nav');
// ketika list menu diklik
document.querySelector('#list-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};

//scroll
const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar .navbar-nav a");

window.addEventListener("scroll", () => {
  // ubah warna navbar saat scroll
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // ubah tombol active sesuai posisi
  let current = "";
  sections.forEach(sec => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 200;
    let height = sec.offsetHeight;
    if (top >= offset && top < offset + height) {
      current = sec.getAttribute("id");
    }
  });

  navLinks.forEach(a => {
    a.classList.remove("active");
    if (a.getAttribute("href") === `#${current}`) {
      a.classList.add("active");
    }
  });
});


//Toggle class active shopping cart
const shoppingCart = document.querySelector('.shopping-cart');
//ketika shooping card di klik
document.querySelector('#shopping-button').onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault();
};

// klik diluar elemen
const list = document.querySelector('#list-menu');
const shoppingbutton = document.querySelector('#shopping-button');

document.addEventListener('click', function(e){
  if(!list.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
    }

  if(!shoppingbutton.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove('active');
  }
});