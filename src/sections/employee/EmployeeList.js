import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, deleteEmployee } from '../../slices/employeeSlice';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import './style/EmployeeList.css';

import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { useRouter } from '../../routes/hooks';
import TableNoData from '../../components/table/table-no-data';
import MTableRow from '../../components/table/table-row';
import MTableHead from '../../components/table/table-head';
import TableEmptyRows from '../../components/table/table-empty-rows';
import MTableToolbar from '../../components/table/table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../components/table/utils';



const EmployeeList = () => {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employee.employees);
  const status = useSelector((state) => state.employee.status);
  const error = useSelector((state) => state.employee.error);
  const [searchTerm, setSearchTerm] = useState('');
  const history = useRouter();

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const filteredEmployees = employees.filter(employee =>
    `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewEmployee = () => {
    history.push('/employees/new');
  };

  const handleUpdateEmployee = (id) => {
    history.push(`/employees/${id}`);
  };

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = filteredEmployees.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: filteredEmployees,
    comparator: getComparator(order, orderBy),
    filterFields: ["name"],
    filterValue: filterName
  });

  const notFound = !dataFiltered.length && !!filterName;

  const removeEmployee = (id) => {
    dispatch(deleteEmployee(id));

  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Employees</Typography>

        <Button variant="contained" color="primary" onClick={handleNewEmployee} startIcon={<Iconify icon="eva:plus-fill" />}>
          New Employee
        </Button>
      </Stack>

      <Card>
        <MTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          searchPlaceholder="Search by name"
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <MTableHead
                order={order}
                orderBy={orderBy}
                rowCount={filteredEmployees.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'employeeId', label: 'Employee ID' },
                  { id: 'role', label: 'Role' },
                  { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
              {
                dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <MTableRow
                    rowLabel={[
                      { label: 'Name', value: `${row.firstName} ${row.lastName}`},
                      { label: 'Employee ID', value: row.employeeId},
                      { label: 'Role', value: row.role},
                      { label: 'Designation', value: row.employeeType},
                      { key: '', value: ''},
                    ]}
                    key={row.id}
                    selected={selected.indexOf(row.name) !== -1}
                    updateData={() => handleUpdateEmployee(row.id)}
                    handleClick= {(event) => handleClick(event, row.name)}
                    removeData={() => removeEmployee(row.id)}
                  />
                ))
              }
              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, filteredEmployees.length)}
              />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

export default EmployeeList;
