import React, {useState} from 'react';
import {Table, Input, Tooltip, Pagination} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import type {ColumnsType, TablePaginationConfig, TableProps} from 'antd/es/table';
import useDebounce from "../../hooks/useDebounce.ts";
import useFetch from "../../hooks/useFetch.ts";
import useRouters from "../../hooks/useRouters.ts";
import {useTranslation} from "react-i18next";

interface Product {
    id: number; //
    name: string;
    packetId: string;
    trackId: string;
    quantity: number;
    weight: number;
    price: number;
    boxStatus?: string;
}

interface IData {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
    products: Product[];
}

const Products: React.FC = () => {
    const {t} = useTranslation();
    const {query, setQueries} = useRouters();
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const debouncedSearch = useDebounce((value: string) => {
        setQueries({search: value})
    }, 600);


    const {
        data: productsData,
        isLoading,
        isError,
        error,
    } = useFetch<IData, any>( // Specify correct types.  Important!
        {
            // key: ['products', pagination.current, pagination.pageSize, debouncedSearchText],
            key: ['products', query?.page, query?.limit, query?.search],
            endpoint: '/products/get',  // Your API endpoint
            searchParams: {   // Send pagination and search params
                page: query?.page || 1,
                limit: query?.limit || 10,
                search: query?.search,
            },
            options: {
                keepPreviousData: true,
                onSuccess: (data) => {
                    setPagination(prev => ({...prev, total: data.total})); //total count
                }
            },
            generateData: (res) => res.data //  response ichidan data'ni ajratib olish
        }
    );


    // Format price function
    const formatPrice = (price: number) => {
        return price.toLocaleString('ru-RU'); // Use Russian locale for spaces
    };


    const columns: ColumnsType<Product> = [
        {
            title: 'No',
            key: 'no',
            render: (_: any, __: any, index: number) =>
                <span>{((Number(query?.page) || 1) - 1) * (Number(query?.limit || 10)) + index + 1}</span>, // Tartib raqami
            className: "min-w-[80px]",
        },
        // {
        //     title: t("track_id"),
        //     dataIndex: 'trackId',
        //     key: 'trackId',
        //     className: "min-w-[150px]",
        // },
        {
            title: t('product_name'),
            dataIndex: 'name',  // Use 'name' from the API
            key: 'productName',  // Keep a consistent key
            render: (text) => (
                <Tooltip title={text}>
                    <div className="line-clamp-2">{text}</div>
                </Tooltip>
            ),
            className: "min-w-[200px]",
        },
        {
            title: t('packet'), // No direct mapping, could be part of packetId?
            dataIndex: 'packetName',
            key: 'packetName',
            className: "min-w-[210px]",
        },
        {
            title: t("hs_code"),
            dataIndex: 'hs_code',
            key: 'hs_code',
            className: "min-w-[200px]",
        },
        {
            title: t("party"),
            dataIndex: 'partyName',
            key: 'partyName',
            className: "min-w-[200px]",
        },
        {
            title: t('quantity'),
            dataIndex: 'quantity',
            key: 'quantity',
            className: "min-w-[150px]",
        },
        {
            title: t('price'),
            dataIndex: 'price',
            key: 'price',
            className: "min-w-[140px]",
            render: (price) => <span>{formatPrice(price)}</span>, // Format price
        },
        {
            title: t('total_price'),
            dataIndex: 'price', // Calculate total price * quantity
            key: 'totalPrice',
            className: "min-w-[180px]",
            render: (price, record) => <span>{formatPrice(price * record.quantity)}</span>, // Format price
        },
        {
            title: t("measurement_type"),
            dataIndex: 'measurementCode', // Calculate total price * quantity
            key: 'measurementCode',
            className: "min-w-[180px]",
        },
        {
            title: t("currency_type"),
            dataIndex: 'currencyTypeCode', // Calculate total price * quantity
            key: 'currencyTypeCode',
            className: "min-w-[180px]",
        },
        {
            title: t("passport"),
            dataIndex: 'passport', // Calculate total price * quantity
            key: 'passport',
            className: "min-w-[180px]",
        },
    ];


    const handlePageChange = (page: number, size?: number) => {
        setQueries({page: page.toString(), limit: size?.toString()}); // URL parametrlarini yangilash
    };

    if (isError) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-100">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div
                    className="mb-10 flex flex-col justify-between gap-[10px] min-[500px]:flex-row min-[500px]:items-center">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-700">{t('products')}</h1>
                    {/* Filtrlash qatori */}
                    <div className={"w-[200px] sm:w-[300px]"}>
                        <Input
                            placeholder={`${t('search')}...`}
                            prefix={<SearchOutlined className="text-gray-400"/>}
                            className="rounded-full border-gray-200"
                            size="large"
                            defaultValue={query?.search}
                            onChange={(e) => debouncedSearch(e.target.value)}
                        />
                    </div>
                </div>
                <Table
                    loading={isLoading}
                    pagination={false}
                    columns={columns}
                    dataSource={productsData?.products || []} // Use data from useFetch
                    rowKey="_id"
                    className="no-border-table"

                />
                <div className="mt-4 flex justify-end">
                    <Pagination
                        current={Number(query?.page) || 1}
                        pageSize={productsData?.limit || 1}
                        total={productsData?.total || 0}
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

export default Products;