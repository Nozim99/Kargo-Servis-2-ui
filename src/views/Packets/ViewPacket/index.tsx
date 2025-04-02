import {Card, Spin, Table, Alert, Descriptions, Button, message} from "antd";
import {useParams} from "react-router-dom";
import useFetch from "../../../hooks/useFetch.ts";
import {PacketStatus} from "../../../utils/constants.ts";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import api from "../../../utils/request_auth.ts";

interface IFetchData {
    packet: {
        brutto: number;
        createdAt: Date;
        id: string;
        isInternetMarket: boolean;
        packetName: string;
        partyId: string;
        passport: string;
        status: PacketStatus;
        updatedAt: Date;
        workerName: string;
        _id: string;
        partyName: string;
    };
    products: {
        createdAt: Date;
        currentcyTypeCode: number;
        hs_code: string;
        measurementCode: number;
        name: string;
        packetId: string;
        partyId: string;
        passport: string;
        price: number;
        quantity: number;
        trackId: string;
        type: number;
        updatedAt: Date;
        _id: string;
    }[];
}

export default function ViewPackets() {
    const {packetId} = useParams<{ packetId: string }>(); // Paket ID ni olish
    const {t} = useTranslation(); // Tarjima uchun
    const [loading, setLoading] = useState(false);

    const {
        data: packetData,
        isLoading: packetLoading,
        isError: packetError,
        error: packetFetchError,
    } = useFetch<IFetchData>({
        key: ["packet", packetId],
        endpoint: `/packets/${packetId}`, // Paket ma'lumotlari uchun API endpoint
        options: {
            enabled: !!packetId,
        },
    });

    const packetDetails = [
        {title: t("packet"), value: packetData?.packet?.packetName},
        {title: t("party"), value: packetData?.packet.partyName},
        {title: t("responsible"), value: packetData?.packet.workerName},
        {title: t("brutto"), value: packetData?.packet.brutto},
        {title: t("passport"), value: packetData?.packet.passport},
        {title: t("situation"), value: packetData?.packet.isInternetMarket ? "NEW" : "F/B"},
    ]


    const downloadExcel = async () => {
        try {
            setLoading(true);
            const response = await api.get('/packets/excel/' + packetId, {responseType: "blob"});
            const contentDisposition = response.headers['content-disposition'];
            let filename = `ПАКЕТ-${packetDetails[0]?.value}.xlsx`;
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
            setLoading(false);
        }
    }


    // Loading indikator
    if (packetLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large"/>
            </div>
        );
    }

    // Xatolikni chiqarish
    if (packetError) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Alert message={t("error")} description={packetFetchError?.message} type="error" showIcon/>
            </div>
        );
    }

    // Agar ma'lumot topilmasa
    if (!packetData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Alert message={t("not_found")} type="warning" showIcon/>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Paket ma'lumotlari */}
            <Card title={
                <div className="flex justify-between items-center">
                    <span>{t("packet")}</span>
                    <Button
                        loading={loading}
                        disabled={loading}
                        type={"primary"}
                        onClick={downloadExcel}
                    >
                        {t("download")}
                    </Button>
                </div>
            }>
                <Descriptions bordered column={1}>
                    {
                        packetDetails.map((item, index) => (
                            <Descriptions.Item key={index} label={item.title}>{item.value}</Descriptions.Item>
                        ))
                    }
                </Descriptions>
            </Card>
            <div className={"h-6"}></div>

            {/* Mahsulotlar ro‘yxati */}
            <Card title={t("products")}>
                <Table
                    dataSource={packetData.products}
                    rowKey="_id"
                    pagination={false}
                    // bordered
                    columns={[
                        {
                            title: t("No"),
                            dataIndex: "count",
                            key: "count",
                            className: "min-w-[70px]",
                            render: (_, __, index) => {
                                return index + 1
                            }
                        },
                        {
                            title: t("product_name"),
                            dataIndex: "name",
                            key: "name",
                            className: "min-w-[240px]",
                        },
                        {
                            title: t("quantity"),
                            dataIndex: "quantity",
                            key: "quantity",
                            className: "min-w-[100px]",
                        },
                        {
                            title: t("price"),
                            dataIndex: "price",
                            key: "price",
                            className: "min-w-[100px]",
                        },
                        {
                            title: t("hs_code"),
                            dataIndex: "hs_code",
                            key: "hs_code",
                            className: "min-w-[120px]",
                        },
                        {
                            title: t("currency_type"),
                            dataIndex: "currencyTypeCode",
                            key: "currencyTypeCode",
                            className: "min-w-[130px]",
                        },
                        {
                            title: t("type"),
                            dataIndex: "type",
                            key: "type",
                            className: "min-w-[100px]",
                        },
                    ]}
                />
            </Card>
        </div>
    );
}
