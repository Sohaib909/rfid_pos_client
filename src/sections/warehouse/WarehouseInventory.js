import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWarehouseInventory,
  transferWarehouseToStore,
  transferStoreToStore
} from '../../slices/productTransferSlice';
import {
  Box,
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';

import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import TableNoData from '../../components/table/table-no-data';
import MTableHead from '../../components/table/table-head';
import TableEmptyRows from '../../components/table/table-empty-rows';
import { emptyRows } from '../../components/table/utils';

const WarehouseInventory = () => {
  const dispatch = useDispatch();
  const warehouseInventory = useSelector((state) => state.productTransfer.warehouseInventory);
  const stores = useSelector((state) => state.store.stores);
  const status = useSelector((state) => state.productTransfer.status);
  const error = useSelector((state) => state.productTransfer.error);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [transferDialog, setTransferDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transferQuantity, setTransferQuantity] = useState('');
  const [selectedStore, setSelectedStore] = useState('');

  useEffect(() => {
    dispatch(fetchWarehouseInventory());
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleTransferClick = (product) => {
    setSelectedProduct(product);
    setTransferDialog(true);
  };

  const handleTransferSubmit = async () => {
    if (!selectedProduct || !selectedStore || !transferQuantity) return;

    await dispatch(transferWarehouseToStore({
      productId: selectedProduct.id,
      toStoreId: selectedStore,
      quantity: parseInt(transferQuantity, 10)
    }));

    setTransferDialog(false);
    setSelectedProduct(null);
    setTransferQuantity('');
    setSelectedStore('');
    dispatch(fetchWarehouseInventory());
  };

  const retailStores = stores.filter(store => store.type === 'retail');

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Warehouse Inventory</Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <MTableHead
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'sku', label: 'SKU' },
                  { id: 'quantity', label: 'Quantity' },
                  { id: 'category', label: 'Category' },
                  { id: '', label: 'Actions' }
                ]}
              />
              <TableBody>
                {warehouseInventory
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleTransferClick(product)}
                          disabled={product.quantity === 0}
                        >
                          Transfer to Store
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, warehouseInventory.length)}
                />

                {warehouseInventory.length === 0 && <TableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={warehouseInventory.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Dialog open={transferDialog} onClose={() => setTransferDialog(false)}>
        <DialogTitle>Transfer Product to Store</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Product: {selectedProduct?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Available Quantity: {selectedProduct?.quantity}
            </Typography>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Store</InputLabel>
              <Select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                label="Select Store"
              >
                {retailStores.map((store) => (
                  <MenuItem key={store._id} value={store._id}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              sx={{ mt: 2 }}
              label="Quantity to Transfer"
              type="number"
              value={transferQuantity}
              onChange={(e) => setTransferQuantity(e.target.value)}
              inputProps={{ min: 1, max: selectedProduct?.quantity }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransferDialog(false)}>Cancel</Button>
          <Button
            onClick={handleTransferSubmit}
            variant="contained"
            disabled={!selectedStore || !transferQuantity || transferQuantity <= 0}
          >
            Transfer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WarehouseInventory; 