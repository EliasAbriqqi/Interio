import { PIC_HOST } from "../config";

export default class View {
  render(obj) {
    const markup = this._generateMarkup(obj);
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
    window.scrollTo(0, 0);
  }

  renderProductCard(obj) {
    const markup = this._generateMarkup(obj);
    this._parentElement.insertAdjacentHTML("beforeend", markup);
  }

  addEventToCard(handler) {
    const parentEventTarget = this._parentEventTarget;

    this._parentElement.addEventListener("click", function (e) {
      const clicked = e.target.closest(`${parentEventTarget}[data-name]`);

      if (clicked) {
        const productName = clicked.getAttribute("data-name");
        handler(productName);
      }
    });
  }

  _generateCardMarkup(obj) {
    return `
          <!-- card -->
          <div class="search-result-card" data-name="${obj.name}">
            <div class="search-result-card-pic">
              <div class="search-result-pics-wrapper"></div>
              <div class="search-result-dot-wrapper"></div>
              <div class="card-heart"></div>
            </div>
            
            <div class="search-result-card-price-wrapper">
              <div class="card-price">${(
                obj.price -
                (obj.price * obj.discount) / 100
              ).toFixed(2)}$</div>
              <div class="card-discount-sum">${obj.price}$</div>
              <div class="card-discount-percent">-${obj.discount}%</div>
            </div>
            <p class="search-result-card-description">
            ${obj.description}
            </p>
            <button class="search-result-card-btn">Add to cart</button>
          </div>
          
          <!-- card end -->
        `;
  }

  renderSearchResultsParent(query) {
    const parentMarkup = this._generateParentMarkup(query);
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", parentMarkup);
  }

  renderSearchResults(obj) {
    const searchResultsMarkup = this._generateCardMarkup(obj);
    const cardsParent = document.querySelector(this._cardsParentElement);
    cardsParent.insertAdjacentHTML("beforeend", searchResultsMarkup);
  }

  renderSlides(obj) {
    const thisCard = document.querySelector(
      `${this._cardsParentElement}${this._cardsElement}[data-name="${obj.name}"]`
    );

    const slidesParent = thisCard.querySelector(".search-result-pics-wrapper");
    obj.pics.forEach(function (pic) {
      slidesParent.insertAdjacentHTML(
        "beforeend",
        `<div class="card-pic"><img src="${PIC_HOST}${pic}" class="product-card-pic-img"></div>`
      );
    });
  }

  activateHeart(obj, handlerAddFav, handlerRemoveFav, refreshFavNum) {
    const thisCard = document.querySelector(
      `${this._cardsParentElement}${this._cardsElement}[data-name="${obj.name}"]`
    );

    const parentEventTarget = this._parentEventTarget;

    const thisHeart = thisCard.querySelector(".card-heart");

    const heartMouseOver = function () {
      thisHeart.classList.add("heart-hovered");
    };

    const heartMouseOut = function () {
      thisHeart.classList.remove("heart-hovered");
    };

    thisHeart.addEventListener("mouseover", heartMouseOver);
    thisHeart.addEventListener("mouseout", heartMouseOut);

    thisHeart.addEventListener("click", function (e) {
      const productName = e.target
        .closest(`${parentEventTarget}`)
        .getAttribute("data-name");

      if (!e.target.classList.contains("heart-active")) {
        e.target.classList.add("heart-active");
        handlerAddFav(productName);
      } else {
        e.target.classList.remove("heart-active");
        handlerRemoveFav(productName);
      }
      refreshFavNum();
    });
  }

  renderActiveHeart(obj) {
    const thisCard = document.querySelector(
      `${this._cardsParentElement}${this._cardsElement}[data-name="${obj.name}"]`
    );
    const thisHeart = thisCard.querySelector(".card-heart");

    if (!thisHeart.classList.contains("heart-active")) {
      thisHeart.classList.add("heart-active");
    }
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }

  clearWindow() {
    this._parentElement.innerHTML = "";
  }

  hideSearchPopup() {
    const searchPopupWindow = document.querySelector(".search-popup-wrapper");
    const veil = document.querySelector(".veil");
    const mainHeader = document.querySelector(".main-header");
    searchPopupWindow.classList.remove("search-popup-show");
    mainHeader.classList.remove("active-header");
    veil.style.display = "none";
    document.documentElement.style.overflowY = "unset";
  }

  activateSlider(obj) {
    let curSlide = 0;
    const slides = this._defineSlides();
    const dotContainer = this._defineDotContainer();

    let goToSlide = function (slide) {
      slides.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      );
    };
    goToSlide(0);

    const createDots = function () {
      slides.forEach(function (_, i) {
        dotContainer.insertAdjacentHTML(
          "beforeend",
          `<div class='dot' data-slide='${i}'></div>`
        );
      });
    };

    createDots();

    const dot = this._defineDot();

    const activateDots = function (slide) {
      dot.forEach((d) => {
        d.classList.remove("dot-active");
      });
      document
        .querySelector(`.dot[data-slide='${slide}']`)
        .classList.add("dot-active");
    };

    dotContainer.addEventListener("mouseover", function (e) {
      if (e.target.classList.contains("dot")) {
        const { slide } = e.target.dataset;
        goToSlide(slide);
        activateDots(slide);
      }
    });

    activateDots(0);

    if (obj) {
      const dots = document.querySelectorAll(this._dot);
      dots.forEach(function (dot, i) {
        dot.style.backgroundImage = `url(${PIC_HOST}${obj.pics[i]})`;
      });
    }
  }

  activateBuyBtn(obj, handlerAddCart, refreshCartNum) {
    const addToCartBtn = document.querySelector(
      `.search-result-card[data-name='${obj.name}'] .search-result-card-btn`
    );

    if (obj.available === false) {
      addToCartBtn.innerHTML = "Not available";
      addToCartBtn.classList.add("added");
    }

    addToCartBtn.addEventListener("click", function (e) {
      if (!addToCartBtn.classList.contains("added")) {
        handlerAddCart(obj);
        e.target.closest(".search-result-card-btn").innerHTML = "In cart";
        refreshCartNum();
        addToCartBtn.classList.add("added");
      } else {
        return;
      }
    });
  }

  renderAddedBtn(obj) {
    const thisCard = document.querySelector(
      `${this._cardsParentElement}${this._cardsElement}[data-name="${obj.name}"]`
    );
    const thisBtn = thisCard.querySelector(".search-result-card-btn");

    if (!thisBtn.classList.contains("added")) {
      thisBtn.classList.add("added");
      thisBtn.innerHTML = "In cart";
    }
  }

  activateCategoryBtn(handler) {
    const catBtnsWrapper = document.querySelector(".categories-cards-wrapper");

    catBtnsWrapper.addEventListener("click", function (e) {
      const clicked = e.target.closest(".categories-card");
      if (!clicked) return;
      const catName = clicked.querySelector("h3").innerHTML.toLowerCase();
      handler(catName);
    });
  }
}
