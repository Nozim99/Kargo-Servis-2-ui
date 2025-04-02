import {Table, Select, Button, Pagination, message, Upload, Input} from 'antd';
import ActionDropdown from "./componetns/ActionsDropdown.tsx";
import {ColumnsType} from "antd/es/table";
import React, {useCallback, useState} from "react";
import useFetch from "../../hooks/useFetch.ts";
import {useNavigate} from "react-router-dom";
import useRouters from "../../hooks/useRouters.ts";
import Loading from "../../components/Loading";
import queryClient from "../../services/queryClients.ts";
import api from "../../utils/request_auth.ts";
import {useMutation} from "react-query";
import {PartyStatus, partyStatusOptionsLng} from "../../utils/constants.ts";
import {useAuth} from "../../context/AuthContext.tsx";
import {useTranslation} from "react-i18next";
import {SearchOutlined, UploadOutlined} from "@ant-design/icons";
import {RcFile} from "antd/es/upload";
import useDebounce from "../../hooks/useDebounce.ts";


const Parties: React.FC = () => {
    const {t} = useTranslation()
    const navigate = useNavigate();
    const {isAdmin} = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const {query, setQueries} = useRouters();
    const [loadingParty, setLoadingParty] = useState<string>("");

    // URL dan page va limit ni olish
    React.useEffect(() => {
        const pageFromUrl = parseInt(query.page || '1', 10);
        const limitFromUrl = parseInt(query.limit || '10', 10);
        setCurrentPage(pageFromUrl);
        setPageSize(limitFromUrl);
    }, [query]);

    const {data, isLoading, isError, error, refetch} = useFetch<{
        parties: any;
        total: number;
        page: number;
        limit: number;
        totalPages: number
    }>(
        {
            key: ['parties', String(currentPage), String(pageSize), query.search],
            endpoint: '/parties/get',
            searchParams: {
                page: currentPage,
                limit: pageSize,
                search: query.search,
            },
        }
    );

    // Status o'zgartirish funksiyasi.  Backendga so'rov yuborish kerak
    // Hozircha, simulyatsiya
    const handleStatusChange = useCallback((value: string, partyId: string) => { // _id type: string
        setLoadingParty(partyId);
        api.patch(`/parties/status/${partyId}`, {status: value})
            .then(() => {
                refetch()
                message.success(t('status_changed_successfully'));
            })
            .catch(error => {
                console.error(error)
                if (error?.response?.data?.message) {
                    message.error(error?.response?.data?.message ? t(error?.response?.data?.message) : t("status_changed_error"));
                }
            })
            .finally(() => setLoadingParty(""))
    }, [refetch]);


    const handlePageChange = (page: number, size?: number) => {
        setQueries({page: page.toString(), limit: size?.toString()});
    };

    const edit_party = (id: string) => {
        navigate('/parties/edit/' + id)
    }

    const delete_party = async (id: string) => {
        await api.delete(`/parties/delete/${id}`)
    }

    const download_all_products = async (id: string, name: string) => {
        const response = await api.get('/parties/get-all-products-excel/' + id, {responseType: "blob"});
        const contentDisposition = response.headers['content-disposition'];
        let filename = `ПАРТИЯ-${name}.xlsx`;
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
    }

    const uploadPartyExcel = useMutation(
        async ({file, id}: { file: RcFile; id: string }) => {
            const formData = new FormData();
            formData.append('excel', file);
            return api.post(`/packets/create/by-excel/${id}`, formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
        },
        {
            onSuccess: () => {
                message.success(t('file_uploaded_successfully'));
                queryClient.invalidateQueries({queryKey: ['products', 'packets']});
                refetch();
            },
            onError: (err: any) => {
                message.error(err.response?.data?.message ? t(err.response?.data?.message) : t('file_upload_error'));
            },
        }
    );

    const debouncedSearch = useDebounce((value: string) => {
        setQueries({search: value})
    }, 600);


    const columns: ColumnsType = [
        {
            title: 'No', // Sarlavha
            key: 'no',
            render: (_: any, __: any, index: number) => <span>{(currentPage - 1) * pageSize + index + 1}</span>, // Tartib raqami
            className: "min-w-[80px]"
        },
        {
            title: t("download"),
            dataIndex: "download_index",
            key: "download_index",
            render: (_, record) => {
                return (
                    <Upload
                        accept=".xlsx, .xls"
                        showUploadList={false}
                        customRequest={({file}: { file: RcFile }) => {
                            uploadPartyExcel.mutate({file, id: record._id});
                        }}
                    >
                        <Button
                            icon={<UploadOutlined/>}
                            loading={uploadPartyExcel.isLoading && uploadPartyExcel.variables?.id === record._id}
                            disabled={loadingParty === record._id || (uploadPartyExcel.isLoading && uploadPartyExcel.variables?.id === record._id) || record?.status !== PartyStatus.COLLECTING}
                        >
                            {t('download_excel')}
                        </Button>
                    </Upload>
                )
            }
        },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: "min-w-[120px]"
        },
        {
            title: t('name'),
            dataIndex: 'name',
            key: 'name',
            className: "min-w-[180px]"
        },
        {
            title: t('count_of_packets'),
            dataIndex: 'packetCount',
            key: 'packetCount',
            className: "min-w-[180px]"
        },
        {
            title: t('count_of_products'),
            dataIndex: 'totalProductQuantity',
            key: 'totalProductQuantity',
            className: "min-w-[180px]"
        },
        {
            title: t('status'),
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    loading={loadingParty === record._id}
                    disabled={loadingParty === record._id || (uploadPartyExcel.isLoading && uploadPartyExcel.variables?.id === record._id)}
                    className={isAdmin ? "" : "pointer-events-none"}
                    value={status}
                    style={{width: 250}}
                    onChange={(value) => handleStatusChange(value, record._id)}
                    options={partyStatusOptionsLng(t)}
                />
            ),
        },
        {
            title: '',
            key: 'action',
            render: (party, record) => {
                console.log(party)
                return <ActionDropdown
                    disable={loadingParty === record._id || (uploadPartyExcel.isLoading && uploadPartyExcel.variables?.id === record._id)}
                    onEdit={() => edit_party(party.id)}
                    onDelete={() => delete_party(party.id)}
                    onDownloadAllProducts={party?.packetCount ? () => download_all_products(party.id, party.name) : undefined}
                />
            },
            className: "min-w-[80px]",
            width: 80
        },
    ];


    if (isError) {
        return <div>{t('error')}: {error.message}</div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-100">
            <div style={{pointerEvents: (loadingParty || uploadPartyExcel.isLoading) ? "none" : undefined}}
                 className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold">{t('parties')}</h1>
                    <div className={"flex items-center gap-4"}>
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
                        <Button
                            type="primary"
                            className="bg-blue-500 text-white rounded-full"
                            onClick={() => navigate('/parties/create')}
                        >
                            + {t('add_party')}
                        </Button>
                    </div>
                </div>
                <div className={"relative"}>
                    <Loading open={isLoading}/>

                    <Table columns={columns} dataSource={data?.parties} rowKey="_id" pagination={false}/>

                    <div className="mt-4 flex justify-end">
                        <Pagination
                            current={currentPage}
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
        </div>
    );
};

export default Parties;