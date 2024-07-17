import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchEmployees } from '../../slices/employeeSlice';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Avatar,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import './style/EmployeeList.css';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee.employees);
  const status = useSelector((state) => state.employee.status);
  const error = useSelector((state) => state.employee.error);
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filteredEmployees = employees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = () => {
    history.push('/employees/new');
  };

  return (
    <Container>
      <div className="employee-list-header">
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          className="search-bar"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="actions">
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleClick} className="add-employee-button">
            Add New Employee
          </Button>

          <IconButton className="filter-button">
            <FilterListIcon />
            <span>Filter</span>
          </IconButton>
        </div>
      </div>
      {status === 'loading' && <Typography>Loading...</Typography>}
      {status === 'failed' && <Typography color="error">{error}</Typography>}
      {status === 'succeeded' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="employee-name-cell">
                      <Avatar src={employee.profilePicture} alt={employee.firstName} />
                      <span>{`${employee.firstName} ${employee.lastName}`}</span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <Button variant="outlined" className="status-button">
                      {employee.employeeType}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default EmployeeList;
