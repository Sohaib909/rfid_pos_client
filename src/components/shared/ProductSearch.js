import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { TextField, Autocomplete, Button } from '@mui/material';
import debounce from 'lodash.debounce';
import { searchProducts } from '../../slices/productSlice';
import ImageModal from '../modal/ImageModal';
import Iconify from '../../components/iconify';



export default function ProductSearch({ addItem }) {
  const dispatch = useDispatch();
  const [sku, setSku] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const handleProductsSearch = debounce(async (e) => {
    const searchText = e.target.value;
    setSku(searchText);
    if (searchText.length > 0) {
      dispatch(searchProducts(searchText)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          setFilteredProducts(result.payload);
        }
      });
    } else {
      setFilteredProducts([]);
    }
  }, 300);

  const handleAdd = () => {
    addItem(selectedProduct);
    resetData();
  };

  const resetData = () => {
    setSku('');
    setSelectedProduct(null);
    setFilteredProducts([])
  };

  const handleImageClick = (e, imageUrl) => {
    e.stopPropagation();
    setModalImage(imageUrl);
    setOpenImageModal(true);
  };

  const closeImageModal = () => {
    setOpenImageModal(false);
    setModalImage('');
  };

  return (
    <>
      <Autocomplete
        options={filteredProducts}
        disableCloseOnSelect
        getOptionLabel={(option) => `${option.name}`}
        filterOptions={(options, state) => 
          options.filter((option) =>
            option.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
            option.sku.toLowerCase().includes(state.inputValue.toLowerCase())
          )
        }
        renderOption={(props, option) => (
          <div {...props} style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
            <img 
              src={option.imgUrl}
              alt={option.name} 
              style={{ width: '40px', height: '40px', marginRight: '10px', objectFit: 'cover' }} 
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => handleImageClick(e, option.imgUrl)}
            />
            <div>
              <div style={{ fontWeight: 'bold' }}>{option.name}</div>
              <div style={{ color: 'gray' }}>SKU: {option.sku}</div>
            </div>
          </div>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add Product by Name or SKU"
            value={sku}
            onChange={handleProductsSearch}
            fullWidth
            margin="normal"
          />
        )}
        onChange={(event, newValue) => {
          setSelectedProduct(newValue);
        }}
        value={selectedProduct}
        style={{ width: '100%', paddingRight: "1rem" }}
      />
      <ImageModal
        openModal={openImageModal}
        imageUrl={modalImage}
        closeModal={closeImageModal}
      />
      <Button 
        disabled={!selectedProduct}
        variant="contained" 
        color="primary" 
        startIcon={<Iconify icon="eva:plus-fill" />} 
        onClick={handleAdd}
        style={{ margin: "16px 0 8px" }}
      >
        Add
      </Button>
    </>
  );
}

ProductSearch.propTypes = {
  addItem: PropTypes.func,
};
