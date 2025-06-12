// utils/subdomain.js
import store from '../store';

export function getStoreConfig(storeId) {
  // Try Redux first
  const state = store.getState();
  let reduxStoreId = state.store?.currentStore?._id;
  if (!storeId && reduxStoreId) {
    storeId = reduxStoreId;
  }
  // Fallback to localStorage user.stores[0]
  if (!storeId) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.stores && user.stores.length > 0) {
      storeId = user.stores[0]._id || user.stores[0];
    } else if (user && user.store) {
      storeId = user.store.storeId || user.store._id;
    }
  }
  return {
    headers: {
      'X-StoreId': storeId,
    },
  };
}
