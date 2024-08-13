import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, updateProduct } from '../../slices/productSlice';
import { Container, TextField, Button, Typography, Tabs, Tab, Box, Grid, Paper } from '@mui/material';
import './style/ProductForm.css';
import { useRouter } from '../../routes/hooks';
import { useParams } from 'react-router-dom';

const UpdateProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    id: '',
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
  const [step, setStep] = useState(0);
  const history = useRouter();

  useEffect(() => {
    console.log("aaa")
    dispatch(fetchProduct(id)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        const product = result.payload;
        setFormData(product)
      }
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    console.log("abc")
    e.preventDefault();
    dispatch(updateProduct(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        history.push('/products');
      }
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      <Tabs value={step} onChange={(e, newValue) => setStep(newValue)}>
        <Tab label="Product Information" />
        <Tab label="Stock Information" />
      </Tabs>
      <form>
        {step === 0 && (
          <Box className="form-step">
            <Grid container spacing={2}>
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
                  name="category"
                  label="Category"
                  fullWidth
                  value={formData.category}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        {step === 1 && (
          <Box className="form-step">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  name="quantity"
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={formData.quantity}
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
            </Grid>
          </Box>
        )}
        {status === 'loading' && <Typography>Loading...</Typography>}
        {status === 'failed' && <Typography color="error">{error}</Typography>}
        <Box className="form-actions">
          {step > 0 && (
            <Button
              variant="contained"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          {step < 1 ? (
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => setStep(step + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={(event) => handleSubmit(event)}
            >
              Submit
            </Button>
          )}
        </Box>
      </form>
    </Container>
  );
};

export default UpdateProduct;
