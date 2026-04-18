import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    // You might want to fetch full user details here if needed
                    setUser(decoded);
                    // Or keep minimal info from token:
                    // setUser({ ...decoded, token });
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            localStorage.setItem('token', data.token);
            setUser(jwtDecode(data.token));
            return data;
        } catch (error) {
            console.error("AuthContext Login Error:", error);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post(`${API_BASE_URL}/auth/register`, userData);
            localStorage.setItem('token', data.token);
            setUser(jwtDecode(data.token));
            return data;
        } catch (error) {
            console.error("AuthContext Register Error:", error);
            throw error;
        }
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
