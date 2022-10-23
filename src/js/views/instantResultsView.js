import View from "./View";
import { PIC_HOST } from "../config";

class instantResultsView extends View {
  _parentElement = document.querySelector(".search-popup-products");
  _card = document.querySelector(".search-popup-wrapper");
  _parentEventTarget = ".search-popup-product-wrapper";

  _generateMarkup(obj) {
    return `<div class="search-popup-product-wrapper" data-name="${obj.name}">
    <div class="search-popup-product-pic"><image src="${PIC_HOST}${obj.pics[0]}" class="product-pic-img"/></div>
    <div class="search-popup-product-details">
      <h3>${obj.name}</h3>
      <p>${obj.description}</p>
      <p>${obj.price}$</p>
    </div>
  </div>`;
  }

  activateInstantPopup(handler) {
    const inputBar = document.querySelector(".search-input");
    const searchPopupWindow = document.querySelector(".search-popup-wrapper");
    const veil = document.querySelector(".veil");
    const mainHeader = document.querySelector(".main-header");
    const mobileSearchPopup = document.querySelector(".search-popup-input");
    const mobileBackBtn = document.querySelector(".search-input-back");
    const mobileEraseBtn = document.querySelector(".search-input-erase");

    const hidePopup = function () {
      searchPopupWindow.classList.remove("search-popup-show");
      mainHeader.classList.remove("active-header");
      veil.style.display = "none";
      document.documentElement.style.overflowY = "unset";
    };

    // Mobile Input
    if (window.matchMedia("(max-width: 767px)").matches) {
      const hideMobilePopup = function () {
        searchPopupWindow.classList.remove("search-popup-show");
        document.documentElement.style.overflowY = "unset";
        veil.style.display = "none";
        mobileSearchPopup.value = "";
      };

      inputBar.addEventListener("click", function (e) {
        e.preventDefault();
        searchPopupWindow.classList.add("search-popup-show");
        document.documentElement.style.overflowY = "hidden";
        veil.style.display = "block";
        mobileSearchPopup.focus();
      });

      mobileBackBtn.addEventListener("click", hideMobilePopup);
      mobileEraseBtn.addEventListener("click", function () {
        mobileSearchPopup.value = "";
        mobileSearchPopup.focus();
        document.querySelector(".search-popup-products").innerHTML = "";
      });

      window.addEventListener("resize", hideMobilePopup);

      mobileSearchPopup.addEventListener("keyup", function (e) {
        if (!mobileSearchPopup.value.trim()) {
          document.querySelector(".search-popup-products").innerHTML = "";
          return;
        }

        const queryArray = e.target.value.toLowerCase().trim().split(" ");
        handler(queryArray);
      });
    }

    // Desktop Input
    if (window.matchMedia("(min-width: 768px)").matches) {
      inputBar.addEventListener("keyup", function (e) {
        if (!inputBar.value.trim()) {
          hidePopup();
          document.querySelector(".search-popup-products").innerHTML = "";
          return;
        }

        const queryArray = e.target.value.toLowerCase().trim().split(" ");

        if (inputBar.value.length > 1) {
          searchPopupWindow.classList.add("search-popup-show");
          mainHeader.classList.add("active-header");
          veil.style.display = "block";
          document.documentElement.style.overflowY = "hidden";
          handler(queryArray);
        }
      });

      document.addEventListener("keydown", function (e) {
        if (
          searchPopupWindow.classList.contains("search-popup-show") &&
          e.key === "Escape"
        ) {
          hidePopup();
          inputBar.blur();
        }
      });

      veil.addEventListener("click", function () {
        if (searchPopupWindow.classList.contains("search-popup-show")) {
          hidePopup();
          inputBar.blur();
        }
      });

      window.addEventListener("resize", hidePopup);
    }
  }
}

export default new instantResultsView();
