import React, {useState} from 'react';
import {
    MoreOutlined,
    EditOutlined,
    DeleteOutlined,
    DownloadOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import {Dropdown, Space, Modal, type MenuProps, message} from 'antd';
import {useAuth} from "../../../context/AuthContext.tsx";
import {useTranslation} from "react-i18next";
import queryClient from "../../../services/queryClients.ts";
import {createPortal} from "react-dom";

interface Props {
    onEdit?: () => void;
    onDelete?: () => Promise<void>;
    onDownloadAllProducts?: () => Promise<void>;
    disable?: boolean;
}

const ActionDropdown: React.FC<Props> = ({onEdit, onDelete, onDownloadAllProducts, disable}) => {
    const {t} = useTranslation();
    const {isAdmin} = useAuth();

    const [downloading, setDownloading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [open, setOpen] = useState(false); // 👈 Dropdown holatini boshqarish

    const handleMenuClick: MenuProps['onClick'] = async ({key}) => {
        if (key === 'edit' && onEdit) {
            onEdit();
            setOpen(false);
        }

        if (key === 'delete' && onDelete) {
            Modal.confirm({
                title: t('delete_party'),
                content: t('are_you_sure_to_delete_party'),
                okText: t('yes'),
                okType: 'danger',
                cancelText: t('cancel'),
                onOk: async () => {
                    try {
                        setDeleting(true);
                        // ❗ Dropdownni yopmaymiz
                        await onDelete();
                        message.success(t('party_deleted_successfully'));
                        queryClient.invalidateQueries({queryKey: ['parties']});
                    } catch (err) {
                        message.error(err?.message || t("party_deleted_error"))
                        console.error("Delete error:", err);
                    } finally {
                        setDeleting(false);
                        setOpen(false);
                    }
                },
            });
            setOpen(false);
        }

        if (key === 'downloadAll' && onDownloadAllProducts) {
            try {
                setDownloading(true);
                // ❗ Dropdownni yopmaymiz
                await onDownloadAllProducts();
            } catch (err) {
                message.error(err?.message || t("file_upload_error"))
                console.error("Download error:", err);
            } finally {
                setDownloading(false);
                setOpen(false);
            }
        }
    };

    const items: MenuProps['items'] = [
        onEdit && {
            key: 'edit',
            icon: <EditOutlined/>,
            label: t('edit'),
        },
        isAdmin && onDownloadAllProducts && {
            key: 'downloadAll',
            icon: downloading ? <LoadingOutlined/> : <DownloadOutlined/>,
            label: t('download_products'),
            disabled: downloading,
        },
        onDelete && {
            key: 'delete',
            icon: deleting ? <LoadingOutlined/> : <DeleteOutlined/>,
            label: t('delete'),
            danger: true,
            disabled: deleting,
        },
    ].filter(Boolean) as MenuProps['items'];

    return (
        <Space size="middle">
            {
                open &&
                createPortal(
                    <div onClick={() => {
                        if (!deleting && !downloading) {
                            setOpen(false);
                        }
                    }} className={"fixed inset-0 z-50"}></div>,
                    document.body,
                )
            }
            <Dropdown
                disabled={disable}
                open={open}
                onOpenChange={(event) => {
                    if (event) {
                        setOpen(event)
                    }
                }} // 👈 Foydalanuvchi ochsa/yo‘psa boshqaramiz
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

export default ActionDropdown;
