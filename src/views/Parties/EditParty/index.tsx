import React, {useEffect} from 'react';
import {Form, Input, Button, Card, Select, message} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import {useMutation, useQueryClient} from 'react-query';
import useFetch from "../../../hooks/useFetch.ts";
import api from "../../../utils/request_auth.ts";
import {partyStatusOptionsLng} from "../../../utils/constants.ts";
import {useAuth} from "../../../context/AuthContext.tsx";
import {useTranslation} from "react-i18next";
import Loading from "../../../components/Loading";

interface Party {
    _id: string;
    id: string;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    isEmpty: boolean;
}

const EditParty: React.FC = () => {
    const {t} = useTranslation();
    const {isAdmin} = useAuth();
    const {id} = useParams<{ id: string }>(); // URL dan partiya ID sini olish
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const queryClient = useQueryClient();

    // Partiya ma'lumotlarini olish
    const {data: partyData, isLoading, isError, error} = useFetch<Party, any>({
        key: ['party', id], // Kesh kaliti (partiya ID si bilan)
        endpoint: `/parties/get/${id}`, // API endpoint (partiya ID si bilan)
        options: {
            enabled: !!id, // Agar ID bo'lsa, so'rovni yuborish (useParams dan id olinmaguncha kutib turish)
        },
    });


    // Partiya ma'lumotlarini yangilash uchun useMutation
    const updatePartyMutation = useMutation(
        (updatedParty: Partial<Party>) => // Partial<Party> - barcha maydonlarni to'ldirish shart emas
            api.put(`/parties/update/${id}`, updatedParty), // API so'rovi (o'zgartiring, PATCH method)
        {
            onSuccess: () => {
                message.success(t('party_uploaded_successfully'));
                queryClient.invalidateQueries({queryKey: ['parties']}); // "parties" key'li query'ni invalidatsiya qilish
                navigate('/parties'); // Asosiy "Parties" sahifasiga qaytish
            },
            onError: (error: any) => {
                message.error(error.response?.data?.message || t('uploaded_party_error'));
            },
        }
    );

    useEffect(() => {
        // Partiya ma'lumotlari yuklanganda formani to'ldirish
        if (partyData) {
            form.setFieldsValue({
                name: partyData.name, // data.data -> data
                status: partyData.status,
            });
        }
    }, [partyData, form]);

    useEffect(() => {
        if (!id) navigate(-1)
    }, []);


    const onFinish = (values: any) => {
        updatePartyMutation.mutate(values); // useMutation ni ishga tushirish
    };

    const onFinishFailed = (errorInfo: any) => {
        console.error('Failed:', errorInfo);
    };

    if (isError) {
        return <div>{t('error')}: {error.message}</div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
            <Card bordered={false} className="w-full md:w-1/2 lg:w-1/3 mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 text-center">{t('edit_party')}</h1>
                <Form
                    form={form}
                    name="editPartyForm"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className={"relative"}
                >
                    <Loading open={isLoading}/>
                    <Form.Item
                        className={partyData?.isEmpty ? "" : "pointer-events-none"}
                        label={<span className="text-gray-700">{t('party_name')}</span>}
                        name="name"
                        rules={[{required: !!partyData?.isEmpty, message: t('input_party')}]}
                    >
                        <Input placeholder={t('party_name')} className="rounded-md" size="large"/>
                    </Form.Item>

                    <div className={!isAdmin && "hidden"}>
                        <Form.Item
                            label={<span className={`text-gray-700`}>{t('situation')}</span>}
                            name="status"
                            rules={[{required: true, message: 'Partiya holatini tanlang!'}]}
                        >
                            <Select options={partyStatusOptionsLng(t)} size="large"/>
                        </Form.Item>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-blue-500 text-white rounded-md w-full"
                            size="large"
                            loading={updatePartyMutation.isLoading} // Loading holati
                        >
                            {t('save')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default EditParty;