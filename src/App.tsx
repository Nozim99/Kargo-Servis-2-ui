import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import "./App.css"
import {QueryClientProvider} from "react-query";
import queryClient from "./services/queryClients.ts";
import {AuthProvider} from "./context/AuthContext.tsx";
import AppRoutes from "./components/AppRoutes.tsx";
import './i18n.ts'


function App() {
    return (
        <Router>
            <AuthProvider>
                <QueryClientProvider client={queryClient}>
                    <div className="flex max-w-screen">
                        <AppRoutes/>
                    </div>
                </QueryClientProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;