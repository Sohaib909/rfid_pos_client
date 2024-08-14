import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, TextField, Button, Typography, Tabs, Tab, Box, Grid, Paper } from '@mui/material';

export default function ProductForm({
  formData,
  setFormData,
  status,
  error,
  formType,
  handleSubmit
}) {
  const [step, setStep] = useState(0);

  const handleStepChange = (e, delta) => {
    e.preventDefault();
    setStep(step + delta);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {formType} Product 
      </Typography>
      <Tabs value={step} onChange={(e, newValue) => setStep(newValue)}>
        <Tab label="Product Information" />
        <Tab label="Stock Information" />
      </Tabs>
      <form onSubmit={handleSubmit}>
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
              type="button"
              variant="contained"
              onClick={(event) => handleStepChange(event, -1)}
            >
              Back
            </Button>
          )}
          {step < 1 ? (
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={(event) => handleStepChange(event, 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          )}
        </Box>
      </form>
    </Container>
  );
}

ProductForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  status: PropTypes.string,
  error: PropTypes.string,
  handleSubmit: PropTypes.func,
};
