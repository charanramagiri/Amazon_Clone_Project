import { getProduct, loadProducts, products } from '../data/products.js';

function formatArrivalDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

async function initializeTrackingPage() {
  const productId = new URLSearchParams(window.location.search).get('productId');

  if (!products.length) {
    await loadProducts();
  }

  const product = getProduct(productId);
  const deliveryDateElement = document.querySelector('.js-delivery-date');
  const productNameElement = document.querySelector('.js-product-name');
  const productImageElement = document.querySelector('.js-product-image');
  const quantityElement = document.querySelector('.js-product-quantity');

  if (!product) {
    if (deliveryDateElement) {
      deliveryDateElement.textContent = 'Tracking details are unavailable for this order.';
    }
    if (productNameElement) {
      productNameElement.textContent = 'No product found';
    }
    if (quantityElement) {
      quantityElement.textContent = 'Quantity: 1';
    }
    return;
  }

  if (deliveryDateElement) {
    deliveryDateElement.textContent = `Arriving on ${formatArrivalDate(3)}`;
  }

  if (productNameElement) {
    productNameElement.textContent = product.name;
  }

  if (productImageElement) {
    productImageElement.src = product.image;
    productImageElement.alt = product.name;
  }

  if (quantityElement) {
    quantityElement.textContent = 'Quantity: 1';
  }
}

initializeTrackingPage();
