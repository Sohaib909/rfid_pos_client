import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee } from '../../slices/employeeSlice';
import './style/AddEmployee.css';
import { useRouter } from '../../routes/hooks';
import EmployeeForm from '../../components/forms/employee-form';


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
    console.log('Current store in Redux (AddEmployee):', currentStore);
  }, [currentStore]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentStore || !currentStore._id) {
      setStoreError('Please select a store before adding an employee.');
      return;
    }
    setStoreError('');
    dispatch(createEmployee(formData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        history.push('/employees');
      }
    });
  };

  return (
    <EmployeeForm
      formData={formData}
      setFormData={setFormData}
      status={status}
      error={storeError || error}
      formType="Create"
      handleSubmit={(event) => handleSubmit(event)}
    />
  );
};

export default AddEmployee;
