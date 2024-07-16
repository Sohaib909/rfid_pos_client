import React from 'react';
import { NavLink } from 'react-router-dom';
import './style/SideNavbar.css';

const SideNavbar = () => {
  return (
    <div className="side-navbar">
      <div className="side-navbar-content">
        <div className="logo">
          <h1>POS</h1>
        </div>
        <nav className="menu">
          <NavLink to="/" activeClassName="active">Dashboard</NavLink>
          <NavLink to="/employees" activeClassName="active">All Employees</NavLink>
          <NavLink to="/departments" activeClassName="active">All Departments</NavLink>
          <NavLink to="/products" activeClassName="active">Product</NavLink>
          <NavLink to="/sales" activeClassName="active">Sale</NavLink>
          <NavLink to="/reporting" activeClassName="active">Reporting</NavLink>
          <NavLink to="/settings" activeClassName="active">Settings</NavLink>
        </nav>
      </div>
    </div>
  );
};

export default SideNavbar;
