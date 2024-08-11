import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../../slices/productSlice';
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
} from '@mui/material';
import './style/AddProduct.css';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    category: '',
    supplierName: '',
    supplierContact: '',
    stockQuantity: '',
    stockUnit: '',
    imageUrl: '',
  });

  const dispatch = useDispatch();
  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createProduct(formData));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="name"
              label="Product Name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="sku"
              label="SKU"
              fullWidth
              value={formData.sku}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="price"
              label="Price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="category"
              label="Category"
              fullWidth
              value={formData.category}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="supplierName"
              label="Supplier Name"
              fullWidth
              value={formData.supplierName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="supplierContact"
              label="Supplier Contact"
              fullWidth
              value={formData.supplierContact}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="stockQuantity"
              label="Stock Quantity"
              type="number"
              fullWidth
              value={formData.stockQuantity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              name="stockUnit"
              label="Stock Unit"
              select
              SelectProps={{
                native: true,
              }}
              fullWidth
              value={formData.stockUnit}
              onChange={handleChange}
            >
              <option value=""></option>
              <option value="pcs">pcs</option>
              <option value="kg">kg</option>
              <option value="liters">liters</option>
              <option value="packs">packs</option>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="imageUrl"
              label="Image URL"
              fullWidth
              value={formData.imageUrl}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        {status === 'loading' && <Typography>Loading...</Typography>}
        {status === 'failed' && <Typography color="error">{error}</Typography>}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Product
        </Button>
      </form>
    </Container>
  );
};

export default AddProduct;
