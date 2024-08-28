import React from 'react';
import { useSelector } from 'react-redux';
import StoreDashboard from './StoreDashboard';
import SalesDashboard from './SalesDashboard';
import Employees from '../employee/EmployeeList';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'Admin':
      return <Employees />;
    case 'Manager':
      return <Employees />;
    case 'Sales Assistant':
      return <SalesDashboard />;
    default:
      return <SalesDashboard />;
      // return <div>No dashboard available for this role.</div>;
  }
};

export default Dashboard;
