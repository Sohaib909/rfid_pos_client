import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployee, updateEmployee } from '../../slices/employeeSlice';
import './style/AddEmployee.css';
import { useRouter } from '../../routes/hooks';
import { useParams } from 'react-router-dom';
import EmployeeForm from '../../components/forms/employee-form';


const UpdateEmployee = () => {
  const { id } = useParams();
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
  const status = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);
  const history = useRouter();

  useEffect(() => {
    dispatch(fetchEmployee(id)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        const employee = result.payload;
        setFormData(employee)
      }
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEmployee({id, formData})).then((result) => {
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
      formType="Update"
      handleSubmit={(event) => handleSubmit(event)}
    />
  );
};

export default UpdateEmployee;
