import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, bulkUploadProducts } from '../../slices/productSlice';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

// import './style/ProductList.css';

import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import { useRouter } from '../../routes/hooks';
import TableNoData from '../../components/table/table-no-data';
import MTableRow from '../../components/table/table-row';
import MTableHead from '../../components/table/table-head';
import TableEmptyRows from '../../components/table/table-empty-rows';
import MTableToolbar from '../../components/table/table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../components/table/utils';
import { roles } from '../../utils/roles';
import { read, utils } from 'xlsx';
import Papa from 'papaparse';
import FileUploadIcon from '@mui/icons-material/FileUpload';



const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);
  const history = useRouter();
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [file, setFile] = useState(null); // File input state
  const [uploadError, setUploadError] = useState('');

  const userRole = user.role;
  const userRoles = roles;

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);


  const handleNewProduct = () => {
    history.push('/products/new');
  };

  const handleUpdateProduct = (id) => {
    history.push(`/products/${id}`);
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
      const newSelecteds = dataFiltered.map((n) => n.name);
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


  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    const fileType = uploadedFile.type;

    try {
      let parsedData = [];
      if (fileType === 'text/csv' || fileType === 'application/vnd.ms-excel') {
        // Parse CSV file
        const text = await uploadedFile.text();
        parsedData = Papa.parse(text, { header: true }).data;
      } else if (fileType.includes('spreadsheetml') || fileType.includes('excel')) {
        // Parse Excel file
        const buffer = await uploadedFile.arrayBuffer();
        const workbook = read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        parsedData = utils.sheet_to_json(sheet);
      } else {
        throw new Error('Unsupported file type');
      }

      // Dispatch bulk upload action
      dispatch(bulkUploadProducts(parsedData));
      setFile(null); // Clear file input
    } catch (error) {
      console.error(error);
      setUploadError('Failed to parse file. Please ensure it is a valid CSV or Excel file.');
    }
  };

  const dataFiltered = applyFilter({
    inputData: products,
    comparator: getComparator(order, orderBy),
    filterFields: ["name", "sku"],
    filterValue: filterName
  });

  const notFound = !dataFiltered.length && !!filterName;

  const removeProduct = (id) => {
    dispatch(deleteProduct(id));
  }


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Products</Typography>
        <div>
          <Button
            mb={5}
            variant="contained"
            color="secondary"
            component="label"
            startIcon={<FileUploadIcon />}
          >
            Bulk Upload Products
            <input
              hidden
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
          </Button>
        

          <Button variant="contained" color="primary" onClick={handleNewProduct} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Product
          </Button>
        </div>
      </Stack>

      <Card>
        <MTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          searchPlaceholder="Search by name or sku"
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <MTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'sku', label: 'SKU' },
                  { id: 'price', label: 'Price' },
                  { id: 'quantity', label: 'Quantity' },
                  { id: 'image', label: 'Image' },
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
                      { label: 'Name', value: `${row.name}`},
                      { label: 'Sku', value: row.sku},
                      { label: 'Price', value: row.price},
                      { label: 'Quantity', value: row.quantity},
                      { id: 'image', label: 'Image', value: row.imgUrl},
                    ]}
                    key={row.id}
                    selected={selected.indexOf(row.name) !== -1}
                    handleClick={(event) => handleClick(event, row.name)}
                    updateData={() => handleUpdateProduct(row.id)}
                    removeData={() => removeProduct(row.id)}
                    canEdit={roles[userRole]?.includes('edit_products')}
                    canDelete={roles[userRole]?.includes('delete_products')}
                  />
                ))
              }
              <TableEmptyRows
                height={77}
                emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
              />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

export default ProductList;
