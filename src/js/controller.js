import bannerSliderView from "./views/bannerSliderView";
import categoriesView from "./views/categoriesView";
import searchResultsView from "./views/searchResultsView";
import productView from "./views/productView";
import instantResultsView from "./views/instantResultsView";
import * as model from "./model";
import favouritesView from "./views/favouritesView";
import cartView from "./views/cartView";

const controlInstantResults = function (q) {
  model.clearFoundProducts();
  instantResultsView.clearWindow();
  model.loadInstantResults(q);
  model.state.products.forEach(function (pr) {
    model.state.foundProducts.forEach(function (product) {
      if (product === pr.name) {
        instantResultsView.renderProductCard(pr);
      }
    });
  });
  searchResultsView.activateSearchBtn(showSearchResults);
};

const renderFav = function () {
  favouritesView.clearWindow();
  model.state.favourites.forEach(function (favProduct) {
    model.state.products.forEach(function (pr) {
      if (favProduct === pr.name) {
        favouritesView.renderSearchResults(pr);
        favouritesView.renderSlides(pr);
        favouritesView.activateSlider(pr);
        favouritesView.activateHeart(
          pr,
          model.removeFavourites,
          refreshFavNumber
        );
        favouritesView.renderActiveHeart(pr);
        favouritesView.activateBuyBtn(pr, model.loadCart, refreshCartNumber);
        model.state.cart.forEach(function (cartProd) {
          if (cartProd.name === pr.name) {
            favouritesView.renderAddedBtn(pr);
          }
        });
      }
    });
  });
};

const renderCart = function () {
  cartView.clearWindow();
  model.state.cart.forEach(function (cartProduct) {
    model.state.products.forEach(function (pr) {
      if (cartProduct.name === pr.name) {
        cartView.renderSearchResults(pr);
        cartView.renderSlides(pr);
        cartView.activateSlider(pr);
        cartView.activateHeart(
          pr,
          model.loadFavourites,
          model.removeFavourites,
          refreshFavNumber
        );
        cartView.activateRemoveBtn(pr, model.removeCart, refreshCartNumber);
        model.state.favourites.forEach(function (favProd) {
          if (favProd === pr.name) {
            cartView.renderActiveHeart(pr);
          }
        });
        cartView.activateQuantSetter(
          pr,
          cartProduct.quantity,
          model.changeCartQuantity
        );
      }
    });
  });
};

const showSearchResults = function () {
  searchResultsView.hideSearchPopup();
  searchResultsView.renderSearchResultsParent(model.state.query);
  searchResultsView.addEventToCard(showProductPage);
  model.state.foundProducts.forEach(function (product) {
    model.state.products.forEach(function (pr) {
      if (product === pr.name) {
        searchResultsView.renderSearchResults(pr);
        searchResultsView.renderSlides(pr);
        searchResultsView.activateSlider(pr);
        searchResultsView.activateHeart(
          pr,
          model.loadFavourites,
          model.removeFavourites,
          refreshFavNumber
        );
        model.state.favourites.forEach(function (favProd) {
          if (favProd === product) {
            searchResultsView.renderActiveHeart(pr);
          }
        });
        searchResultsView.activateBuyBtn(pr, model.loadCart, refreshCartNumber);

        model.state.cart.forEach(function (cartProd) {
          if (cartProd.name === product) {
            searchResultsView.renderAddedBtn(pr);
          }
        });
      }
    });
  });
};

const showProductsByCategory = function (catName) {
  searchResultsView.renderSearchResultsParent();
  searchResultsView.renderSectionHeading(catName);
  searchResultsView.addEventToCard(showProductPage);
  model.state.products.forEach(function (pr) {
    if (pr.category === catName) {
      searchResultsView.renderSearchResults(pr);
      searchResultsView.renderSlides(pr);
      searchResultsView.activateSlider(pr);
      searchResultsView.activateHeart(
        pr,
        model.loadFavourites,
        model.removeFavourites,
        refreshFavNumber
      );
      model.state.favourites.forEach(function (favProd) {
        if (favProd === pr.name) {
          searchResultsView.renderActiveHeart(pr);
        }
      });
      searchResultsView.activateBuyBtn(pr, model.loadCart, refreshCartNumber);

      model.state.cart.forEach(function (cartProd) {
        if (cartProd.name === pr.name) {
          searchResultsView.renderAddedBtn(pr);
        }
      });
    }
  });
};

const showProductPage = function (objName) {
  productView.hideSearchPopup();
  model.loadObjectByName(objName);
  const obj = model.state.productToRender;
  productView.render(obj);
  productView.renderSlides(obj);
  productView.activateSlider(obj);
  productView.activateButtons();
  productView.activateTabContent();
  productView.activateHeart(
    obj,
    model.loadFavourites,
    model.removeFavourites,
    refreshFavNumber
  );
  productView.activateBuyBtn(obj, model.loadCart, refreshCartNumber);
  model.state.favourites.forEach(function (favProd) {
    if (favProd === objName) {
      productView.renderActiveHeart(obj);
    }
  });
  model.state.cart.forEach(function (cartProd) {
    if (cartProd.name === objName) {
      productView.renderAddedBtn(obj);
    }
  });
};

const refreshFavNumber = function () {
  favouritesView.setFavNum(model.state.favourites.length);
};

const refreshCartNumber = function () {
  cartView.setCartNum(model.state.cart.length);
  if (model.state.cart.length !== 0) {
    cartView.renderTotalSum();
  } else {
    cartView.clearTotalSum();
  }
};

const init = async function () {
  try {
    await model.loadAllProducts();
    bannerSliderView.render();
    bannerSliderView.activateSlider();
    categoriesView.render();
    categoriesView.activateCategoryBtn(showProductsByCategory);
    instantResultsView.activateInstantPopup(controlInstantResults);
    instantResultsView.addEventToCard(showProductPage);
    favouritesView.activateFavPopup(
      renderFav,
      showSearchResults,
      showProductPage,
      refreshFavNumber,
      showProductsByCategory
    );
    favouritesView.addEventToCard(showProductPage);
    cartView.activateCartPopup(
      renderCart,
      showSearchResults,
      showProductPage,
      refreshFavNumber,
      refreshCartNumber,
      showProductsByCategory
    );
    cartView.addEventToCard(showProductPage);
  } catch (err) {
    console.log(err);
  }
};

init();
