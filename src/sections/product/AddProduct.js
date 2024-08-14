import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../slices/productSlice';
import './style/ProductForm.css';
import { useRouter } from '../../routes/hooks';
import ProductForm from '../../components/forms/product-form';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    category: '',
    supplierName: '',
    supplierContact: '',
    quantity: ''
  });

  const dispatch = useDispatch();
  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);
  const history = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProduct(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        history.push('/products');
      }
    });
  };

  return (
    <ProductForm
      formData={formData}
      setFormData={setFormData}
      status={status}
      error={error}
      formType="Create"
      handleSubmit={(event) => handleSubmit(event)}
    />
  );
};

export default AddProduct;
