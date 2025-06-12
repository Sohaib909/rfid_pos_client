import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { selectStore } from '../../slices/storeSlice';

const StoreSelector = () => {
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.store.stores);
  const currentStore = useSelector((state) => state.store.currentStore);

  const handleStoreChange = (event) => {
    const storeId = event.target.value;
    dispatch(selectStore(storeId));
  };

  if (!stores || stores.length === 0) {
    return null;
  }

  return (
    <Box sx={{ minWidth: 200, m: 1 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="store-select-label">Select Store</InputLabel>
        <Select
          labelId="store-select-label"
          id="store-select"
          value={currentStore?._id || ''}
          label="Select Store"
          onChange={handleStoreChange}
        >
          {stores.map((store) => (
            <MenuItem key={store._id} value={store._id}>
              {store.name} ({store.type})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default StoreSelector; 