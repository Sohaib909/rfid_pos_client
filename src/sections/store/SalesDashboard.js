import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, Grid, Paper, Table, TableBody, TableContainer, Button, TextField, Autocomplete, Divider,Drawer, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Iconify from '../../components/iconify';
import './style/SalesDashboard.css';
import { fetchProductsDataForSales, createSale } from '../../slices/saleSlice';
import debounce from 'lodash.debounce';
import Scrollbar from '../../components/scrollbar';
import MTableRow from '../../components/table/table-row';
import MTableHead from '../../components/table/table-head';

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    customerName: '',
    customerContact: '',
    totalAmount: 0,
    paymentMethod: 'cash',
    items: []
  });
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [taxAmount, setTaxAmount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const subTotal = subTotalAmount();
    const amountIncTax = subTotal * 0.16;
    const totalAmount = subTotal + amountIncTax;
    setTaxAmount(amountIncTax);
    setFormData({
      ...formData,
      totalAmount: totalAmount
    });
  }, [formData.items]);


  const resetManualItemAddData = () => {
    setSku('');
    setQuantity(1);
    setSelectedProduct(null);
    setFilteredProducts([])
  };


  const handleProductsSearch = debounce(async (e) => {
    const searchText = e.target.value;
    setSku(searchText);
    if (searchText.length > 0) {
      dispatch(fetchProductsDataForSales(searchText)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          setFilteredProducts(result.payload);
        }
      });
    } else {
      setFilteredProducts([]);
    }
  }, 300);

  const addItemToCart = () => {
    const existingItem = formData.items.find((item) => item.sku === selectedProduct.sku);
    if (existingItem) {
      setFormData({
        ...formData,
        items: formData.items.map((item) => item.sku === selectedProduct.sku ? { ...item, quantity: item.quantity + quantity } : item)
      });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { ...selectedProduct, quantity }]
      });
    }
    resetManualItemAddData();
  };

  const handleQuantityChange = (sku, delta) => {
    setFormData({
      ...formData,
      items: formData.items.map(item =>
        item.sku === sku ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    });
    console.log('Items after quantity change:', formData);
  };

  const subTotalAmount = () => {
    return formData.items.reduce((total, item) => total + item.quantity * item.price, 0);
  };

  const saveSale = () => {
    dispatch(createSale(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        setDrawerOpen(false);
        setFormData({
          customerName: '',
          customerContact: '',
          totalAmount: 0,
          items: []
        })
      }
    });
  }

  const setCustomerInformation = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData)
  };

  const setPaymentMethod = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      paymentMethod: value,
    });
    console.log(formData)
  };

  const removeItemFromCart = (sku) => {
    const filteredItems = formData.items.filter(item => item.sku !== sku);
    setFormData({
      ...formData,
      items: filteredItems
    });
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <Container className="dashboard-container">
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Paper
            className="dashboard-card"
            style={{
              backgroundColor: '#7B61FF',
              color: 'white',
              padding: '16px',
              borderRadius: '8px'
            }}
          >
            <Grid container spacing={2}>
              {/* Left side with amounts */}
              <Grid item xs={12} md={12} display="flex">
                <Grid container direction="column" spacing={1} justifyContent="center">
                  <Grid item>
                    <Grid container justifyContent="space-between">
                      <Typography variant="body1">Subtotal</Typography>
                      <Typography variant="body1">${subTotalAmount().toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container justifyContent="space-between">
                      <Typography variant="body1">Tax</Typography>
                      <Typography variant="body1">${taxAmount.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <hr style={{ borderColor: 'white', margin: '8px 0' }} />
                  </Grid>
                  <Grid item>
                    <Grid container justifyContent="space-between">
                      <Typography variant="h6">Total</Typography>
                      <Typography variant="h6">${formData.totalAmount.toFixed(2)}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12} display="flex">
              <Button onClick={toggleDrawer(true)} color="primary" style={{ backgroundColor: 'white', borderRadius: '4px', width: '100%' }}>
                Checkout
              </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      <Grid item display="flex">
        <Autocomplete
          options={filteredProducts}
          getOptionLabel={(option) => `${option.sku}: ${option.name}`}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Add Product by SKU"
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
        <Button 
          disabled={!selectedProduct}
          variant="contained" 
          color="primary" 
          startIcon={<Iconify icon="eva:plus-fill" />} 
          onClick={addItemToCart}
          style={{ margin: "16px 0 8px" }}
        >
          Add
        </Button>
      </Grid>
      <Scrollbar>
        <TableContainer sx={{ overflow: 'unset' }}>
          <Table sx={{ minWidth: 800 }}>
            <MTableHead
              isSalesDashboard={true}
              headLabel={[
                { id: 'sr#', label: 'S.No' },
                { id: 'name', label: 'Product Name' },
                { id: 'sku', label: 'SKU' },
                { id: 'quantity', label: 'Quantity' },
                { id: 'price', label: 'Price' },
                { id: '' },
              ]}
            />
            <TableBody>
            {
              formData.items.map((item, index) => (
                <MTableRow
                  rowLabel={[
                    { label: 'S.No', value: index + 1},
                    { label: 'Product Name', value: item.name},
                    { label: 'SKU', value: item.sku},
                    { label: 'Quantity', value: item.quantity},
                    { label: 'Price', value: item.quantity * item.price},
                  ]}
                  key={index}
                  isSalesDashboard={true}
                  handleQuantityChange={(delta) => handleQuantityChange(item.sku, delta)}
                  removeData={() => removeItemFromCart(item.sku)}
                />
              ))
            }
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {formData.items && formData.items.length > 0 ? (
          <Box sx={{ width: 500, padding: 2 }} role="presentation">
            <Typography variant="h6" gutterBottom>Checkout</Typography>
            <TextField
              name="customerName"
              label="Customer Name (optional)"
              value={formData.customerName}
              onChange={setCustomerInformation}
              fullWidth
              margin="normal"
            />
            <TextField
              name="customerContact"
              label="Customer Contact (optional)"
              value={formData.customerContact}
              onChange={setCustomerInformation}
              fullWidth
              margin="normal"
            />
            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Payment Method</FormLabel>
              <RadioGroup
                aria-label="payment-method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={setPaymentMethod}
              >
                <FormControlLabel value="cash" control={<Radio />} label="Cash" />
                <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
              </RadioGroup>
            </FormControl>
            <Divider />
            <Typography variant="h6">Order Summary</Typography>
            <Box my={2}>
              {formData.items.map((item, index) => (
                <Box key={index} display="flex" justifyContent="space-between" mb={1}>
                  <Box>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="caption">Quantity: {item.quantity}</Typography>
                  </Box>
                  <Typography variant="body2">${(item.quantity * item.price).toFixed(2)}</Typography>
                </Box>
              ))}
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between" my={2}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">${subTotalAmount().toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" my={2}>
              <Typography variant="body1">Tax</Typography>
              <Typography variant="body1">${taxAmount.toFixed(2)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" my={2}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${formData.totalAmount.toFixed(2)}</Typography>
            </Box>
            <Button variant="contained" color="primary" fullWidth onClick={saveSale}>
              Confirm Checkout
            </Button>
          </Box>
        ) : (
          <Box sx={{ width: 500, padding: 2 }} role="presentation">
            <Typography variant="h6" gutterBottom>Cart is empty</Typography>
          </Box> 
          )
        }
      </Drawer>
    </Container>
  );
};

export default SalesDashboard;
