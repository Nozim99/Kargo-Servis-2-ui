import {Form, Input, Button, Card, message, InputRef} from 'antd';
import {useNavigate} from 'react-router-dom';
import {useMutation, useQueryClient} from 'react-query';
import api from "../../../utils/request_auth.ts";
import React, {useEffect, useRef} from "react";
import {useTranslation} from "react-i18next";

const CreateParty: React.FC = () => {
    const {t} = useTranslation();
    const [form] = Form.useForm();
    const inputRef = useRef<InputRef>(null)
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // useMutation hook'i
    const createPartyMutation = useMutation(
        (newParty: any) => api.post('/parties/create', newParty), // API so'rovi (o'zgartiring)
        {
            onSuccess: () => { // Muvaffaqiyatli bo'lganda
                message.success(t('party_created_successfully'));
                queryClient.invalidateQueries({queryKey: ['parties']}); // "parties" key'li query'ni invalidatsiya qilish
                navigate('/parties');
            },
            onError: (error: any) => { // Xatolik bo'lganda
                message.error(error.response?.data?.message ? t(error.response?.data?.message) : t('party_created_error'));
                console.error("Create party error", error)
            },
        }
    );

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus(); // Inputga fokus berish
        }
    }, []);


    const onFinish = (values: any) => {
        createPartyMutation.mutate(values); // useMutation ni ishga tushirish
    };

    const onFinishFailed = (errorInfo: any) => {
        console.error('Failed:', errorInfo);
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
            <Card bordered={false} className={""}>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-6 text-start">{t('create_party')}</h1>
                <Form
                    className={"w-full lg:w-2/3 xl:w-[500px]"}
                    form={form}
                    name="createPartyForm"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label={<span className="text-gray-700">{t('party_name')}</span>}
                        name="name"
                        rules={[{required: true, message: t('input_party')}]}
                    >
                        <Input ref={inputRef} placeholder={t('party_name')} className="rounded-md" size="large"/>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="bg-blue-500 text-white rounded-md w-full"
                            size="large"
                            loading={createPartyMutation.isLoading}
                        >
                            {t('create')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default CreateParty;