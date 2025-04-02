import {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {LogoutOutlined} from "@ant-design/icons";
import {useAuth} from "../../context/AuthContext.tsx";
import {routes} from "../../services/routes.tsx";
import LngSwitcher from "./LngSwitcher.tsx";
import {useTranslation} from "react-i18next";

const Sidebar = () => {
    const {t} = useTranslation();
    const location = useLocation();
    const {logout, role} = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const menuList = routes.filter(item => item.on_dashboard && item.permission.includes(role));

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const isActiveHandler = (path: string) => {
        const currentRoute = menuList.find(item => item.path === path);

        if (currentRoute.allPath?.length) {
            for (const pathItem of currentRoute.allPath) {
                if (location.pathname === pathItem) return true;
            }
        }

        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Navbar (faqat mobil ko'rinishda) */}
            <div onClick={toggleSidebar}
                 className="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center rounded-br-lg cursor-pointer">
                <button className="text-2xl focus:outline-none bg-transparent!">
                    ☰
                </button>
            </div>

            {/* Sidebar */}
            {/*<div className={"bg-neutral-200 fixed top-0 left-0 h-screen"} >*/}
            <div className={"md:w-64"}>
                <div
                    className={`h-screen overflow-y-auto
          fixed top-0 left-0  w-full min-[340px]:w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out transform
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 sm:w-80 md:w-64
          z-50
        `}
                >
                    <div className={"min-h-[500px] relative h-full"}>
                        <div className="px-4 pt-10 pb-7">
                            <h1 className="text-2xl font-bold">Admin Panel</h1>
                        </div>
                        <ul className="text-lg font-medium">
                            {
                                menuList.map(item => {
                                    const isActive = isActiveHandler(item.path);
                                    return (
                                        <li key={item.path}
                                            className={`${isActive ? 'bg-[var(--light-white)] text-black' : 'hover:bg-gray-600'} duration-300 transition-colors`}
                                            onClick={toggleSidebar}>
                                            <Link className={"px-4 py-4 flex w-full items-center gap-[10px]"}
                                                  to={item.path}>
                                                <item.icon className={"text-[20px] lg:text-[25px]"}/>
                                                <span>{t(item.title)}</span>
                                            </Link>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <div className={"absolute bottom-0 w-full flex items-center justify-between px-[30px] mb-[20px] gap-[15px]"}>
                            <LngSwitcher />
                            <button
                                onClick={logout}
                                className={"flex justify-center gap-[6px] text-neutral-300  cursor-pointer hover:text-white transition-colors duration-300"}>
                                <LogoutOutlined/>
                                <span>{t('logout')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay (sidebar ochilganda fonni qoraytirish uchun) */}
            <div
                className={`${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-300 fixed inset-0 bg-black/20 backdrop-blur z-40 md:hidden`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
        </>
    );
};

export default Sidebar;