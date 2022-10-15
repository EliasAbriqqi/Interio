import View from "./View";

class favouritesView extends View {
  _parentElement = document.querySelector(
    ".favourites-popup-wrapper .favourites-cards-wrapper"
  );
  _cardsParentElement = ".favourites-cards-wrapper";
  _cardsElement = " .search-result-card";
  _parentEventTarget = ".search-result-card";
  _slide = `${this._cardsParentElement} .search-result-card-pic .card-pic`;
  _dotContainer = `${this._cardsParentElement} .search-result-dot-wrapper`;
  _dot = `${this._cardsParentElement} .search-result-dot-wrapper .dot`;

  _defineSlides() {
    return document.querySelectorAll(this._slide);
  }

  _defineDotContainer() {
    return document.querySelector(this._dotContainer);
  }

  _giveCardsParent() {
    return this._cardsParentElement;
  }

  _defineDot() {
    return document.querySelectorAll(this._dot);
  }

  activateFavPopup(
    handler,
    handlerRefreshSearchPage,
    handlerRefreshProductPage,
    refreshFavNum,
    showProductsByCat
  ) {
    const popupWindow = document.querySelector(".favourites-popup-wrapper");
    const favWrapper = document.querySelector(".favourites-cards-wrapper");
    const favHeartBtn = document.querySelector(".favourites");
    const grayVeil = document.querySelector(".gray-veil-fav");
    const mainHeader = document.querySelector(".main-header");
    const favPopupCloseBtn = document.querySelector(".favourites-popup-close");

    const addFavPopup = function () {
      popupWindow.style.display = "block";
      grayVeil.style.display = "block";
      document.documentElement.style.overflowY = "hidden";
      mainHeader.classList.add("active-header");
      handler();
      refreshFavNum();
    };

    favHeartBtn.addEventListener("click", addFavPopup);

    const removeFavPopup = function () {
      favWrapper.innerHTML = "";
      popupWindow.style.display = "none";
      grayVeil.style.display = "none";
      document.documentElement.style.overflowY = "unset";
      mainHeader.classList.remove("active-header");

      if (
        document.querySelector(".search-results-section-wrapper") &&
        !document.querySelector(".categ")
      ) {
        document.querySelector(".search-results-section-wrapper").innerHTML =
          "";
        handlerRefreshSearchPage();
      }

      if (document.querySelector(".product-card")) {
        const productName = document
          .querySelector(".product-card")
          .getAttribute("data-name");
        document.querySelector("section").innerHTML = "";
        handlerRefreshProductPage(productName);
      }

      if (document.querySelector(".categ")) {
        const title = document
          .querySelector(".section-heading")
          .innerHTML.toLowerCase();
        showProductsByCat(title);
      }
    };

    grayVeil.addEventListener("click", removeFavPopup);
    favPopupCloseBtn.addEventListener("click", removeFavPopup);
  }

  addEventToCard(handler) {
    const popupWindow = document.querySelector(".favourites-popup-wrapper");
    const grayVeil = document.querySelector(".gray-veil-fav");
    const mainHeader = document.querySelector(".main-header");
    const parentEventTarget = this._parentEventTarget;
    const parentElement = this._parentElement;

    this._parentElement.addEventListener("click", function (e) {
      const clicked = e.target.closest(`${parentEventTarget}[data-name]`);

      if (
        e.target.classList.contains("card-heart") ||
        e.target.classList.contains("search-result-card-btn")
      )
        return;

      if (clicked) {
        const productName = clicked.getAttribute("data-name");

        parentElement.innerHTML = "";
        popupWindow.style.display = "none";
        grayVeil.style.display = "none";
        document.documentElement.style.overflowY = "unset";
        mainHeader.classList.remove("active-header");

        handler(productName);
      }
    });
  }

  activateSlider(obj) {
    let curSlide = 0;
    const thisCard = document.querySelector(
      `${this._cardsParentElement} .search-result-card[data-name="${obj.name}"]`
    );
    const dotParent = thisCard.querySelector(".search-result-dot-wrapper");
    const theseSlides = thisCard.querySelectorAll(
      ".search-result-card-pic .card-pic"
    );

    const thisDotContainer = thisCard.querySelector(
      ".search-result-dot-wrapper"
    );

    const goToSlide = function (slide) {
      theseSlides.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      );
    };

    goToSlide(0);

    const createDots = function () {
      theseSlides.forEach(function (_, i) {
        dotParent.insertAdjacentHTML(
          "beforeend",
          `<div class='dot' data-slide='${i}'></div>`
        );
      });

      goToSlide(0);
    };

    createDots();

    const activateDots = function (slide) {
      thisCard.querySelectorAll(`.dot[data-slide]`).forEach((d) => {
        d.classList.remove("dot-active");
      });
      thisCard
        .querySelector(`.dot[data-slide='${slide}']`)
        .classList.add("dot-active");
    };

    thisDotContainer.addEventListener("mouseover", function (e) {
      if (e.target.classList.contains("dot")) {
        const { slide } = e.target.dataset;
        goToSlide(slide);
        activateDots(slide);
      }
    });

    activateDots(0);

    const deleteNoDiscount = function () {
      if (obj.discount === 0) {
        thisCard.querySelector(".card-discount-percent").remove();
        thisCard.querySelector(".card-discount-sum").remove();
        thisCard.querySelector(
          ".search-result-card-price-wrapper"
        ).style.justifyContent = "center";
      }
    };

    deleteNoDiscount();
  }

  activateHeart(obj, handlerRemoveFav, refreshFavNum) {
    const thisCard = document.querySelector(
      `${this._cardsParentElement} .search-result-card[data-name="${obj.name}"]`
    );
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
        .closest(".search-result-card")
        .getAttribute("data-name");

      const cardToRemove = e.target.closest(".search-result-card");

      cardToRemove.remove();
      handlerRemoveFav(productName);
      refreshFavNum();
    });
  }

  setFavNum(favLength) {
    const favNum = document.querySelector(".favourites-num");
    const favHeadingNum = document.querySelector(".favourites-heading-number");
    const favMessage = document.querySelector(".fav-message");

    favHeadingNum.innerHTML = `${favLength}`;
    favNum.innerHTML = `${favLength}`;

    if (favLength === 0) {
      favMessage.innerHTML = "You have no favourite items";
    } else {
      favMessage.innerHTML = "";
    }
  }
}

export default new favouritesView();
