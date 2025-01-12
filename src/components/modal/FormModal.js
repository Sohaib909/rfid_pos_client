import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton
} from '@mui/material';
import ProductSearch from '../shared/ProductSearch';
import CloseIcon from '@mui/icons-material/Close';

const FormModal = ({
  open,
  onClose,
  onSave,
  columns,
  selectedColumns,
  setSelectedColumns,
  setName,
  name,
  setModule,
  module,
  setFormat,
  format,
  handleGenerateReport,
  reportType,
  setReportType,
  handleModuleChange,
  duration,
  setDuration,
  selectedProducts,
  addProduct
}) => {
  const [productList, setProductList] = useState(selectedProducts || []);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setProductList(selectedProducts); // Sync with selectedProducts from parent
  }, [selectedProducts]);

  const handleSave = () => {
    onSave({ module, name, format, columns: selectedColumns, productList });
    setName('');
    setSelectedColumns([]);
    setModule('');
    setFormat('csv');
    setDuration('7'); // Default duration
    setReportType(module); // Update reportType when saving template
  };

  const handleColumnChange = (event) => {
    const value = event.target.name;
    setSelectedColumns((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((col) => col !== value)
        : [...prevSelected, value]
    );
  };

  const handleSelectAllClick = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked)
    if(checked){
      setSelectedColumns(columns.map((column) => column.original));
    }else{
      setSelectedColumns([]);
    }
    
  }

  const handleAddProduct = (product) => {
    if (product && !productList.some((p) => p.sku === product.sku)) { // Ensure the product is not already in the list
      setProductList([...productList, product]);
      addProduct(product);
    }
  };

  const handleRemoveProduct = (productToRemove) => {
    setProductList(productList.filter((product) => product.sku !== productToRemove.sku));
    addProduct(productToRemove, true);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Report</DialogTitle>
      <DialogContent style={{ minWidth: '600px' }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Module</InputLabel>
          <Select
            value={module}
            onChange={(e) => handleModuleChange(e)} // Use handleModuleChange here
            label="Module"
          >
            <MenuItem value="sale">Sales</MenuItem>
            <MenuItem value="product">Products</MenuItem>
          </Select>
        </FormControl>
        <Grid item display="flex">
          {module === 'product' && (
            <ProductSearch addItem={handleAddProduct} />
          )}
        </Grid>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {productList.map((product, index) => (
            product && (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#f0f0f0',
                  padding: '5px',
                  borderRadius: '8px',
                  marginRight: '10px',
                }}
              >
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  style={{ width: 50, height: 50, marginRight: 10 }}
                />
                <span>{product.name}</span>
                <IconButton
                  onClick={() => handleRemoveProduct(product)}
                  aria-label="remove"
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            )
          ))}
        </div>
        <TextField
          fullWidth
          style={{ marginTop: '30px' }}
          margin="normal"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            label="Type"
          >
            <MenuItem value="csv">CSV</MenuItem>
            <MenuItem value="xlsx">Excel</MenuItem>
          </Select>
        </FormControl>
        <FormControl component="fieldset" fullWidth margin="normal">
          <FormGroup>
            {columns.length > 0 && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllClick}
                    name="Select All"
                  />
                }
                label="Select All"
              />
            )}
            {columns.map((column) => (
              <FormControlLabel
                key={column.original}
                control={
                  <Checkbox
                    checked={selectedColumns.includes(column.original)}
                    onChange={handleColumnChange}
                    name={column.original}
                  />
                }
                label={column.readable}
              />
            ))}
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="secondary">
          Save Template
        </Button>
        <Button onClick={handleGenerateReport} color="primary">
          Generate Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormModal;
