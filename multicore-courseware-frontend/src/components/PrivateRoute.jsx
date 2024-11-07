import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PrivateRoute() {

    const { isAuthenticated } = useSelector(
        state => state.auth
    );

    // If authenticated, render child components, otherwise redirect to login
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;