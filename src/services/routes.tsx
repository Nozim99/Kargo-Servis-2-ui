import React from "react";
import Dashboard from "../views/Dashboard";
import Parties from "../views/Parties";
import PartieCreate from "../views/Parties/PartieCreate";
import Products from "../views/Products";
import EditParty from "../views/Parties/EditParty";
import Packets from "../views/Packets/MainPacket";
import {Roles} from "../context/AuthContext.tsx";
import {AppstoreOutlined, DashboardOutlined, InboxOutlined, TruckOutlined} from "@ant-design/icons";
import {AntdIconProps} from "@ant-design/icons/es/components/AntdIcon";
import ViewPackets from "../views/Packets/ViewPacket";


interface IRoute {
    title?: string;
    icon?: React.ForwardRefExoticComponent<Omit<AntdIconProps, "ref"> & React.RefAttributes<HTMLSpanElement>>;
    path: string;
    element: React.ReactNode;
    on_dashboard?: true;
    permission: Roles[];
    allPath?: string[];
}


export const routes: IRoute[] = [
    {
        path: "/",
        element: <Dashboard/>,
        permission: [Roles.ADMIN, Roles.WORKER],
    },
    {
        allPath: ['/'],
        title: "dashboard",
        icon: DashboardOutlined,
        path: "/dashboard",
        element: <Dashboard/>,
        on_dashboard: true,
        permission: [Roles.ADMIN, Roles.WORKER],
    },
    {
        title: "parties",
        icon: TruckOutlined,
        path: "/parties",
        element: <Parties/>,
        on_dashboard: true,
        permission: [Roles.ADMIN, Roles.WORKER],
    },
    {
        path: "/parties/create",
        element: <PartieCreate/>,
        permission: [Roles.ADMIN, Roles.WORKER],
    },
    {
        path: "/parties/edit/:id",
        element: <EditParty/>,
        permission: [Roles.ADMIN, Roles.WORKER],
    },
    {
        title: "packets",
        icon: InboxOutlined,
        path: "/packets",
        element: <Packets/>,
        on_dashboard: true,
        permission: [Roles.ADMIN, Roles.WORKER],
    },
    {
        path: "/packets/view/:packetId",
        element: <ViewPackets/>,
        permission: [Roles.ADMIN, Roles.WORKER]
    },
    // {
    //     path: "/packet/create",
    //     element: <CreatePacket/>,
    //     permission: [Roles.ADMIN, Roles.WORKER],
    // },
    // {
    //     path: "/packet/edit/:id",
    //     element: <EditPacket/>,
    //     permission: [Roles.ADMIN, Roles.WORKER],
    // },
    {
        title: "products",
        icon: AppstoreOutlined,
        path: "/products",
        element: <Products/>,
        on_dashboard: true,
        permission: [Roles.ADMIN, Roles.WORKER],
    },
    // {
    //     title: "clients",
    //     icon: UserOutlined,
    //     path: "/clients",
    //     element: <ClientsPage/>,
    //     on_dashboard: true,
    //     permission: [Roles.ADMIN],
    // },
    // {
    //     path: "/clients/edit/:id",
    //     element: <EditClient/>,
    //     permission: [Roles.ADMIN],
    // },
    // {
    //     path: "/clients/view/:id",
    //     element: <ViewClient/>,
    //     permission: [Roles.ADMIN],
    // },
]