import View from "./View";

class bannerSliderView extends View {
  _parentElement = document.querySelector(".section-parent-one");
  _slide = ".banner-slider .slide";
  _dotContainer = ".banner-slider-dots-wrapper";
  _dot = ".banner-slider-dots-wrapper .dot";

  _defineSlides() {
    return document.querySelectorAll(this._slide);
  }

  _defineDotContainer() {
    return document.querySelector(this._dotContainer);
  }

  _defineDot() {
    return document.querySelectorAll(this._dot);
  }

  _generateMarkup() {
    return `<div class="banner-slider slider">
    <div class="slide1 slide"></div>
    <div class="slide2 slide"></div>
    <div class="slide3 slide"></div>
    <div class="banner-slider-dots-wrapper">
    </div>
  </div>`;
  }
}

export default new bannerSliderView();
