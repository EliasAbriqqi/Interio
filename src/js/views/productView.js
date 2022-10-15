import View from "./View";
import { PIC_HOST } from "../config";

class productView extends View {
  _parentElement = document.querySelector("section");
  _cardsParentElement = ".product-card";
  _cardsElement = "";
  _parentEventTarget = ".product-card";
  _slide = ".product-card-pic";
  _dotContainer = ".product-card-dots-wrapper";
  _dot = ".product-card-dots-wrapper .dot";

  _defineSlides() {
    return document.querySelectorAll(this._slide);
  }

  _defineDotContainer() {
    return document.querySelector(this._dotContainer);
  }

  _defineDot() {
    return document.querySelectorAll(this._dot);
  }

  renderSlides(obj) {
    const slidesParent = document.querySelector(".product-card-pics");

    obj.pics.forEach(function (pic) {
      slidesParent.insertAdjacentHTML(
        "beforeend",
        `<div class="product-card-pic"><img src="${PIC_HOST}${pic}" class="product-card-pic-img"></div>`
      );
    });
  }

  _generateMarkup(obj) {
    return `<!-- Product card -->
    <div class="product-card" data-name="${obj.name}">
    <div class="product-card-dots-wrapper"></div>
      
      <div class="product-card-pics">
      <div class="card-heart"></div>
      </div>
        
        <div class="product-card-arrows">
          <div class="product-card-arrow product-card-arrow-left"></div>
          <div class="product-card-arrow product-card-arrow-right"></div>
        </div>
         
      
      <div class="product-card-description">
        <h2>${obj.name}</h2>
        <p>${obj.description.split(" ").slice(0, 4).join(" ")}</p>
        <p>Category: ${obj.category}</p>
        <p>Dimensions: ${obj.dimensions}</p>
        <p>Producer: ${obj.producer}</p>
        <div class="available-price-container">
          <div class="product-available-${obj.available}"></div>
          <div class="product-price">${(
            obj.price -
            (obj.price * obj.discount) / 100
          ).toFixed(2)}$</div>
        </div>
        <button class="product-card-btn">Add to cart</button>
      </div>
    </div>

    <!-- Tabbed content -->

    <div class="tabs-wrapper">
      <div class="tabs-row">
        <div class="tabs-label tab-active" data-tab="1">Overview</div>
        <div class="tabs-label" data-tab="2">Features</div>
        <div class="tabs-label" data-tab="3">Stores</div>
      </div>
      <div class="content-wrapper">
      <div class="tabs-content content-area-1 tabs-content-active">
        ${obj.overview}
      </div>
      <div class="tabs-content content-area-2">
      ${obj.features}
      </div>
      <div class="tabs-content content-area-3">
      ${obj.stores}
      </div>

      </div>
    </div>`;
  }

  activateButtons() {
    const btnLeft = document.querySelector(".product-card-arrow-left");
    const btnRight = document.querySelector(".product-card-arrow-right");
    const cardsParentElement = this._cardsParentElement;
    const sl = this._defineSlides();
    let curSlide;
    const maxSlide = sl.length;

    const goToSlide = function (slide) {
      sl.forEach(
        (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
      );
    };

    const dot = this._defineDot();
    const activateDots = function (slide) {
      dot.forEach((d) => {
        d.classList.remove("dot-active");
      });
      document
        .querySelector(`${cardsParentElement} .dot[data-slide='${slide}']`)
        .classList.add("dot-active");
    };

    const setCurSlide = function () {
      const activeDot = document.querySelector(
        `${cardsParentElement} .dot-active`
      );
      const activeDotIndex = activeDot.getAttribute("data-slide");
      curSlide = Number(activeDotIndex);
    };

    const nextSlide = function () {
      setCurSlide();
      if (curSlide === maxSlide - 1) {
        curSlide = 0;
      } else {
        curSlide++;
      }
      goToSlide(curSlide);
      activateDots(curSlide);
    };

    const prevSlide = function () {
      setCurSlide();
      if (curSlide === 0) {
        curSlide = maxSlide - 1;
      } else {
        curSlide--;
      }
      goToSlide(curSlide);
      activateDots(curSlide);
    };

    btnRight.addEventListener("click", nextSlide);
    btnLeft.addEventListener("click", prevSlide);
  }

  activateTabContent() {
    const tabs = document.querySelectorAll(".tabs-label");
    const tabsContainer = document.querySelector(".tabs-row");
    const tabsContent = document.querySelectorAll(".tabs-content");

    tabsContainer.addEventListener("click", function (e) {
      const clicked = e.target.closest(".tabs-label");
      if (!clicked) return;

      tabs.forEach((t) => {
        t.classList.remove("tab-active");
      });

      tabsContent.forEach((c) => c.classList.remove("tabs-content-active"));

      clicked.classList.add("tab-active");

      document
        .querySelector(`.content-area-${clicked.dataset.tab}`)
        .classList.add("tabs-content-active");
    });
  }

  activateBuyBtn(obj, handlerAddCart, refreshCartNum) {
    const addToCartBtn = document.querySelector(
      `.product-card .product-card-btn`
    );

    if (obj.available === false) {
      addToCartBtn.innerHTML = "Not available";
      addToCartBtn.classList.add("added");
    }

    addToCartBtn.addEventListener("click", function (e) {
      if (!addToCartBtn.classList.contains("added")) {
        handlerAddCart(obj);
        e.target.closest(".product-card-btn").innerHTML = "In cart";
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
    const thisBtn = thisCard.querySelector(".product-card-btn");

    if (!thisBtn.classList.contains("added")) {
      thisBtn.classList.add("added");
      thisBtn.innerHTML = "In cart";
    }
  }
}

export default new productView();
