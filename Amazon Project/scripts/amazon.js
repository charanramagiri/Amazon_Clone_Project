import { addToCart, getCartCount } from "../data/cart.js";
import { products, loadProductsFetch } from "../data/products.js";
import { renderString } from "./app.js";
import { bindAll, qs } from "./utils/dom.js";

function updateCartQuantity() {
  const cartQuantity = getCartCount();
  const cartQuantityElement = qs(".js-cart-quantity");

  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = cartQuantity;
  }
}

function showProductsLoadingState() {
  renderString('.js-products-grid', `
    <div class="products-status products-loading">
      Loading products...
    </div>
  `);
}

function showProductsErrorState() {
  renderString('.js-products-grid', `
    <div class="products-status products-error">
      Something went wrong while loading products. Please try again.
    </div>
  `);
}

function buildProductsMarkup() {
  return products.map((product) => `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="${product.getStarsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select>
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `).join('');
}

function renderProducts() {
  if (!products.length) {
    showProductsErrorState();
    return;
  }

  renderString('.js-products-grid', buildProductsMarkup());
  bindAll('.js-add-to-cart', (event) => {
    const productId = event.currentTarget.dataset.productId;
    addToCart(productId);
    updateCartQuantity();
  });
}

showProductsLoadingState();

loadProductsFetch()
  .then(() => {
    if (!products.length) {
      showProductsErrorState();
      return;
    }

    renderProducts();
  })
  .catch(() => {
    showProductsErrorState();
  });
