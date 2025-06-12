// utils/subdomain.js
import store from '../store';

export const getStoreConfig = (storeId) => {
  if (!storeId) {
    throw new Error('Store ID is required');
  }

  return {
    headers: {
      'X-Store-Id': storeId,
      'Content-Type': 'application/json'
    }
  };
};

export const getStoreFormDataConfig = (storeId) => {
  if (!storeId) {
    throw new Error('Store ID is required');
  }

  return {
    headers: {
      'X-Store-Id': storeId
    }
  };
};
