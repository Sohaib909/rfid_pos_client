import React from 'react';
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
  FormGroup
} from '@mui/material';

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
  handleModuleChange // Add this prop
}) => {
  const handleSave = () => {
    onSave({ module, name, format, columns: selectedColumns });
    setName('');
    setSelectedColumns([]);
    setModule('');
    setFormat('csv');
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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Report</DialogTitle>
      <DialogContent>
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
        <TextField
          fullWidth
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
