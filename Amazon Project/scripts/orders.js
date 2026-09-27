import { addToCart, getCartCount } from '../data/cart.js';
import { getDeliveryOption } from '../data/deliveryOptions.js';
import { getProduct, loadProducts, products } from '../data/products.js';
import { loadOrdersFromStorage } from '../data/orders.js';
import { formatCurrency } from './utils/money.js';

function updateCartQuantity() {
  const cartQuantityElement = document.querySelector('.js-cart-quantity');

  if (!cartQuantityElement) {
    return;
  }

  cartQuantityElement.textContent = getCartCount();
}

function getOrderTotalCents(order) {
  const cartItems = Array.isArray(order?.cart) ? order.cart : [];

  return cartItems.reduce((total, item) => {
    const product = getProduct(item.productId);

    if (!product) {
      return total;
    }

    const deliveryOption = getDeliveryOption(item.deliveryOptionId);
    return total + (product.priceCents * Number(item.quantity || 1)) + deliveryOption.priceCents;
  }, 0);
}

function formatOrderDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });
}

function formatDeliveryDate(deliveryDays) {
  const date = new Date();
  date.setDate(date.getDate() + deliveryDays);

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });
}

function buildOrderMarkup(order) {
  const orderItemsMarkup = (order.cart || []).map((item) => {
    const product = getProduct(item.productId);

    if (!product) {
      return '';
    }

    const deliveryOption = getDeliveryOption(item.deliveryOptionId);
    const deliveryDateText = formatDeliveryDate(deliveryOption.deliveryDays);

    return `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <div class="product-delivery-date">Arriving on: ${deliveryDateText}</div>
        <div class="product-quantity">Quantity: ${item.quantity}</div>
        <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?productId=${encodeURIComponent(product.id)}&orderId=${encodeURIComponent(order.id || '')}">
          <button type="button" class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  }).join('');

  const totalCents = Number(order.totalCents) || getOrderTotalCents(order);

  return `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${formatOrderDate(order.createdAt || Date.now())}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(totalCents)}</div>
          </div>
        </div>

        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id || 'unknown-order-id'}</div>
        </div>
      </div>

      <div class="order-details-grid">
        ${orderItemsMarkup}
      </div>
    </div>
  `;
}

function bindActions() {
  document.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);
      updateCartQuantity();
      window.location.href = 'checkout.html';
    });
  });
}

function renderOrders() {
  const ordersGrid = document.querySelector('.js-orders-grid');

  if (!ordersGrid) {
    return;
  }

  const orders = loadOrdersFromStorage();

  if (!orders.length) {
    ordersGrid.innerHTML = `
      <div class="empty-state">
        No orders yet. Add something to your cart and place an order to see it here.
      </div>
    `;
    return;
  }

  ordersGrid.innerHTML = orders.map(buildOrderMarkup).join('');
  bindActions();
}

async function initializeOrdersPage() {
  if (!products.length) {
    await loadProducts();
  }

  updateCartQuantity();
  renderOrders();
}

initializeOrdersPage();
