import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import RequireAuth from '../sections/auth/RequireAuth';

import DashboardLayout from '../layouts/dashboard';
import LoginReports from '../sections/reports/LoginReports.jsx';
export const Login = lazy(()=> import('../sections/auth/Login'));
export const Signup = lazy(()=> import('../sections/auth/Signup'));
export const Dashboard = lazy(()=> import('../sections/store/index.js'));
export const PrivateRoute = lazy(()=> import('../sections/PrivateRoutes'));
export const AddEmployee = lazy(()=> import('../sections/employee/AddEmployee'));
export const UpdateEmployee = lazy(()=> import('../sections/employee/UpdateEmployee'));
export const EmployeeList = lazy(()=> import('../sections/employee/EmployeeList'));
export const AddProduct = lazy(()=> import('../sections/product/AddProduct'));
export const UpdateProduct = lazy(()=> import('../sections/product/UpdateProduct'));
export const ProductList = lazy(()=> import('../sections/product/ProductList'));
export const GenerateReport = lazy(()=> import('../sections/reporting/GenerateReport'));
export const Page404 = lazy(() => import('../pages/page-not-found'));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <RequireAuth>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </RequireAuth>
      ),
      children: [
        { element: <RequireAuth><Dashboard /></RequireAuth>, index: true },
        { path: 'employees', element: <RequireAuth><EmployeeList /></RequireAuth> },
        { path: 'employees/:id', element: <RequireAuth><UpdateEmployee /></RequireAuth> },
        { path: 'products', element: <RequireAuth><ProductList /></RequireAuth> },
        { path: 'products/new', element: <RequireAuth><AddProduct /></RequireAuth> },
        { path: 'products/:id', element: <RequireAuth><UpdateProduct /></RequireAuth> },
        { path: 'employees/new', element: <RequireAuth><AddEmployee /></RequireAuth> },
        { path: 'reporting', element: <RequireAuth><GenerateReport /></RequireAuth> },
        { path: 'login-reports', element: <RequireAuth><LoginReports /></RequireAuth> },
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