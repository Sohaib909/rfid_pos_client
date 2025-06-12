import React from 'react';
import { useSelector } from 'react-redux';
import StoreDashboard from './StoreDashboard';
import SalesDashboard from './SalesDashboard';
import Employees from '../employee/EmployeeList';
import WarehouseDashboard from './WarehouseDashboard';
import ProductTransfer from '../store/ProductTransfer';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const currentStore = useSelector((state) => state.store.currentStore);

  if (!user) {
    return null;
  }

  if (!currentStore) {
    return <StoreDashboard />;
  }

  if (currentStore.type === 'warehouse') {
    return <WarehouseDashboard />;
  }

  switch (user.role) {
    case 'Admin':
      return <Employees />;
    case 'Manager':
    case 'Sales Assistant':
    default:
      return <SalesDashboard />;
  }
};

export default Dashboard;
