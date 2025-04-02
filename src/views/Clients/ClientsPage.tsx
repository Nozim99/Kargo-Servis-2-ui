import React, {useState, useEffect} from 'react';
import {Table, Input, Space, Tooltip, Dropdown, Menu, message, Modal, Row, Col, Pagination} from 'antd'; // Dropdown, Menu, message, Modal qo'shildi
import {SearchOutlined, MoreOutlined, EditOutlined, DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import type {ColumnsType, TableProps} from 'antd/es/table';
import useFetch from '../../hooks/useFetch';
import {useMutation, useQueryClient} from 'react-query'; // useMutation, useQueryClient qo'shildi
import {useNavigate} from 'react-router-dom'; // useNavigate qo'shildi
import api from '../../utils/request_auth';
import useRouters from "../../hooks/useRouters.ts";
import useDebounce from "../../hooks/useDebounce.ts";
import Loading from "../../components/Loading";
import {useTranslation} from "react-i18next"; // api import qilindi.  Sizda bu fayl bor deb hisoblayapman.

// Interfeys (API dan keladigan ma'lumotlarga mos)
interface IUser {
    _id: string; // MongoDB _id
    telegram_id: number;
    phone_number: string;
    cargo_id: string;
    address: string;
    second_phone_number?: string; // Optional
    telegram_username?: string; // Optional
    createdAt: string;
    updatedAt: string;
}

interface IData {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    users: IUser[];
}

const Clients: React.FC = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {query, setQueries} = useRouters();
    const [searchText, setSearchText] = useState('');


    const {data, isLoading, isError, error, refetch} = useFetch<IData, any>(
        {
            key: ['users', query?.search], // searchText ham key ga qo'shildi.
            endpoint: '/users/get-only-users',
            searchParams: {search: query?.search}, // Qidiruv
            options: {
                enabled: true, // Boshlang'ich yuklanishda ham so'rov yuborish
            }
        }
    );

    const searchHandler = useDebounce((value: string) => {
        setQueries({search: value})
    }, 600);

    const handlePageChange = (page: number, size?: number) => {
        // setCurrentPage(page); // Kerak emas, URL o'zgarganda useEffect ishlaydi
        // setPageSize(size || 10);
        setQueries({page: page.toString(), limit: size?.toString()}); // URL parametrlarini yangilash
    };

    // O'chirish uchun useMutation
    const deleteUserMutation = useMutation(
        (userId: string) => api.delete(`/users/${userId}`),
        {
            onSuccess: () => {
                message.success(t('client_deleted_successfully'));
                queryClient.invalidateQueries({queryKey: ['users']}); // Keshni yangilash
            },
            onError: (error: any) => {
                message.error(error.response?.data?.message || t('client_deleted_error'));
            },
        }
    );

    // O'chirishni tasdiqlash uchun Modal
    const confirmDelete = (userId: string) => {
        Modal.confirm({
            title: t('delete_client'),
            content: t('attention_delete_client'),
            okText: t('yes'),
            okType: 'danger',
            cancelText: t('cancel'),
            onOk() {
                deleteUserMutation.mutate(userId); // useMutation ni ishlatish
            },
        });
    };

    const handleSearch = (value: string) => {
        setSearchText(value);
    };


    // ActionDropdown komponenti (ichki komponent)
    const ActionDropdown = ({record}: { record: IUser }) => { // IUser tipidagi record
        const handleMenuClick = (e: any) => {
            if (e.key === 'edit') {
                navigate(`/clients/edit/${record._id}`); // Edit sahifasiga yo'naltirish, _id bilan
            } else if (e.key === 'delete') {
                confirmDelete(record._id); // Tasdiqlash modalini ko'rsatish
            } else if (e.key === 'view') {
                navigate(`/clients/view/${record._id}`);
            }
        };

        const menu = (
            <Menu onClick={handleMenuClick}>
                <Menu.Item key="view" icon={<EyeOutlined/>}>{t('view')}</Menu.Item>
                <Menu.Item key="edit" icon={<EditOutlined/>}>{t('edit')}</Menu.Item>
                {/*<Menu.Item danger key="delete" icon={<DeleteOutlined/>}>{t('delete')}</Menu.Item>*/}
            </Menu>
        );

        return (
            <Space size="middle">
                <Dropdown overlay={menu} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <MoreOutlined className="text-xl"/>
                    </a>
                </Dropdown>
            </Space>
        );
    };


    const columns: ColumnsType<IUser> = [
        {
            title: 'No',
            key: 'no',
            render: (_: any, __: any, index: number) => <span>{index + 1}</span>,
            className: "min-w-[70px]",
        },
        {
            title: t('cargo_id'),
            dataIndex: 'cargo_id',
            key: 'cargo_id',
            className: "min-w-[130px]",
        },
        {
            title: t('phone_number'),
            dataIndex: 'phone_number',
            key: 'phone_number',
            className: "min-w-[170px]",
        },
        {
            title: t('addition_phone_number'),
            dataIndex: 'second_phone_number',
            key: 'second_phone_number',
            render: (text) => <span>{text || '-'}</span>, // Agar yo'q bo'lsa, '-'
            className: "min-w-[170px]",
        },
        {
            title: t('address'),
            dataIndex: 'address',
            key: 'address',
            render: (text) => (
                <Tooltip title={text}>
                    <div className="line-clamp-2">{text}</div>
                </Tooltip>
            ),
            className: "min-w-[250px]",
        },
        {
            title: t('telegram'),
            dataIndex: 'telegram_username',
            key: 'telegram_username',
            render: (text) => <span className={"line-clamp-2"}>{text ? `${text}` : '-'}</span>, // Agar yo'q bo'lsa, '-'
            className: "min-w-[190px]",
        },
        {
            title: t('date'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text) => {
                const date = new Date(text);
                return <span>{date.toLocaleDateString('ru-RU')}</span>; // DD.MM.YYYY formati
            },
            className: "min-w-[130px]",
        },
        {
            title: '',
            key: 'action',
            render: (_, record) => <ActionDropdown record={record}/>, // ActionDropdown ni ishlatish
            className: "min-w-[50px] max-w-[50px]"
        },
    ];


    // if (isLoading) {
    //     return <div>Yuklanmoqda...</div>;
    // }

    if (isError) {
        return <div>{t('error')}: {error.message}</div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-100">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <Row gutter={[16, 16]} align="middle"> {/* Asosiy o'zgarish shu yerda */}
                    <Col xs={24} sm={12}>
                        <h1 className="text-xl md:text-2xl font-semibold text-gray-700 mb-0">{t('clients')}</h1>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Input
                            placeholder={`${t('search')}...`}
                            prefix={<SearchOutlined className="text-gray-400"/>}
                            className="rounded-full border-gray-200 w-full" //w-full qo'shildi
                            size="large"
                            value={searchText}
                            onChange={(e) => {
                                handleSearch(e.target.value)
                                searchHandler(e.target.value)
                            }}
                        />
                    </Col>
                </Row>
                <div className="mb-6"> {/* Bu div endi kerak emas, Row va Col bilan o'ralgan */}

                </div>

                <div className={"relative"}>
                    <Loading open={isLoading}/>
                    <Table
                        columns={columns}
                        dataSource={data?.users}
                        rowKey="_id"
                        className="no-border-table"
                        pagination={false}
                    />
                    <div className="mt-4 flex justify-end">
                        <Pagination
                            current={Number(query?.currentPage) || 1}
                            pageSize={Number(query?.limit) || 10}
                            total={data?.total || 0}
                            onChange={handlePageChange}
                            showSizeChanger
                            pageSizeOptions={['10', '20', '50', '100']}
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Clients;