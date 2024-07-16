import React from 'react';
import { useSelector } from 'react-redux';
import StoreDashboard from './StoreDashboard';
import SalesDashboard from './SalesDashboard';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'Admin':
      return <StoreDashboard />;
    case 'Manager':
      return <StoreDashboard />;
    case 'Sales Assistant':
      return <SalesDashboard />;
    default:
      return <SalesDashboard />;
      // return <div>No dashboard available for this role.</div>;
  }
};

export default Dashboard;
