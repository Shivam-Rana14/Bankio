"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const header = document.querySelector(".header");
const section1 = document.querySelector("#section--1");
const btnScroll = document.querySelector(".btn--scroll-to");
const message = document.createElement("div");
const tabs = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabContent = document.querySelectorAll(".operations__content");
const navigations = document.querySelector(".nav");
const img = document.querySelectorAll("img[data-src]");
const allSections = document.querySelectorAll(".section");
const slides = document.querySelectorAll(".slide");
const btnRight = document.querySelector(".slider__btn--right");
const btnLeft = document.querySelector(".slider__btn--left");
//MODAL SHOW
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

//MODAL HIDE
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

//HIDE MODAL WHEN esc pressed!
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//EVENT LISTENERS
//Smooth Scrolling
btnScroll.addEventListener("click", function () {
  section1.scrollIntoView({ behavior: "smooth" });
});

//SCROLLING IMPLEMENTED USING EVENT DELEGATION
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();
  //Match if relevant button
  if (
    e.target.classList.contains("nav__link") &&
    !e.target.classList.contains("nav__link--btn")
  ) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//Tabbed Component

tabContainer.addEventListener("click", function (e) {
  e.preventDefault();
  const clicked = e.target.closest(".operations__tab");
  //Gaurd Clause
  if (!clicked) return;

  //hide active container
  tabContent.forEach((t) => t.classList.remove("operations__content--active"));
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));

  //show clicked container
  clicked.classList.add("operations__tab--active");
  const tab = clicked.dataset.tab;
  document
    .querySelector(`.operations__content--${tab}`)
    .classList.add("operations__content--active");
});

// MENU FADE ANIMATION
const handleHover = function (e, opacity) {
  const link = e.target;
  const links = link.closest("nav").querySelectorAll(".nav__link");
  const logo = link.closest("nav").querySelectorAll("img");
  // Fade Out effect
  links.forEach((el) => {
    if (el !== link) {
      el.style.opacity = opacity;
    }
  });
  logo.forEach((el) => {
    if (el !== link) {
      el.style.opacity = opacity;
    }
  });
};
navigations.addEventListener("mouseover", function (e) {
  handleHover(e, 0.5);
});
navigations.addEventListener("mouseout", function (e) {
  handleHover(e, 1);
});

//ADD Sticky Navigation after a certain position

//Get Position
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener("scroll", function () {
//   if (this.window.scrollY > initialCoords.top)
//     navigations.classList.add("sticky");
//   else navigations.classList.remove("sticky");
// });
//Intersection Observer API
const navHeight = navigations.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navigations.classList.add("sticky");
  else navigations.classList.remove("sticky");
};
const obsOPtions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(stickyNav, obsOPtions);
headerObserver.observe(header);

//Reveal Elements using Intersection Observer

const revealSection = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  sectionObserver.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.25,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//Lazy Load Images
const imgReveal = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    //Not Intersecting Revert To Blur
    entry.target.classList.add("lazy-img");
  } else {
    //Intersecting Reveal
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });
  }
  //This was needed if not required to revert back
  // imgObserver.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(imgReveal, {
  root: null,
  threshold: 0.7,
});
img.forEach((img) => {
  imgObserver.observe(img);
});

//SLider Component
const sliderComponent = function () {
  let curSlide = 0;
  const maxSlide = slides.length - 1;
  const dotContainer = document.querySelector(".dots");

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide ="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    const dots = document.querySelectorAll(".dots__dot");
    dots.forEach((dot) => {
      dot.classList.remove("dots__dot--active");
      //Custom dot selection
      document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add("dots__dot--active");
    });
  };

  const slider = function (s) {
    slides.forEach(
      (slide, i) => (slide.style.transform = `translateX(${100 * (i - s)}%)`)
    );
  };

  const rightSlide = function () {
    if (curSlide == maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    slider(curSlide);
    activateDot(curSlide);
  };
  const leftSlide = function () {
    if (curSlide == 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    slider(curSlide);
    activateDot(curSlide);
  };
  const init = function () {
    slider(0);
    createDots();
    activateDot(0);
  };
  init();
  //Event Handler
  btnRight.addEventListener("click", rightSlide);
  btnLeft.addEventListener("click", leftSlide);

  document.addEventListener("keydown", function (e) {
    e.key === "ArrowRight" && rightSlide();
    e.key === "ArrowLeft" && leftSlide();
  });
  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      slider(slide);
      activateDot(slide);
    }
  });
};
sliderComponent();

// Cookies Accept Message
message.style.backgroundColor = "#37383d";
message.style.setProperty("width", "104.1%");
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";
message.classList.add("cookie-message");
message.innerHTML = `We use cookies for improved functionality and analytics. Please accept our cookies<button class="btn btn--close--cookie">Got it!</button>`;
header.append(message);
message.style.position = "fixed";
message.style.bottom = "0";
message.style.zIndex = "1000";
document
  .querySelector(".btn--close--cookie")
  .addEventListener("click", function () {
    message.remove();
  });
