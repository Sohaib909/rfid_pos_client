// utils/subdomain.js
export function getStoreConfig(storeId) {
  const user = JSON.parse(localStorage.getItem('user'))
  if(!storeId){
    storeId = user && user.store ? user.store.storeId : "" 
  }
  return {
    headers: {
      'X-StoreId': storeId,
    },
  };
}
