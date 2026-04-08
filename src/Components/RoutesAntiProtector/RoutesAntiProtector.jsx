import React, { useContext } from 'react'
import { authContext } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom';

export default function RoutesAntiProtector({ children }) {

    const { userToken } = useContext(authContext);

    if (userToken) {
        return <Navigate to="/home" replace /> //imp
    }

    return (
        <>
            {children}
        </>
    )
}