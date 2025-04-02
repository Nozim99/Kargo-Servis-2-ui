import React, {createContext, useState, useContext, ReactNode, useEffect} from 'react';
import useRouters from "../hooks/useRouters.ts";

export enum Roles {
    ADMIN = 'admin',
    WORKER = 'worker'
}

interface AuthContextProps {
    isAuthenticated: boolean;
    token: string | null;
    role: Roles | null;
    isAdmin: boolean;
    login: (token: string, role: Roles) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const {navigateTo} = useRouters();
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [token, setToken] = useState<string | null>(localStorage.getItem("token") || null);
    const [role, setRole] = useState<Roles | null>((localStorage.getItem("role") as Roles) || null);

    // useEffect(() => {
    //     // const storedToken = Cookies.get('token');
    //     const storedToken = localStorage.getItem("token");
    //     if (storedToken) {
    //         setToken(storedToken);
    //         setIsAuthenticated(true);
    //     }
    // }, []);

    const login = (newToken: string, role: Roles) => {
        setToken(newToken);
        setRole(role);
        setIsAuthenticated(true);
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', role);
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigateTo('/login');
    };

    const contextValue: AuthContextProps = {
        isAuthenticated,
        token,
        role,
        isAdmin: role === Roles.ADMIN,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};