import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, TextField, Button, Typography, Tabs, Tab, Box, Grid, Paper } from '@mui/material';

export default function EmployeeForm({
  formData,
  setFormData,
  status,
  error,
  formType,
  handleSubmit
}) {
  const [step, setStep] = useState(0);

  const handleStepChange = (e, delta) => {
    e.preventDefault();
    setStep(step + delta);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Container className="add-employee-container">
      <Typography variant="h4">{formType} Employee </Typography>
      <Tabs value={step} onChange={(e, newValue) => setStep(newValue)}>
        <Tab label="Personal Information" />
        <Tab label="Professional Information" />
        <Tab label="Account Access" />)
      </Tabs>
      <form onSubmit={handleSubmit}>
        {step === 0 && (
          <Box className="form-step">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="fname"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="mobileNumber"
                  label="Mobile Number"
                  name="mobileNumber"
                  autoComplete="tel"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="dateOfBirth"
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="gender"
                  label="Gender"
                  name="gender"
                  select
                  SelectProps={{ native: true }}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="maritalStatus"
                  label="Marital Status"
                  name="maritalStatus"
                  select
                  SelectProps={{ native: true }}
                  value={formData.maritalStatus}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="nationality"
                  label="Nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        {step === 1 && (
          <Box className="form-step">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="employeeType"
                  label="Select Employee Type"
                  name="employeeType"
                  select
                  SelectProps={{ native: true }}
                  value={formData.employeeType}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="role"
                  label="Select role"
                  name="role"
                  select
                  SelectProps={{ native: true }}
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value=""></option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales Assistant">Sales Assistant</option>
                </TextField>
              </Grid>
            </Grid>
          </Box>
        )}
        {step === 2 && (
          <Box className="form-step">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  disabled
                  onChange={handleChange}
                />
                {status === 'failed' && (
                  <div style={{ color: 'red', marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        <Box className="form-actions">
          {step > 0 && (
            <Button
              variant="contained"
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                setStep(step - 1);
              }}
            >
              Back
            </Button>
          )}
          {step < (formType == 'Update' ? 2 : 2) ? (
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.preventDefault(); // Prevent form submission
                setStep(step + 1);
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Submit
            </Button>
          )}
        </Box>
      </form>
    </Container>
  );
}

EmployeeForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  status: PropTypes.string,
  error: PropTypes.string,
  handleSubmit: PropTypes.func,
};
