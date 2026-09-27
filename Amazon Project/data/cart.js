export let cart = [];

function normalizeCartItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      productId: typeof item.productId === 'string' ? item.productId : '',
      quantity: Number.isFinite(item.quantity) ? Math.max(1, Number(item.quantity)) : 1,
      deliveryOptionId: typeof item.deliveryOptionId === 'string' ? item.deliveryOptionId : '1'
    }))
    .filter((item) => item.productId);
}

export function getCartCount() {
  return cart.reduce((total, cartItem) => total + (Number(cartItem.quantity) || 0), 0);
}

export function loadFromStorage() {
  try {
    const savedCart = JSON.parse(localStorage.getItem('cart'));
    cart = normalizeCartItems(savedCart);
  } catch (error) {
    cart = [];
  }

  if (cart.length === 0) {
    cart = [];
  }
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
  cart = normalizeCartItems(cart);

  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  cart = normalizeCartItems(cart).filter((cartItem) => cartItem.productId !== productId);
  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  cart = normalizeCartItems(cart);

  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (!matchingItem) {
    return;
  }

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

export async function loadCart(callback) {
  try {
    loadFromStorage();

    if (typeof callback === 'function') {
      callback();
    }

    return cart;
  } catch (error) {
    console.error('Unable to load cart from local storage.', error);

    if (typeof callback === 'function') {
      callback();
    }

    return cart;
  }
}

loadFromStorage();