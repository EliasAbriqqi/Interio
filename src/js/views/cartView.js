import View from "./View";

class cartView extends View {
  _parentElement = document.querySelector(".shopping-cart-wrapper");
  _cardsElement = " .shopping-cart-card";
  _cardsParentElement = ".shopping-cart-wrapper";
  _card = ".shopping-cart-card";
  _parentEventTarget = ".shopping-cart-card";
  _cartWrapper = document.querySelector(".shopping-cart-popup-wrapper");
  _parentTotalElement = document.querySelector(".shopping-cart-total-wrapper");

  _generateCardMarkup(obj) {
    return `
          <!-- card -->
          <div class="shopping-cart-card" data-name="${obj.name}">
            
          <div class="search-result-card-pic">
              <div class="search-result-pics-wrapper"></div>
              <div class="search-result-dot-wrapper"></div>
              <div class="card-heart"></div>
            </div>

            <div class="shopping-cart-card-middle-block">
              <h3>${obj.name}</h3>
              <p class="shopping-cart-card-description">${obj.description}</p> 
              <div class="shopping-cart-card-quantity-setter">
                <button class="quantity-minus-btn active">&minus;</button>
                <input
                  type="text"
                  name=""
                  class="quantity-input"
                  value="1"
                  maxlength="2"
                />
                <button class="quantity-plus-btn">&plus;</button>
              </div>
            </div>
            
            <div class="shopping-cart-card-last-block">
              <div class="shopping-cart-card-delete-btn">&times;</div>
              <div class="shopping-cart-card-price">${(
                obj.price -
                (obj.price * obj.discount) / 100
              ).toFixed(2)}$</div>
            </div>
          </div>
          
          <!-- card end -->
        `;
  }

  _generateTotalSumMarkup() {
    return `
      <div class="shopping-cart-total">
        <p>Total: <span class="shopping-cart-sum">262,99$</span></p>
      </div>
      <button class="shopping-cart-buy-btn">Buy</button>
    `;
  }

  renderTotalSum() {
    const markup = this._generateTotalSumMarkup();
    this._parentTotalElement.innerHTML = "";
    this._parentTotalElement.insertAdjacentHTML("beforeend", markup);
    this._activateTotalSum();

    const buyBtn = document.querySelector(".shopping-cart-buy-btn");
    const congratsPopup = document.querySelector(".congrats-popup-wrapper");
    const cartWrapper = document.querySelector(".shopping-cart-popup-wrapper");
    const cartVeil = document.querySelector(".gray-veil-cart");

    buyBtn.addEventListener("click", function () {
      congratsPopup.style.display = "block";
    });

    congratsPopup.addEventListener("click", function () {
      congratsPopup.style.display = "none";
    });
  }

  clearTotalSum() {
    this._parentTotalElement.innerHTML = "";
  }

  _activateTotalSum() {
    let sum = 0;

    const prices = document.querySelectorAll(".shopping-cart-card-price");
    const totalSum = document.querySelector(".shopping-cart-sum");

    prices.forEach(function (price) {
      sum = parseFloat(parseFloat(price.innerHTML).toFixed(2)) + sum;
    });

    totalSum.innerHTML = sum.toFixed(2) + "$";
  }

