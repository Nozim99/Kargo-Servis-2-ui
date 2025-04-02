import {Navigate, Route, Routes} from "react-router-dom";
import Login from "../views/Login";
import Sidebar from "./Sidebar";
import {routes} from "../services/routes.tsx";
import React from "react";
import {useAuth} from "../context/AuthContext.tsx";


interface Props {
    children?: React.ReactNode
}

const ProtectedRoute: React.FC<Props> = ({children}) => {
    const {isAuthenticated} = useAuth();

    return isAuthenticated ? <>{children}</> : <Navigate to="/login"/>;
};


export default function AppRoutes() {
    const {role} = useAuth();

    const filteredRoutes = routes.filter(item => item.permission.includes(role))


    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="*" element={
                <ProtectedRoute>
                    <div className={"absolute md:static"}>
                        <Sidebar/>
                    </div>
                    <div className="flex-1 w-[100px]">
                        <div className={"p-10 md:hidden pl-[80px] pt-[20px]"}>
                            <h1 className={"text-2xl font-bold"}>
                                Admin Panel
                            </h1>
                        </div>
                        <div className={"p-5 md:p-10 pt-0 md:pt-10 mx-auto"}>
                            <Routes>
                                {
                                    filteredRoutes.map((route, index) => (
                                        <Route key={index} path={route.path} element={route.element}/>
                                    ))
                                }
                                <Route path="*" element={<div>404: Page Not Found</div>}/>
                            </Routes>
                        </div>
                    </div>
                </ProtectedRoute>
            }/>
        </Routes>
    )
}