import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts} from '../data/products.js';
import {loadCart} from '../data/cart.js';

function showCheckoutLoadingState() {
  const orderSummaryElement = document.querySelector('.js-order-summary');
  const paymentSummaryElement = document.querySelector('.js-payment-summary');

  if (orderSummaryElement) {
    orderSummaryElement.innerHTML = '<div class="checkout-status-message">Loading your order...</div>';
  }

  if (paymentSummaryElement) {
    paymentSummaryElement.innerHTML = '<div class="checkout-status-message">Loading payment summary...</div>';
  }
}

function showCheckoutErrorState() {
  const orderSummaryElement = document.querySelector('.js-order-summary');
  const paymentSummaryElement = document.querySelector('.js-payment-summary');

  if (orderSummaryElement) {
    orderSummaryElement.innerHTML = '<div class="checkout-status-message checkout-error-message">Unable to load your order right now. Please try again.</div>';
  }

  if (paymentSummaryElement) {
    paymentSummaryElement.innerHTML = '<div class="checkout-status-message checkout-error-message">Unable to load payment details right now.</div>';
  }
}

async function loadPage() {
  showCheckoutLoadingState();

  try {
    await loadProducts();
    await loadCart();
    renderOrderSummary();
    renderPaymentSummary();
  } catch (error) {
    console.log('Unexpected error. Please try again later.');
    showCheckoutErrorState();
  }
}

loadPage();
