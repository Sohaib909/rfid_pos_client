import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Typography,
  MenuItem,
  Menu,
  Stack,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Collapse,
  IconButton,
  Select,       
  FormControl,  
  InputLabel,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import FileDownload from 'js-file-download';
import FormModal from '../../components/modal/FormModal';
import './style/GenerateReport.css';
import { createTemplate, fetchTemplates, downloadReport } from '../../slices/reportSlice';
import { useDispatch, useSelector } from 'react-redux';

const GenerateReport = () => {
  const [format, setFormat] = useState('csv');
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportType, setReportType] = useState('');
  const [openTemplates, setOpenTemplates] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [name, setName] = useState('');
  const [module, setModule] = useState('');
  const [dateFilter, setDateFilter] = useState("7");
  const [selectedProducts, setSelectedProducts] = useState([]);

  // const [templates, setTemplates] = useState([]);
  const templates = useSelector((state) => state.report.templates);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (module) {
      const fetchColumns = async () => {
        try {
          const response = await axios.get(`/${module}/columns`);
          setColumns(response.data);
        } catch (error) {
          console.error('Error fetching columns:', error);
        }
      };
      fetchColumns();
    }
  }, [module]);

  const handleGenerateReport = async (products = selectedProducts) => {
    if (!reportType || !selectedColumns.length || !name) {
      console.error('Report type, columns, or name are not set.');
      return;
    }

    try {
      const data = {
        params: { columns: selectedColumns.join(','),
        dateFilter,
        productSkus: selectedProducts.map(product => product.sku).join(',') },
        responseType: 'blob',
        reportType,
        format
      }

      dispatch(downloadReport(data)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          FileDownload(result.payload, `${name}_report.${format}`);
        }
      });

    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleDownloadFromTemplate = async (template) => {
    if (!template.module || !template.columns.length) {
      console.error('Template is missing required data.');
      return;
    }

    try {

      const data = {
        params: { columns: template.columns.join(','),
        dateFilter: template.duration,
        productSkus: template.productSkus.join(',') },
        responseType: 'blob',
        reportType: template.module,
        format: template.format
      }

      dispatch(downloadReport(data)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          FileDownload(result.payload, `${template.name}_report.${template.format}`);
        }
      });

    } catch (error) {
      console.error('Error generating report from template:', error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setReportType('');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-menu' : undefined;

  const handleNewReport = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleAddProduct = (product, remove = false) => {
    if (remove) {
      setSelectedProducts(selectedProducts.filter(p => p.sku !== product.sku));
    } else if (product) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };


  const handleSaveTemplate = async () => {
    try {

      const data = {
        name,
        module: reportType,
        format,
        columns: selectedColumns,
        duration: dateFilter,
        productSkus: selectedProducts.map(product => product.sku),
      }

      dispatch(createTemplate(data)).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          dispatch(fetchTemplates());
        }
      });
      
      // Close the modal after saving
      handleModalClose();
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const toggleTemplates = () => {
    setOpenTemplates(!openTemplates);
  };

  // Handle module change and set reportType
  const handleModuleChange = (e) => {
    const selectedModule = e.target.value;
    setModule(selectedModule);
    setReportType(selectedModule); // Set reportType here
    setSelectedColumns([]);
    setSelectedProducts([]);
    setName("");
  };

  return (
    <Container className="generate-report-container">
      <Typography variant="h4">Reporting</Typography>
      <Box mt={10} mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center">
          <Typography variant="h6">Templates</Typography>
          <IconButton onClick={toggleTemplates}>
            {openTemplates ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center">
          <FormControl margin="normal" sx={{ mr: 2, mb: 1.5, minWidth: 150 }}>
            <InputLabel>Duration</InputLabel>
            <Select
              value={dateFilter} // Controlled value
              onChange={(e) => setDateFilter(e.target.value)}
              label="Duration"
              sx={{ height: '40px' }} // Adjust height to match the button
            >
              <MenuItem value="7">7 Days</MenuItem>
              <MenuItem value="15">15 Days</MenuItem>
              <MenuItem value="30">30 Days</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={handleNewReport} sx={{ height: '40px' }}>
            New Report
          </Button>
        </Box>
      </Box>
      
      <Collapse in={openTemplates} timeout="auto" unmountOnExit>
        <TableContainer component={Paper} className="templates-table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates ? templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.module}</TableCell>
                  <TableCell>{template.format}</TableCell>
                  <TableCell>{template.duration} Days</TableCell>
                  <TableCell>{template.productNames.join(', ')}</TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownloadFromTemplate(template)}
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              )) : []}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>

      <FormModal
        open={openModal}
        onClose={handleModalClose}
        onSave={handleSaveTemplate}
        columns={columns}
        selectedColumns={selectedColumns}
        setSelectedColumns={setSelectedColumns}
        setName={setName}
        name={name}
        setModule={setModule}
        module={module}
        setFormat={setFormat}
        format={format}
        handleGenerateReport={handleGenerateReport}
        reportType={reportType}
        setReportType={setReportType}
        handleModuleChange={handleModuleChange}
        duration={dateFilter}
        setDuration={setDateFilter}
        selectedProducts={selectedProducts}
        addProduct={(product, remove) => handleAddProduct(product, remove)}
      />
    </Container>
  );
};

export default GenerateReport;
