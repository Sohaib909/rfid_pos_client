import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee } from '../../slices/employeeSlice';
import './style/AddEmployee.css';
import { useRouter } from '../../routes/hooks';
import EmployeeForm from '../../components/forms/employee-form';
import { Alert } from '@mui/material';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: '',
    password: '',
    employeeType: '',
    role: '',
  });
  const [storeError, setStoreError] = useState('');

  const dispatch = useDispatch();
  const status = useSelector((state) => state.employee.status);
  const error = useSelector((state) => state.employee.error);
  const history = useRouter();
  const currentStore = useSelector((state) => state.store.currentStore);

  useEffect(() => {
    if (!currentStore || !currentStore._id) {
      setStoreError('Please select a store before adding an employee.');
    } else {
      setStoreError('');
    }
  }, [currentStore]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentStore || !currentStore._id) {
      setStoreError('Please select a store before adding an employee.');
      return;
    }
    setStoreError('');
    
    try {
      const resultAction = await dispatch(createEmployee(formData));
      if (createEmployee.fulfilled.match(resultAction)) {
        history.push('/employees');
      } else if (createEmployee.rejected.match(resultAction)) {
        setStoreError(resultAction.payload || 'Failed to create employee');
      }
    } catch (err) {
      setStoreError('An unexpected error occurred');
    }
  };

  return (
    <>
      {storeError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {storeError}
        </Alert>
      )}
      <EmployeeForm
        formData={formData}
        setFormData={setFormData}
        status={status}
        error={error}
        formType="Create"
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default AddEmployee;
