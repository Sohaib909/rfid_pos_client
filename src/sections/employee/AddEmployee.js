import React, { useState } from 'react';
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

  const dispatch = useDispatch();
  const status = useSelector((state) => state.employee.status);
  const error = useSelector((state) => state.employee.error);
  const history = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
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
      error={error}
      formType="Create"
      handleSubmit={(event) => handleSubmit(event)}
    />
  );
};

export default AddEmployee;
