import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, updateProduct } from '../../slices/productSlice';
import './style/ProductForm.css';
import { useRouter } from '../../routes/hooks';
import { useParams } from 'react-router-dom';
import ProductForm from '../../components/forms/product-form';

const UpdateProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    category: '',
    supplierName: '',
    supplierContact: '',
    quantity: '',
    imgUrl: ''
  });

  const dispatch = useDispatch();
  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);
  const history = useRouter();

  useEffect(() => {
    dispatch(fetchProduct(id)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        const product = result.payload;
        setFormData(product)
      }
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({id, formData})).then((result) => {
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
      formType="Update"
      handleSubmit={(event) => handleSubmit(event)}
    />
  );
};

export default UpdateProduct;
