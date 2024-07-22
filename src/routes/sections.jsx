import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from '../layouts/dashboard';
export const Login = lazy(()=> import('../sections/auth/Login'));
export const Signup = lazy(()=> import('../sections/auth/Signup'));
export const Dashboard = lazy(()=> import('../sections/store/index.js'));
export const PrivateRoute = lazy(()=> import('../sections/PrivateRoutes'));
export const AddEmployee = lazy(()=> import('../sections/employee/AddEmployee'));
export const EmployeeList = lazy(()=> import('../sections/employee/EmployeeList'));
export const AddProduct = lazy(()=> import('../sections/product/AddProduct'));
export const Page404 = lazy(() => import('../pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <Dashboard />, index: true },
        { path: 'employees', element: <EmployeeList /> },
        { path: 'products/new', element: <AddProduct /> },
        { path: 'employees/new', element: <AddEmployee /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'signup',
      element: <Signup />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
