import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales } from '../../slices/storeSlice';
import { Container, Typography, Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Button } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import './style/SalesDashboard.css';

const SalesDashboard = () => {
  const dispatch = useDispatch();
  const { sales, status, error } = useSelector((state) => state.store);
  const { user } = useSelector((state) => state.auth);

  return (
    <Container className="dashboard-container">
      <Box className="dashboard-header">
        <Typography variant="h4">Hello {user.firstName} {user.lastName} 👋</Typography>
        <Typography variant="subtitle1">Good Morning</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="dashboard-card">
            <Typography variant="h6">Total Sale Amount</Typography>
            <Typography variant="h3">560</Typography>
            <Typography variant="body2">Update: July 16, 2023</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className="dashboard-card">
            <Typography variant="h6">Total Product</Typography>
            <Typography variant="h3">1050</Typography>
            <Typography variant="body2">Update: July 14, 2023</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className="dashboard-card">
            <Typography variant="h6">Subtotal</Typography>
            <Typography variant="h3">$166.50</Typography>
            <Typography variant="body2">Discounts: -$8.00</Typography>
            <Typography variant="body2">Tax: $11.20</Typography>
            <Typography variant="h4" className="total-amount">Total: $159.46</Typography>
          </Paper>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className="sales-table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>S.NO</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Product Family</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales ? sales.map((sale, index) => (
              <TableRow key={sale.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{sale.productName}</TableCell>
                <TableCell>{sale.sku}</TableCell>
                <TableCell>{sale.productFamily}</TableCell>
                <TableCell>
                  <IconButton><RemoveCircle /></IconButton>
                  {sale.quantity}
                  <IconButton><AddCircle /></IconButton>
                </TableCell>
                <TableCell>{sale.price}</TableCell>
                <TableCell>
                  <Button variant="contained" color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            )) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SalesDashboard;
