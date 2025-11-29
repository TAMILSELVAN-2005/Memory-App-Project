import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const AuthContext = createContext();

// Use the same base URL as the rest of the client API so dev/prod behave the same
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                loading: false
            };
        case 'LOGIN_FAIL':
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false
            };
        case 'USER_LOADED':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const loadUser = useCallback(async () => {
        if (!state.token) {
            dispatch({ type: 'AUTH_ERROR' });
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            });
            
            if (response.ok) {
                const user = await response.json();
                dispatch({ type: 'USER_LOADED', payload: user });
            } else {
                dispatch({ type: 'AUTH_ERROR' });
            }
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR' });
        }
    }, [state.token]);

    // Load user on mount
    useEffect(() => {
        if (state.token) {
            loadUser();
        } else {
            dispatch({ type: 'AUTH_ERROR' });
        }
    }, [state.token, loadUser]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: 'LOGIN_SUCCESS', payload: data });
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({ type: 'LOGIN_SUCCESS', payload: data });
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const value = {
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
