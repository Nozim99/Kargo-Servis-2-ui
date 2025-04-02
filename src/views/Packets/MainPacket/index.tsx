import React, {useState} from 'react';
import {Input, message, Pagination, Table} from 'antd';
import {
    SearchOutlined,
} from '@ant-design/icons';
import type {ColumnsType, TableProps} from 'antd/es/table';
import useRouters from "../../../hooks/useRouters.ts";
import useFetch from '../../../hooks/useFetch';
import {useMutation, useQueryClient} from 'react-query';
import {PacketStatus} from "../../../utils/constants.ts";
import api from "../../../utils/request_auth.ts";
import Loading from "../../../components/Loading";
import useDebounce from "../../../hooks/useDebounce.ts";
import {useTranslation} from "react-i18next";
import {ActionDropdown} from "./ActionDropdown.tsx";


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

const Packets: React.FC = () => {
    const {t} = useTranslation();
    const {navigateTo, query, setQueries} = useRouters();
    const [searchText, setSearchText] = useState(query?.search || '');
    const [currentPage, setCurrentPage] = useState(query?.currentPage || 1);
    const [pageSize, setPageSize] = useState(10);
    const queryClient = useQueryClient();


    React.useEffect(() => {
        const pageFromUrl = parseInt(query.page || '1', 10);
        const limitFromUrl = parseInt(query.limit || '10', 10);
        if (pageFromUrl !== currentPage) {
            setCurrentPage(pageFromUrl);
        }
        if (limitFromUrl !== pageSize) {
            setPageSize(limitFromUrl);
        }
    }, [query]);  //query o'zgarganda, effect ishga tushadi

    const {data, isLoading, isError, error, refetch} = useFetch<{
        packets: IPacket[];
        total: number;
        page: number;
        limit: number;
        totalPages: number
    }, any>(
        {
            key: ['packets', String(currentPage), String(pageSize), query?.search], // Kesh kaliti (page, pageSize, searchText ga bog'liq)
            endpoint: '/packets', // API endpoint
            searchParams: {
                page: currentPage,
                limit: pageSize,
                search: searchText, // Qidiruv so'rovi
            },
        }
    );


    const columns: ColumnsType<IPacket> = [
        {
            title: 'No',
            key: 'no',
            render: (_: any, __: any, index: number) => <span>{(Number(currentPage) - 1) * pageSize + index + 1}</span>, // Tartib raqami
            className: "min-w-[70px]"
        },
        {
            title: t("responsible"),
            dataIndex: 'workerName', // _id o'rniga boxId (sizning ma'lumotlaringizda shunday)
            key: 'workerName',
            className: "min-w-[200px]",
        },
        {
            title: t('party'),
            dataIndex: 'partyName', // _id o'rniga boxId (sizning ma'lumotlaringizda shunday)
            key: 'partyName',
            className: "min-w-[160px]",
        },
        {
            title: t('packet'),
            dataIndex: 'packetName',
            key: 'packetName',
            className: "min-w-[200px]",
        },
        {
            title: t("situation"),
            dataIndex: 'isInternetMarket',
            key: 'isInternetMarket',
            className: "min-w-[120px]",
            render: (value) => value ? "NEW" : "B/U"
        },
        {
            title: t("brutto"),
            dataIndex: 'brutto',
            key: 'brutto',
            className: "min-w-[110px]",
        },
        {
            title: t('count_of_products'),
            dataIndex: 'totalQuantity',
            key: 'totalQuantity',
            className: "min-w-[170px]",
        },
        {
            title: t('total_price'),
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            className: "min-w-[150px]",
            render: (value: number) => value ? value.toFixed(2) : 0
        },
        {
            title: t("passport_series"),
            dataIndex: 'passport',
            key: 'passport',
            className: "min-w-[200px]",
        },
        {
            title: t('date'),
            dataIndex: 'createdAt',
            key: 'createdAt',
            className: "min-w-[110px]",
            render: (value: Date) => new Intl.DateTimeFormat("ru-RU").format(new Date(value))
        },
        {
            title: t("actions"),
            dataIndex: "actions",
            key: "actions",
            render: (_, record) => <ActionDropdown record={record}/>
        },
    ];

    const handleSearchDebounce = useDebounce((value: string) => {
        setQueries({search: value, page: "1"}); // URL parametrlarini yangilash, page=1
    }, 600);

    // Qidiruv funksiyasi (faqat URL parametrlarini o'zgartiradi, so'rovni qayta yubormaydi)
    const handleSearch = (value: string) => {
        setSearchText(value); // Mahalliy state ni yangilash
        handleSearchDebounce(value)
    };
    const handlePageChange = (page: number, size?: number) => {
        setQueries({page: page.toString(), limit: size?.toString()}); // URL parametrlarini yangilash
    };

    if (isError) {
        return <div>{t('error')}: {error.message}</div>; // Yoki error.response.data.message
    }

    const tableParams: TableProps<IPacket> = {
        bordered: false,
        showHeader: true,

    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-100">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-700">
                        {t('packets')}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Input
                            placeholder={t('search')}
                            prefix={<SearchOutlined className="text-gray-400"/>}
                            className="rounded-full border-gray-200"
                            size="large"
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)} // Faqat mahalliy state ni o'zgartirish
                        />
                    </div>
                </div>

                <div className={"relative"}>
                    <Loading open={isLoading}/>
                    <Table
                        {...tableParams}
                        columns={columns}
                        dataSource={data?.packets} // data.boxes (agar API shunday qaytarsa)
                        rowKey="_id" // MongoDB _id
                        className="no-border-table"
                        pagination={false}
                    />
                </div>
                {/*Paginatsiya*/}
                <div className="mt-4 flex justify-end">
                    <Pagination
                        current={Number(currentPage)}
                        pageSize={pageSize}
                        total={data?.total || 0}
                        onChange={handlePageChange}
                        showSizeChanger
                        pageSizeOptions={['10', '20', '50', '100']}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    />
                </div>
            </div>
        </div>
    );
};

export default Packets;
