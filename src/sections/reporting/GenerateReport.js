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
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';
import FileDownload from 'js-file-download';
import FormModal from '../../components/form-modal/FormModal';
import './style/GenerateReport.css';

const GenerateReport = () => {
  const [format, setFormat] = useState('csv');
  const [anchorEl, setAnchorEl] = useState(null);
  const [reportType, setReportType] = useState('');
  const [templates, setTemplates] = useState([]);
  const [openTemplates, setOpenTemplates] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [name, setName] = useState('');
  const [module, setModule] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/report/templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    fetchTemplates();
  }, []);

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

  const handleGenerateReport = async () => {
    if (!reportType || !selectedColumns.length || !name) {
      console.error('Report type, columns, or name are not set.');
      return;
    }

    try {
      const response = await axios.get(`/report/${reportType}/${format}`, {
        params: { columns: selectedColumns.join(',') },
        responseType: 'blob',
      });
      FileDownload(response.data, `${name}_report.${format}`);
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
      const response = await axios.get(`/report/${template.module}/${template.format}`, {
        params: { columns: template.columns.join(',') },
        responseType: 'blob',
      });
      FileDownload(response.data, `${template.name}_report.${template.format}`);
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

  const handleSaveTemplate = async () => {
    try {
      const response = await axios.post('/report/template', {
        name,
        module: reportType,
        format,
        columns: selectedColumns,
      });
      console.log('Template saved:', response.data);

      // Fetch updated list of templates
      const fetchTemplates = async () => {
        try {
          const templatesResponse = await axios.get('/report/templates');
          setTemplates(templatesResponse.data);
        } catch (error) {
          console.error('Error fetching templates:', error);
        }
      };
      fetchTemplates();
      
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
        <Button variant="contained" color="primary" onClick={handleNewReport}>
          New Report
        </Button>
      </Box>
      
      <Collapse in={openTemplates} timeout="auto" unmountOnExit>
        <TableContainer component={Paper} className="templates-table-container">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Download</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.module}</TableCell>
                  <TableCell>{template.format}</TableCell>
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
              ))}
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
        handleModuleChange={handleModuleChange} // Pass handleModuleChange as prop
      />
    </Container>
  );
};

export default GenerateReport;
