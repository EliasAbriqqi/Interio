import { API_URL } from "./config.js";
import { getJSON } from "./helpers.js";

export const state = {
  products: [],
  foundProducts: [],
  catalogue: [],
  productToRender: {},
  query: "",
  favourites: [],
  cart: [],
};

export const loadAllProducts = async function () {
  try {
    const products = await getJSON(`${API_URL}`);
    products.forEach((el) => {
      state.products.push(el);
    });
  } catch (err) {
    console.error(`${err} !!!`);
    throw err;
  }
};

export const loadInstantResults = function (queryArr) {
  if (queryArr.length === 0) return;

  let foundProducts = [...state.products];
  let foundProductsDuplicate = [];
  let stateFoundProductsDuplicate = [];
  state.query = queryArr.join(" ");

  foundProducts.forEach(function (product) {
    state.foundProducts.push(product.name);
  });

  queryArr.forEach(function (query) {
    foundProducts.forEach(function (product, i) {
      const foundProduct = product.description.split(" ").find(function (word) {
        if (word.toLowerCase().includes(query)) {
          return true;
        }
      });

      if (foundProduct && product.name === state.foundProducts[i]) {
        stateFoundProductsDuplicate.push(product.name);
        foundProductsDuplicate.push(product);
      }
    });

    foundProducts = [...foundProductsDuplicate];

    state.foundProducts = [...stateFoundProductsDuplicate];
    foundProductsDuplicate.length = 0;
    stateFoundProductsDuplicate.length = 0;
  });
};

export const clearFoundProducts = function () {
  state.foundProducts.length = 0;
};

export const loadObjectByName = function (objName) {
  state.productToRender = state.products.find(function (product) {
    return product.name === objName;
  });
};

export const loadFavourites = function (objName) {
  state.favourites.push(objName);
};

export const removeFavourites = function (objName) {
  const objIndex = state.favourites.indexOf(objName);
  state.favourites.splice(objIndex, 1);
};

export const loadCart = function (obj) {
  const innerObj = {
    name: obj.name,
    quantity: 1,
  };
  state.cart.push(innerObj);
};

export const removeCart = function (objName) {
  const objIndex = state.cart.indexOf(objName);
  state.cart.splice(objIndex, 1);
};

export const changeCartQuantity = function (obj, quant) {
  state.cart.forEach(function (product) {
    if (product.name === obj.name) {
      product.quantity = quant;
    }
  });
};
