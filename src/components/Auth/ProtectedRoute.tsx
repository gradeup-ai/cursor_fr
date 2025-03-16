import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [isAuth, setIsAuth] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const isAuthenticated = await AuthService.isAuthenticated();
                setIsAuth(isAuthenticated);
                setLoading(false);
            } catch {
                setIsAuth(false);
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (loading) {
        return <div className="text-center py-12">Проверка авторизации...</div>;
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 