export let orders = [];

function normalizeOrder(order) {
  if (!order || typeof order !== 'object') {
    return null;
  }

  const cart = Array.isArray(order.cart)
    ? order.cart
    : Array.isArray(order.items)
      ? order.items
      : [];

  return {
    id: order.id || `order-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: order.createdAt || order.created || order.date || new Date().toISOString(),
    totalCents: Number(order.totalCents) || 0,
    cart: cart.map((item) => ({
      productId: typeof item.productId === 'string' ? item.productId : '',
      quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
      deliveryOptionId: typeof item.deliveryOptionId === 'string' ? item.deliveryOptionId : '1'
    })).filter((item) => item.productId)
  };
}

export function loadOrdersFromStorage() {
  try {
    const savedOrders = JSON.parse(localStorage.getItem('orders'));
    orders = Array.isArray(savedOrders)
      ? savedOrders.map(normalizeOrder).filter(Boolean)
      : [];
  } catch (error) {
    orders = [];
  }

  return orders;
}

export function addOrder(order) {
  const normalizedOrder = normalizeOrder(order);

  if (!normalizedOrder) {
    return;
  }

  orders = [normalizedOrder, ...orders];
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

loadOrdersFromStorage();