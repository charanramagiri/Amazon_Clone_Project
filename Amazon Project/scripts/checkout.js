import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {loadProducts} from '../data/products.js';
import {loadCart} from '../data/cart.js';
import { renderString } from './app.js';

function showCheckoutLoadingState() {
  renderString('.js-order-summary', '<div class="checkout-status-message">Loading your order...</div>');
  renderString('.js-payment-summary', '<div class="checkout-status-message">Loading payment summary...</div>');
}

function showCheckoutErrorState() {
  renderString('.js-order-summary', '<div class="checkout-status-message checkout-error-message">Unable to load your order right now. Please try again.</div>');
  renderString('.js-payment-summary', '<div class="checkout-status-message checkout-error-message">Unable to load payment details right now.</div>');
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
