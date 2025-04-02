import api from "../../../utils/request_auth.ts";
import {Dropdown, Menu, type MenuProps, message, Space} from "antd";
import {
    DeleteOutlined,
    DownloadOutlined,
    EditOutlined,
    FolderViewOutlined,
    LoadingOutlined,
    MoreOutlined
} from "@ant-design/icons";
import React, {useState} from "react";
import useRouters from "../../../hooks/useRouters.ts";
import {useTranslation} from "react-i18next";
import {PacketStatus} from "../../../utils/constants.ts";
import {createPortal} from "react-dom";


interface IPacket {
    cargoId: string;
    id: string;
    partyId: string;
    partyName: string;
    passport: string;
    status: PacketStatus;
    priceOfItems: number;
    userFullName: string;
    countOfItems: number;
    weightOfItems: number;
    packetName: string;
    createdAt: Date,
    updatedAt: Date;
    __v: number;
    _id: string;
}


export const ActionDropdown = ({record}: { record: IPacket }) => {
    const {navigateTo} = useRouters()
    const {t} = useTranslation();

    const [open, setOpen] = useState(false);
    const [downloading, setDownloading] = useState(false)


    const handleMenuClick = async (e: any) => {
        if (e.key === 'view') {
            navigateTo(`/packets/view/${record._id}`)
        } else if (e.key === 'downloadExcel') {
            try {
                setDownloading(true);
                const response = await api.get('/packets/excel/' + record._id, {responseType: "blob"});
                const contentDisposition = response.headers['content-disposition'];
                let filename = `ПАКЕТ-${record?.packetName}.xlsx`;
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename=(.+)/);
                    if (filenameMatch && filenameMatch[1]) {
                        filename = filenameMatch[1];
                    }
                }

                // Create a blob URL (same as before)
                const url = window.URL.createObjectURL(new Blob([response.data]));

                // Create and click the <a> element (same as before)
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();

                // Cleanup (same as before)
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch (e) {
                message.error(e?.message || t(""))
            } finally {
                setDownloading(false);
                setOpen(false)
            }
        }
    };

    const items: MenuProps['items'] = [
        {
            key: 'view',
            icon: <FolderViewOutlined/>,
            label: t('view'),
        },
        {
            key: 'downloadExcel',
            icon: downloading ? <LoadingOutlined/> : <DownloadOutlined/>,
            label: t('download_excel'),
            disabled: downloading,
        },
    ].filter(Boolean) as MenuProps['items'];

    return (
        <Space size="middle">
            {
                open &&
                createPortal(
                    <div onClick={() => {
                        if (!downloading) {
                            setOpen(false);
                        }
                    }} className={"fixed inset-0 z-50"}></div>,
                    document.body,
                )
            }
            <Dropdown
                open={open}
                onOpenChange={(event) => event && setOpen(event)}
                menu={{items, onClick: handleMenuClick}}
                trigger={['click']}
            >
                <a onClick={e => e.preventDefault()}>
                    <MoreOutlined className="text-xl"/>
                </a>
            </Dropdown>
        </Space>
    );
};