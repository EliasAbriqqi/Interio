import View from "./View";

class categoriesView extends View {
  _parentElement = document.querySelector(".section-parent-two");

  _generateMarkup() {
    return `<div class="categories-cards-wrapper">
      <div class="categories-card">
        <h3>Chairs</h3>
        <div class="categories-card-image-block card-image1"></div>
      </div>
      <div class="categories-card">
        <h3>Tables</h3>
        <div class="categories-card-image-block card-image2"></div>
      </div>
      <div class="categories-card">
        <h3>Bookcases</h3>
        <div class="categories-card-image-block card-image3"></div>
      </div>
      <div class="categories-card">
        <h3>Beds</h3>
        <div class="categories-card-image-block card-image4"></div>
      </div>
      <div class="categories-card">
        <h3>Sofas</h3>
        <div class="categories-card-image-block card-image5"></div>
      </div>
      <div class="categories-card">
        <h3>Light</h3>
        <div class="categories-card-image-block card-image6"></div>
      </div>
    </div>`;
  }
}

export default new categoriesView();
