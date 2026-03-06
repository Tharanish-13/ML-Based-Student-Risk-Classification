import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Fetch full user profile
                    const res = await api.get('/users/me');
                    setUser(res.data);
                    // Also update role in localStorage just in case
                    localStorage.setItem('role', res.data.role);
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
                    // If 401, logout
                    if (error.response && error.response.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role);
        setUser({ email, role: res.data.role, name: res.data.name });
        return res.data;
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/register', { name, email, password, role });
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role);
        setUser({ email, role: res.data.role, name: res.data.name });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
