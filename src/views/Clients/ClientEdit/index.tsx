import {useEffect} from 'react';
import {Form, Input, Button, Card, message, Upload, Spin, Row, Col, Divider} from 'antd';
import {useParams, useNavigate} from 'react-router-dom';
import {PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import useFetch from "../../../hooks/useFetch.ts";
import api from "../../../utils/request_auth.ts";
import {BASE_URL} from "../../../utils/constants.ts";
import {useMutation} from "react-query";
import queryClient from "../../../services/queryClients.ts";
import {useTranslation} from "react-i18next";

interface IUser {
    _id: string;
    telegram_id: number;
    phone_number: string;
    second_phone_number?: string;
    cargo_id: string;
    address: string;
    telegram_username?: string;
    createdAt: string;
    updatedAt: string;
    passports: IPassport[];
}

interface IPassport {
    _id: string;
    cargo_id: string;
    full_name: string;
    series: string;
    pinfl: string;
    passport_front: string;
    passport_back: string;
    createdAt: string;
    updatedAt: string;
}

const EditClient: React.FC = () => {
    const {t} = useTranslation();
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();


    const {data: userData, isLoading, isError, error} = useFetch<IUser, any>({
        key: ['user', id],
        endpoint: `/users/with-passports/${id}`,
        options: {
            enabled: !!id,
        },
        generateData: (res) => res.data
    });

    const updateUserMutation = useMutation(
        (updatedUser: any) => api.put(`/users/${id}`, updatedUser),
        {
            onSuccess: () => {
                message.success(t("user_data_updated_successfully"));
                queryClient.invalidateQueries({queryKey: ['users']}); // "users" key'li query'ni invalidatsiya qilish
                navigate('/clients'); // Mijozlar ro'yxatiga qaytish
            },
            onError: (error: any) => {
                message.error(error.response?.data?.message || t("user_data_updated_error"));
            },
        }
    )

    useEffect(() => {
        if (userData) {
            const user = userData;
            const initialFormValues = {
                cargo_id: user.cargo_id,
                address: user.address,
                phone_number: user.phone_number,
                second_phone_number: user.second_phone_number,
                telegram_username: user.telegram_username,
                passports: user.passports.map((passport: IPassport) => {
                    return {
                        _id: passport._id,
                        full_name: passport.full_name,
                        series: passport.series,
                        pinfl: passport.pinfl,
                        passport_front: passport.passport_front ? [{
                            uid: passport._id + '_front',
                            name: 'passport_front.jpg',
                            status: 'done',
                            url: `${BASE_URL}${passport.passport_front}`,
                            thumbUrl: `${BASE_URL}${passport.passport_front}`
                        }] : [], // Initial rasm URL bilan
                        passport_back: passport.passport_back ? [{
                            uid: passport._id + '_back',
                            name: 'passport_back.jpg',
                            status: 'done',
                            url: `${BASE_URL}${passport.passport_back}`,
                            thumbUrl: `${BASE_URL}${passport.passport_back}`,
                        }] : [], // Initial rasm URL bilan
                    }
                }),
            };
            form.setFieldsValue(initialFormValues);

        }
    }, [userData, form]);


    const onFinish = async (values: any) => {
        updateUserMutation.mutate(values);
    };


    const handleImageChange = (info: any) => {
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} ${t('file_upload_successfully')}`);
            return info.fileList; // qaytarish fayllar ro'yxatini
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} ${t('file_upload_error')}`);
        }
        return info.fileList; // qaytarish fayllar ro'yxatini
    };

    const removePassport = (remove: any, fieldName: number) => {
        remove(fieldName)
    }

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div style={{marginTop: 8}}>{t("download")}</div>
        </div>
    );


    if (isError) {
        return <div>{t("error")}: {error.message}</div>;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
            <Card bordered={false} className="w-full mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4 text-center">{t('edit_client')}</h1>
                <Spin spinning={isLoading}>
                    <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
                        {/* Foydalanuvchi ma'lumotlari */}
                        <Row gutter={[16, 16]}>
                            <Col xs={24} lg={12} xl={8}>
                                <Form.Item label={t('cargo_id')} name="cargo_id">
                                    <Input disabled/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12} xl={8}>
                                <Form.Item
                                    label={t('address')}
                                    name="address"
                                    rules={[{required: true, message: t("input_address")}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12} xl={8}>
                                <Form.Item
                                    label={t('phone_number')}
                                    name="phone_number"
                                    rules={[{required: true, message: t('input_phone_number')}]}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12} xl={8}>
                                <Form.Item label={t('addition_phone_number_2')} name="second_phone_number">
                                    <Input/>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12} xl={8}>
                                <Form.Item
                                    label={t('telegram_username')}
                                    name="telegram_username"
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Divider/>

                        {/* Passportlar (Form.List) */}
                        <Form.List name="passports">
                            {(fields, {remove}) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Card
                                            key={field.key}
                                            title={`${t('passport')} ${index + 1}`}
                                            className="mb-4"
                                            extra={fields.length > 1 &&
                                                <Button danger onClick={() => removePassport(remove, field.name)}
                                                        icon={<DeleteOutlined/>}/>}

                                        >
                                            <Row gutter={[16, 16]}>
                                                <Col xs={24} lg={12} xl={8}>
                                                    <Form.Item
                                                        {...field}
                                                        label={t('full_name')}
                                                        name={[field.name, 'full_name']}
                                                        fieldKey={[field.fieldKey, 'full_name']}
                                                        rules={[{required: true, message: t('input_full_name')}]}
                                                    >
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} lg={12} xl={8}>
                                                    <Form.Item
                                                        {...field}
                                                        label={t('passport_series')}
                                                        name={[field.name, 'series']}
                                                        fieldKey={[field.fieldKey, 'series']}
                                                        rules={[{
                                                            required: true,
                                                            message: t('input_passport_series')
                                                        }]}
                                                    >
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} lg={12} xl={8}>
                                                    <Form.Item
                                                        {...field}
                                                        label="PINFL"
                                                        name={[field.name, 'pinfl']}
                                                        fieldKey={[field.fieldKey, 'pinfl']}
                                                        rules={[{required: true, message: t('input_pinfl')}]}
                                                    >
                                                        <Input/>
                                                    </Form.Item>
                                                </Col>

                                                {/* Passport oldi rasmi */}
                                                <Col span={24}>
                                                    <div className={"flex gap-[30px]"}>
                                                        <Form.Item
                                                            className={"inline-block"}
                                                            {...field}
                                                            label={t('passport_front')}
                                                            name={[field.name, 'passport_front']}
                                                            fieldKey={[field.fieldKey, 'passport_front']}
                                                            valuePropName="fileList"
                                                            getValueFromEvent={(e) => {
                                                                if (Array.isArray(e)) {
                                                                    return e;
                                                                }
                                                                return e?.fileList;
                                                            }}
                                                        >
                                                            <Upload
                                                                listType="picture-card"
                                                                maxCount={1}
                                                                beforeUpload={() => false}
                                                                onChange={handleImageChange}
                                                                fileList={form.getFieldValue(['passports', index, 'passport_front'])}
                                                                disabled={true}
                                                            >
                                                                {form.getFieldValue(['passports', index, 'passport_front'])?.length >= 1 ? null : uploadButton}
                                                            </Upload>
                                                        </Form.Item>

                                                        {/* Passport orqa rasmi */}
                                                        <Form.Item
                                                            className={"inline-block"}
                                                            {...field}
                                                            label={t('passport_back')}
                                                            name={[field.name, 'passport_back']}
                                                            fieldKey={[field.fieldKey, 'passport_back']}
                                                            valuePropName="fileList"
                                                            getValueFromEvent={(e) => {
                                                                if (Array.isArray(e)) {
                                                                    return e;
                                                                }
                                                                return e?.fileList;
                                                            }}

                                                        >
                                                            <Upload
                                                                listType="picture-card"
                                                                maxCount={1}
                                                                beforeUpload={() => false}
                                                                onChange={handleImageChange}
                                                                fileList={form.getFieldValue(['passports', index, 'passport_back'])}
                                                                disabled={true}
                                                            >
                                                                {form.getFieldValue(['passports', index, 'passport_back'])?.length >= 1 ? null : uploadButton}
                                                            </Upload>
                                                        </Form.Item>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Card>
                                    ))}
                                </>
                            )}
                        </Form.List>

                        <Form.Item>
                            <Button loading={updateUserMutation.isLoading} type="primary" htmlType="submit">
                                {t('save')}
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default EditClient;