  activateCartPopup(
    handler,
    handlerRefreshSearchPage,
    handlerRefreshProductPage,
    refreshFavNum,
    refreshCartNum,
    showProductsByCat
  ) {
    const popupWindow = document.querySelector(".shopping-cart-popup-wrapper");
    const cartBtn = document.querySelector(".cart");
    const grayVeil = document.querySelector(".gray-veil-cart");
    const cartWrapper = document.querySelector(".shopping-cart-wrapper");
    const cartPopupCloseBtn = document.querySelector(
      ".shopping-cart-popup-close"
    );

    cartBtn.addEventListener("click", function () {
      popupWindow.style.display = "block";
      grayVeil.style.display = "block";
      document.documentElement.style.overflowY = "hidden";
      handler();
      refreshFavNum();
      refreshCartNum();
    });

    const removeCartPopup = function () {
      cartWrapper.innerHTML = "";
      popupWindow.style.display = "none";
      grayVeil.style.display = "none";
      document.documentElement.style.overflowY = "unset";

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

    grayVeil.addEventListener("click", removeCartPopup);
    cartPopupCloseBtn.addEventListener("click", removeCartPopup);
  }

  activateSlider(obj) {
    let curSlide = 0;
    const thisCard = document.querySelector(
      `${this._card}[data-name="${obj.name}"]`
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
  }

  activateHeart(obj, handlerAddFav, handlerRemoveFav, refreshFavNum) {
    const thisCard = document.querySelector(
      `${this._card}[data-name="${obj.name}"]`
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
        .closest(".shopping-cart-card")
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

  activateRemoveBtn(obj, handlerRemoveCart, refreshCartNum) {
    const thisCard = document.querySelector(
      `${this._card}[data-name="${obj.name}"]`
    );

    const thisCartCardRemove = thisCard.querySelector(
      ".shopping-cart-card-delete-btn"
    );

    thisCartCardRemove.addEventListener("click", function (e) {
      const productName = e.target
        .closest(".shopping-cart-card")
        .getAttribute("data-name");

      const cardToRemove = e.target.closest(".shopping-cart-card");

      cardToRemove.remove();
      handlerRemoveCart(productName);
      refreshCartNum();
    });
  }

  addEventToCard(handler) {
    const popupWindow = document.querySelector(".shopping-cart-popup-wrapper");
    const grayVeil = document.querySelector(".gray-veil-cart");
    const parentEventTarget = this._parentEventTarget;
    const parentElement = this._parentElement;

    this._parentElement.addEventListener("click", function (e) {
      const clicked = e.target.closest(`${parentEventTarget}[data-name]`);

      if (
        e.target.classList.contains("card-heart") ||
        e.target.classList.contains("shopping-cart-card-delete-btn") ||
        e.target.closest(".shopping-cart-card-quantity-setter")
      )
        return;

      if (clicked) {
        const productName = clicked.getAttribute("data-name");

        parentElement.innerHTML = "";
        popupWindow.style.display = "none";
        grayVeil.style.display = "none";
        document.documentElement.style.overflowY = "unset";

        handler(productName);
      }
    });
  }

  setCartNum(cartLength) {
    const cartNum = document.querySelector(".cart-num");
    const cartHeadingNum = document.querySelector(
      ".shopping-cart-heading-number"
    );
    const cartMessage = document.querySelector(".cart-message");

    cartHeadingNum.innerHTML = `${cartLength}`;
    cartNum.innerHTML = `${cartLength}`;

    if (cartLength === 0) {
      cartMessage.innerHTML = "Your shopping cart is empty";
    } else {
      cartMessage.innerHTML = "";
    }
  }

  activateQuantSetter(obj, quant, handler) {
    const thisCard = document.querySelector(
      `${this._card}[data-name="${obj.name}"]`
    );
    const quantWrapper = thisCard.querySelector(
      ".shopping-cart-card-quantity-setter"
    );
    const quantInput = thisCard.querySelector(".quantity-input");
    const quantMinus = thisCard.querySelector(".quantity-minus-btn");
    const cardPrice = thisCard.querySelector(".shopping-cart-card-price");
    const productPrice = parseFloat(
      thisCard.querySelector(".shopping-cart-card-price").innerHTML
    );

    const activateTotalSum = this._activateTotalSum;

    quantInput.value = quant;
    cardPrice.innerHTML = (productPrice * quant).toFixed(2) + "$";

    if (parseFloat(quantInput.value) <= 1) {
      quantMinus.classList.remove("active");
    }

    quantWrapper.addEventListener("click", function (e) {
      const clicked =
        e.target.closest(".quantity-minus-btn") ||
        e.target.closest(".quantity-plus-btn");
      if (!clicked) return;
      if (
        e.target.classList.contains("quantity-minus-btn") &&
        quantMinus.classList.contains("active")
      ) {
        quantInput.value = parseFloat(quantInput.value) - 1;
        cardPrice.innerHTML =
          (parseFloat(cardPrice.innerHTML).toFixed(2) - productPrice).toFixed(
            2
          ) + "$";
        if (parseFloat(quantInput.value) <= 1) {
          quantMinus.classList.remove("active");
        }
      }
      if (e.target.classList.contains("quantity-plus-btn")) {
        quantInput.value = parseFloat(quantInput.value) + 1;
        quantMinus.classList.add("active");
        cardPrice.innerHTML =
          (
            parseFloat(parseFloat(cardPrice.innerHTML).toFixed(2)) +
            productPrice
          ).toFixed(2) + "$";
      }

      handler(obj, quantInput.value);
      activateTotalSum();
    });
  }
}

export default new cartView();
