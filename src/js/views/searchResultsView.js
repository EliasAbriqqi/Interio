import View from "./View";
import { PIC_HOST } from "../config";

class searchResultsView extends View {
  _parentElement = document.querySelector("section");
  _cardsParentElement = ".search-results-wrapper";
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

  _generateParentMarkup(query) {
    return `<div class="search-results-section-wrapper">
<h2 class="section-heading">${query}</h2>
<hr />

 <!--
  <div class="search-results-select-wrapper">
  <span>Sort by:</span>
  <select name="sort-by" id="">
    <option value="recommended">Recommended</option>
    <option value="price">Price</option>
  </select>
</div>
-->

<div class="search-results-wrapper">
</div>
      </div>`;
  }

  activateSearchBtn(handler) {
    const searchBtn = document.querySelector(".search-input-btn");
    const searchPopupBtn = document.querySelector(".search-popup-btn");
    const searchInput = document.querySelector(".search-input");
    const searchPopupInput = document.querySelector(".search-popup-input");
    const searchPopupWrapper = document.querySelector(".search-popup-wrapper");

    const hideMobilePopup = function () {
      searchPopupWrapper.classList.remove("search-popup-show");
      document.documentElement.style.overflowY = "unset";
      veil.style.display = "none";
    };

    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (searchInput.value.trim().length === 0) return;
      handler();
      searchInput.blur();
      searchInput.value = "";
    });

    searchPopupBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (searchPopupInput.value.trim().length === 0) return;
      hideMobilePopup();
      handler();
      searchPopupInput.blur();
      searchPopupInput.value = "";
    });

    document.addEventListener("keyup", function (e) {
      if (
        searchPopupWrapper.classList.contains("search-popup-show") &&
        e.key === "Enter"
      ) {
        e.preventDefault();
        handler();
        searchInput.blur();
        searchInput.value = "";
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
    const theseDots = thisCard.querySelectorAll(
      ".search-result-dot-wrapper .dot"
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

  addEventToCard(handler) {
    const parentEventTarget = this._parentEventTarget;
    const searchResultsWrapper = document.querySelector(
      ".search-results-section-wrapper .search-results-wrapper"
    );

    searchResultsWrapper.addEventListener("click", function (e) {
      const clicked = e.target.closest(`${parentEventTarget}[data-name]`);

      if (
        e.target.classList.contains("card-heart") ||
        e.target.classList.contains("search-result-card-btn") ||
        !clicked
      )
        return;

      if (clicked) {
        const productName = clicked.getAttribute("data-name");
        handler(productName);
      }
    });
  }

  renderSectionHeading(catName) {
    const heading = document.querySelector(".section-heading");
    const title = catName[0].toUpperCase() + catName.slice(1);
    heading.innerHTML = title;
    heading.classList.add("categ");
  }
}

export default new searchResultsView();
